const express = require('express');
const router = express.Router();
const https = require("https");
const mysql = require("mysql2")
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require("dotenv").config()

router.use(express.urlencoded({extended:true}))
router.use(cookieParser())

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,   
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10
});

pool.query(`CREATE TABLE IF NOT EXISTS users (    id INT AUTO_INCREMENT PRIMARY KEY,    full_name VARCHAR(255) 
NOT NULL,    matric_number VARCHAR(20) UNIQUE NOT NULL,    department VARCHAR(255) NOT NULL,    phone VARCHAR(20)UNIQUE NOT NULL,    date_of_birth DATE NOT NULL)`)

function getUser(req){
  const authToken = req.cookies.auth_token;

  if (!authToken) {
    return null; // Return null if no auth token is present
  }

  try {
    const decodedToken = jwt.verify(authToken, 'your_secret_key');
    const user = decodedToken;
    return user.user;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null; // Return null if token verification fails
  }
}


router.get("/", ( req, res)=> {
  res.redirect("/index.html");
})

router.get('/*.html', (req, res) => {
    let file = req.params.file;
  res.sendFile(`${file}.html`, { root: `${__dirname}/public` });
});

router.get('/logout', (req, res) => {
  // Clear the auth_token cookie
  res.clearCookie('auth_token');

  // Redirect to the index page
  res.redirect('/');
});

router.get('/getuser', (req, res) => {
  const user = getUser(req)
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }

});

router.post('/login', (req, res) => {
  const {  matno, phone } = req.body;

  pool.query('SELECT * FROM users WHERE matric_number = ? AND phone = ?', [matno, phone], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error logging in');
    } else if (results.length === 0) {
      // User not found
      res.status(401).send('Invalid credentials');
    } else {
      // Create JWT token
      const user = results[0];
      const token = jwt.sign({user}, 'your_secret_key', { expiresIn: '1h' });

      // Set JWT token as a cookie
      res.cookie('auth_token', token, { httpOnly: true });

      // Redirect to user.html
      res.redirect('/user.html');
    }
  });
});



router.post('/signup', (req, res) => {
  console.log("Starting")
  const { fullname, matno, phone, dob, department } = req.body;

  // Validate input data (e.g., check for empty fields, valid phone number, etc.)
  console.log(req.body)
  // Check if user already exists
  pool.query('SELECT * FROM users WHERE phone = ? OR matric_number = ?', [phone, matno], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error ', err);
    } else if (results.length > 0) {
      // User already exists
      res.status(409).send('User already exists');
    } else {
      // Create new user
      pool.query('INSERT INTO users (full_name, matric_number, phone, date_of_birth, department) VALUES (?, ?, ?, ?, ?)', [fullname, matno, phone, dob, department], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error creating user');
        } else {
          // Create JWT token
          pool.query("SELECT * FROM users WHERE id=?", [result.insertId], (err,user)=> {

            console.log("Recieved ", user[0])
          const token = jwt.sign({user:user[0]}, 'your_secret_key', { expiresIn: '1h' });
          // Set JWT token as a cookie
          res.cookie('auth_token', token, { httpOnly: true });

          // Redirect to user.html
          res.redirect('/user.html');
        })
        }
      });
    }
  });
});




router.post("/whatsapp", (req,res)=>{
    let user = getUser(req)
    let message = `Name: ${ user.full_name}\n Department: ${ user.department}\n Matric No: ${user.matric_number}\n Test answers:\n` ;
    message+=req.body.message
    console.log("Received:")
    console.log(message)
    let encoded = encodeURI(message)
    res.status(200).send(`https://wa.me/${process.env.PSY_NUMBER}?text=${encoded}`)
})

router.get("/booking", (req,res)=>{
    let user = getUser(req)
    console.log(user)
    let message = ` Booking of Appointment \nName: ${ user.full_name}\n Department: ${ user.department}\n Matric No: ${user.matric_number}.` ;
  
    console.log(message)
    let encoded = encodeURI(message)
    res.status(200).send(`https://wa.me/${process.env.PSY_NUMBER}?text=${encoded}`)
})

module.exports = router;
