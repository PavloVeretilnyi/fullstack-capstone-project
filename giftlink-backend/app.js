/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const {loadData} = require("./util/import-mongo/index");


const app = express();
app.use("*",cors());
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));


app.use(express.json());

// Route files
const giftRoutes = require('./routes/giftRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');
const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
app.use('/api/gifts', giftRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/",(req,res)=>{
    res.send("Inside the server");
});
//for navbar.js link to work properky
/*app.get('/app*', (req, res) => {
*    res.redirect('/');
});*/

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

/*
⚠ This line is incorrect:
app.use("*",cors());
This is not needed.
✅ Correct way:
app.use(cors());

⚠ Double Logger Setup
You use:
const pinoLogger = require('./logger');
const logger = require('./logger');
This is redundant.
Keep only one:
const logger = require('./logger');


*/