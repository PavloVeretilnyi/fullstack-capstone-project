const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  // Import Pino logger
const { body, validationResult } = require('express-validator');

const logger = pino();  // Create a Pino logger instance

//Create JWT secret
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
      //Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`.
      const db = await connectToDatabase();

      //Access the `users` collection
      const collection = db.collection("users");

      //Check for existing email in DB
      const existingEmail = await collection.findOne({ email: req.body.email });

        if (existingEmail) {
            logger.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email=req.body.email;
        console.log('email is',email);

        //Save user details
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        //Create JWT
        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({ authtoken,email });
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

    //Login Endpoint
router.post('/login', async (req, res) => {
    console.log("\n\n Inside login")

    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const theUser = await collection.findOne({ email: req.body.email });

        if (theUser) {
            let result = await bcryptjs.compare(req.body.password, theUser.password)
            if(!result) {
                logger.error('Passwords do not match');
                return res.status(401).json({ error: 'Wrong password' });
            }
            let payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };

            const userName = theUser.firstName;
            const userEmail = theUser.email;

            const authtoken = jwt.sign(payload, JWT_SECRET);
            logger.info('User logged in successfully');
            return res.status(200).json({ authtoken, userName, userEmail });
        } else {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
      }
});

router.put('/update', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const email = req.headers.email;

        if (!email) {
            logger.error('Email not found in the request headers');
            return res.status(400).json({ error: "Email not found in the request headers" });
        }
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const existingUser = await collection.findOne({ email });
        if (!existingUser) {
            logger.error('User not found');
            return res.status(404).json({ error: "User not found" });
        }
        existingUser.firstName = req.body.name;
        existingUser.updatedAt = new Date();

        const updatedUser = await collection.findOneAndUpdate(
            { email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );
        
        const payload = {
            user: {
                id: updatedUser._id.toString(),
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User updated successfully');

        res.json({authtoken});
    } catch (error) {
        logger.error(error);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;

/*
🔴 1️⃣This line is incorrect:
const payload = {
    user: {
        id: updatedUser._id.toString(),
    },
};
But findOneAndUpdate() returns an object with .value, not the document directly.
So updatedUser._id will be undefined.
Fix
const payload = {
    user: {
        id: updatedUser.value._id.toString(),
    },
};

🔴 2️⃣ Wrong Field Name in Update
You assign:
existingUser.firstName = req.body.name;
But registration stores:
firstName: req.body.firstName
So req.body.name is wrong.
Fix
existingUser.firstName = req.body.firstName;

🟡 3️⃣ You Imported express-validator But Didn’t Use It
You imported:
const { body, validationResult } = require('express-validator');
But no validation middleware exists like:
body('email').isEmail()
So currently validationResult will always be empty.
Either remove it:
// remove
const { body, validationResult } = require('express-validator');
or add validation:
router.put(
  '/update',
  body('firstName').notEmpty(),
  async (req,res)=>{ ... }
)

🟡 4️⃣ Updating Entire User Object (Risky)
You do:
{ $set: existingUser }
But existingUser includes:

_id
email
password
createdAt

Updating _id is not recommended.
Better
{ 
  $set: {
    firstName: req.body.firstName,
    updatedAt: new Date()
  }
}

🟡 5️⃣ /update Authentication is Weak
You identify the user via:
const email = req.headers.email;
This is not secure.
Anyone could update a user by sending:
email: someone@gmail.com
Better approach:
Use JWT token verification.
Example:
const decoded = jwt.verify(req.headers.authorization.split(" ")[1], JWT_SECRET);
But for a course assignment, your current version is usually acceptable.

*/