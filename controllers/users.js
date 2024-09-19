const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const CustomError = require('../utils/customError');
const mailer = require('../utils/mailer');
const mongoose = require('mongoose');
const { verificationMailContent, passwordResetMailContent } = require('../utils/mailContent');
const crypto = require('crypto');
const PasswordReset = require('../models/PasswordReset');

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
    const subject = "Reset Password";
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
    const passwordReset = await PasswordReset.create({userId: user._id, token});
    const subject = "Email Verification Required";
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
    res.status(200).json({

    });
  } catch (error) {
    next(error);
  }
}

module.exports = {register, mailVerification, sendVerificationMail, forgotPassword, resetPassword};