const express = require('express');
const jwt = require('jsonwebtoken');
const router = require("express").Router();
const app = express();

// A secret key to sign JWT tokens
const jwtSecret = 'mysecretkey';

// Route for user login
router.post('/login', (req, res) => {
  // Check user credentials
  const { username, password } = req.body;
  if (username === 'myuser' && password === 'mypassword') {
    // User is authenticated, generate a JWT token and refresh token
    const accessToken = jwt.sign({ username }, jwtSecret, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ username }, jwtSecret, { expiresIn: '7d' });
    res.json({ accessToken, refreshToken });
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Route to exchange refresh token for a new JWT token
router.post('/token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(401).send('Refresh token not provided');
    return;
  }

  jwt.verify(refreshToken, jwtSecret, (err, decoded) => {
    if (err) {
      res.status(401).send('Invalid refresh token');
      return;
    }

    const accessToken = jwt.sign({ username: decoded.username }, jwtSecret, { expiresIn: '10m' });
    res.json({ accessToken });
  });
});

// Middleware to check JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).send('Access token not provided');
    return;
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      res.status(401).send('Invalid access token');
      return;
    }

    req.username = decoded.username;
    next();
  });
}

// Example protected route
router.get('/protected', authenticateToken, (req, res) => {
  res.send(`Welcome, ${req.username}!`);
});


module.exports = router;