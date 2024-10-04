const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const router = require('./handler');
 
dotenv.config(); // Load environment variables from .env file
 
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use("/", router)

// ... rest of your routes and configuration ...

// Start the server
const port = process.env.PORT || 3000; // Use PORT from .env or default to 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});