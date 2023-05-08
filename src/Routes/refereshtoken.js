const express = require('express');
const jwt = require('jsonwebtoken');
const router = require("express").Router();
const app = express();

// A secret key to sign JWT tokens
// const jwtSecret = 'mysecretkey';



// Route to exchange refresh token for a new JWT token
router.post('/token', (req, res) => {
  try {
    const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(401).send('Refresh token not provided');
    return;
  }

  jwt.verify(refreshToken, process.env.JWT_SECRERT_KEY, (err, decoded) => {
    if (err) {
      res.status(401).send('Invalid refresh token');
      return;
    }
     console.log({ id: decoded.id, username: decoded.username, email: decoded.email })
    const accessToken = jwt.sign({ id: decoded.id, username: decoded.username, email: decoded.email }, process.env.JWT_SECRERT_KEY, { expiresIn: '10m' });
    res.json({ accessToken });
  });
  } catch (error) {
    res.status(500).send('internal server error');
  }
  
});


// Middleware to check JWT token
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) {
//     res.status(401).send('Access token not provided');
//     return;
//   }

//   jwt.verify(token, process.env.JWT_SECRERT_KEY, (err, decoded) => {
//     if (err) {
//       res.status(401).send('Invalid access token');
//       return;
//     }

//     req.username = decoded.username;
//     next();
//   });
// }

// Example protected route
// router.get('/protected', authenticateToken, (req, res) => {
//   res.send(`Welcome, ${req.username}!`);
// });


module.exports = router;