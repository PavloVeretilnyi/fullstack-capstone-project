const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  // Import Pino logger

const logger = pino();  // Create a Pino logger instance

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
        const collection = db.collection("users");

        //Task 3: Check for existing email
        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;

        //Task 4: Save user details in database
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

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({authtoken,email});
    } catch (e) {
         return res.status(500).send('Internal server error');
    }
});

module.exports = router;

/*
❗No input validation (even though you imported express-validator)
You imported:
const { body, validationResult } = require('express-validator');
But you are NOT using it.
Recommended validation:
router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty(),
    body('lastName').notEmpty()
  ],
  async (req, res) => {

And inside handler:
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
}

❗JWT_SECRET not validated
If .env is missing JWT_SECRET, jwt.sign() will crash.
Add safety check:
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
}

❗ Token should have expiration
Right now:
const authtoken = jwt.sign(payload, JWT_SECRET);
Better:
const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

❗ Unused variable
This line is unnecessary:
const app = express();
You don’t need app inside authRoutes.js. Remove it.

⚠ Minor: You hash password before checking if email exists
Move hashing after email existence check to avoid unnecessary work.

✅ Improved authRoutes.js (Clean Version):

const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');

const logger = pino();
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty(),
    body('lastName').notEmpty()
  ],
  async (req, res) => {
    try {
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET not defined");
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const db = await connectToDatabase();
      const collection = db.collection("users");

      const existingEmail = await collection.findOne({ email: req.body.email });

      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(req.body.password, salt);

      const newUser = await collection.insertOne({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hash,
        createdAt: new Date(),
      });

      const payload = {
        user: { id: newUser.insertedId },
      };

      const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      logger.info('User registered successfully');

      res.json({ authtoken, email: req.body.email });

    } catch (e) {
      logger.error(e);
      return res.status(500).send('Internal server error');
    }
});
*/