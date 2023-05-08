const router = require("express").Router();
const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const moment = require('moment');
const bcrypt = require("bcrypt");
const User = require("../models/usermodel");
const checkuserAuth = require("../middleware/auth")



// Forgot password page
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

// Handle forgot password form submission
router.post('/forgot-password',checkuserAuth, async (req, res) => {
    try {
        const email = req.body.email;

        const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
    
      // Generate a unique reset token and save it to the database
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiration = moment().add(1, 'hour').toDate();
      user.resetToken = resetToken;
      user.resetTokenExpiration = resetTokenExpiration;
      await user.save();
    
      // Send the password reset email to the user
      const transporter = nodemailer.createTransport({
        // Configure the email service
        host: process.env.EMAIL_HOST,
              port: process.env.EMAIL_PORT,
              auth: {
                  user: process.env.EMAIL_USER,
                  pass:process.env.EMAIl_PASS
              }
      
      });
      // const resetLink = `${req.protocol}://${req.get('host')}/api/forgetpassword/reset-password/${resetToken}`;
      const resetLink = `http://localhost:3000/${resetToken}`;
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset',
        html: `Please click <a href="${resetLink}">here</a> to reset your password.`
      };
     console.log(resetLink)
     const sended = await transporter.sendMail(mailOptions);
     if(sended){
        res.json({ message: 'Password reset email sent.' });
     }else{
        res.json({ message: 'email sending failed.' });
     }
    } catch (error) {
      res.send({message:"email sending failed..."})  
    }
 



});

// Password reset page
// router.get('/reset-password/:resetToken', async (req, res) => {
//   const resetToken = req.params.resetToken;
//   const user = await User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } });
//   if (!user) {
//     return res.status(404).json({ message: 'Invalid or expired reset token.' });
//   }
//   res.render('forgetpassword', { resetToken });
// });

// Handle password reset form submission
router.post('/reset-password', async (req, res) => {
  try {
  
    const resetToken = req.body.resettokken;
    const password = req.body.newpassword;
    const user = await User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully.' });
   
  } catch (error) {
    res.status(404).json({ message: 'Password not updated successfully.' });
  }

})


module.exports = router;