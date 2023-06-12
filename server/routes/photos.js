const express = require('express');
const router = express.Router();
const multer = require('multer');
const DatauriParser = require('datauri/parser');
const path = require('path');
const { S3 } = require('aws-sdk');
const mysql = require('mysql2/promise');

const upload = multer({ dest: 'uploads/' });
const jwt = require('jsonwebtoken');

// MySQL db connection
const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
});

// Setup AWS S3
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Middleware for verifying JWT and identifying the user
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
      const token = authHeader.split(' ')[1];
  
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
  
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };

// multer configuration
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('file');
const parser = new DatauriParser();

const dataUri = req => parser.format(path.extname(req.file.originalname).toString(), req.file.buffer);

// Routes
router.post('/upload', multerUploads, authenticateJWT, async (req, res) => {
  try {
    const file = dataUri(req).content;
    const result1 = await s3.upload({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `user-${req.user.id}/${Date.now()}-${req.file.originalname}`,
      Body: file,
    }).promise();

    const imageUrl = result1.Location;

    // Save the imageUrl in your database
    const [result] = await pool.query(
      'INSERT INTO photo (user_id, imageUrl) VALUES (?, ?)',
      [req.user.id, imageUrl]
    );

    res.status(200).json({
      message: "Your image has been uploaded successfully to amazon s3",
      data: {
        imageUrl
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/photos', authenticateJWT, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT imageUrl FROM photo WHERE user_id = ?',
    [req.user.id]
  );
  res.json(rows);
});

module.exports = router;
