const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const CustomError = require('../utils/customError');
const mailer = require('../utils/mailer');
const mongoose = require('mongoose');
const { verificationMailContent, passwordResetMailContent } = require('../utils/mailContent');
const crypto = require('crypto');
const PasswordReset = require('../models/PasswordReset');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const {name, email, mobile, password} = req.body;
    const existingUser = await User.findOne({email});
    if (existingUser) {
      throw new CustomError(400, "Email is already registered");
    }
    const hashedPasssword = await bcryptjs.hash(password, 10);
    const user = await User.create(
      {name, email, mobile, password: hashedPasssword, image: 'image/' + req.file.filename}
    );
    if (!user) {
      throw new CustomError(400, "Bad Request");
    }
    const subject = "Email Verification Required";
    const content = verificationMailContent(
      user.name,
      `http://localhost:${process.env.PORT}/mail-verification?id=${user._id}`
    )
    await mailer(process.env.TO_EMAIL, subject, content);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user
    });
  } catch (error) {
    next(error);
  }
}

const mailVerification = async (req, res, next) => {
  try {
    const userId = req.query.id;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.render('mail-verification', {message: "Invalid user id", status: "error"});
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.render('mail-verification', {message: "User not found", status: "error"});
    }
    if (user.isVerified) {
      return res.render('mail-verification', { message: "Your email is already verified", status: "info" });
    }
    user.isVerified = true;
    await user.save();
    res.render('mail-verification', {message: "Email has been verified successfully", status: "info"});
  } catch (error) {
    console.log(error);
    res.render('mail-verification', {message: "Something went wrong", status: "error"});
  }
}

const sendVerificationMail = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({email});
    if (!user) {
      throw new CustomError(404, "Email is not registered");
    }
    if (user.isVerified) {
      throw new CustomError(400, "Email is already verified");
    }
    const subject = "Email Verification Required";
    const content = verificationMailContent(
      user.name,
      `http://localhost:${process.env.PORT}/mail-verification?id=${user._id}`
    )
    await mailer(process.env.TO_EMAIL, subject, content);
    res.status(200).json({
      success: true,
      message: "Verification mail sent successfully"
    });
  } catch (error) {
    next(error);
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({email});
    if (!user) {
      throw new CustomError(404, "Email is not registered");
    }
    const token = crypto.randomBytes(32).toString('hex');
    await PasswordReset.findOneAndDelete({userId: user._id});
    const passwordReset = await PasswordReset.create({userId: user._id, token});
    const subject = "Reset Password";
    const content = passwordResetMailContent(
      user.name,
      `http://localhost:${process.env.PORT}/reset-password?id=${user._id}&token=${passwordReset.token}`
    )
    await mailer(process.env.TO_EMAIL, subject, content);
    res.status(200).json({
      success: true,
      message: "Password reset mail sent successfully"
    });
  } catch (error) {
    next(error);
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const {id: userId, token} = req.query;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.render('reset-password', { message: "Invalid user ID.", status: "error" });
    }
    if (!token) {
      return res.render('reset-password', { message: "Invalid or missing reset token.", status: "error" });
    }
    const passwordResetData = await PasswordReset.findOne({userId, token});
    if (!passwordResetData) {
      return res.render('reset-password', { message: "Invalid reset token.", status: "error" });
    }
    res.render('reset-password', {userId, token, message: null, status: "info"});
  } catch (error) {
    console.log(error);
    res.render('reset-password', {message: "Something went wrong", status: "error"});
  }
}

const updatePassword = async (req, res, next) => {
  const {userId, token, password, confirmPassword} = req.body;
  try {
    if (password !== confirmPassword) {
      return res.render('reset-password', {userId, token, message: "Password and confirm password do not match", status: "error"});
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.render('reset-password', {userId, token, message: "User not found", status: "error"});
    }
    const hash = await bcryptjs.hash(password, 10);
    user.password = hash;
    await user.save();
    await PasswordReset.deleteOne({userId, token});
    res.render('reset-password', {message: "Password reset successful", status: "info"});
  } catch (error) {
    console.log(error);
    res.render('reset-password', {userId, token, message: "Something went wrong", status: "error"});
  }
}

const login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      throw new CustomError(401, "Invalid credentials");
    }
    const matched = await bcryptjs.compare(password, user.password);
    if (!matched) {
      throw new CustomError(401, "Invalid credentials");
    }
    const accessToken = jwt.sign(
      {userId: user._id, name: user.name, email: user.email}, 
      process.env.JWT_SECRET, 
      {expiresIn: process.env.JWT_EXPIRES_IN}
    );
    const userDoc = user._doc;
    delete userDoc.password;
    res.status(200).json({
      success: true,
      user: userDoc,
      accessToken,
      tokenType: 'Bearer'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {register, mailVerification, sendVerificationMail, forgotPassword, resetPassword, updatePassword, login};