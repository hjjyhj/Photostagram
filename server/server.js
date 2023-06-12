require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(cookieParser());

// MySQL db connection
const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Cloudinary upload
app.post('/upload', async (req, res) => {
  const fileStr = req.body.data;
  const uploadResponse = await cloudinary.uploader.upload(fileStr, {
    upload_preset: process.env.UPLOAD_PRESET
  });

  if (uploadResponse.error) {
    res.status(500).json({ error: uploadResponse.error.message });
  }

  res.json({ url: uploadResponse.secure_url });
});

app.post('/addphoto', async (req, res) => {
  try {
    const photoUrl = req.body.url;

    const authToken = req.cookies.AuthToken; // Get the auth token from the cookies

    if (!authToken) {
      return res.status(403).json({ detail: "No authorization token provided" });
    }

    // Verify and decode the token
    let decoded;
    try {
      decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ detail: "Invalid authorization token" });
    }

    const userId = decoded.id; // Extract user id from the decoded information

    // Rest of your code
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: err.message });
  }
});


// get users
app.get('/person', async (req, res) => {
  const [results] = await pool.query('SELECT * FROM person');
  res.json(results);
});

// sign up
app.post('/signup', async (req, res) => {
  const {email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log(`Hashed password: ${hashedPassword}`);  // Debugging line

  try {
    const [results] = await pool.query(
      'INSERT INTO person (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    
    const token = jwt.sign({ id: results.insertId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log(`Generated token: ${token}`);  // Debugging line

    res.status(201).json({ id: results.insertId, email, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ detail: err.message });
  }
});

// log in
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM person WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ detail: 'User does not exist'});

    const user = users[0];
    const success = await bcrypt.compare(password, user.password);

    console.log(`Password check: ${success}`);  // Debugging line

    if (success) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      console.log(`Generated token: ${token}`);  // Debugging line

      res.json({ id: user.id, email: user.email, token });
    } else {
      res.status(401).json({ detail: 'Login failed' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ detail: err.message });
  }
});


// Use photos routes
app.use('/api/photos', photos);

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
