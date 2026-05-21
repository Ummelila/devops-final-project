const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'devopsdb'
});

db.connect((err) => {
  if (err) {
    console.log('DB Connection Error:', err);
  } else {
    console.log('Database Connected!');
    
    // Table banao agar exist nahi karta
    db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);
  }
});

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running! BSE-8B DevOps Project' });
});

// Register API
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: 'User already exists!' });
      }
      res.json({ message: 'Registration successful!' });
    }
  );
});

// Login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials!' });
      }
      
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials!' });
      }
      
      const token = jwt.sign(
        { userId: user.id },
        'secret_key',
        { expiresIn: '1h' }
      );
      
      res.json({ 
        message: 'Login successful!',
        token: token,
        username: user.username
      });
    }
  );
});
app.get('/api/users', (req, res) => {
  db.query('SELECT id, username, email FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});
app.listen(5000, () => {
  console.log('Backend running on port 5000');
});