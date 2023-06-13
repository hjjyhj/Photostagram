require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// MySQL db connection
const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
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

  try {
    const [results] = await pool.query(
      'INSERT INTO person (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    
    const token = jwt.sign({ id: results.insertId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

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

    if (success) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ id: user.id, email: user.email, token });
    } else {
      res.status(401).json({ detail: 'Login failed' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ detail: err.message });
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});