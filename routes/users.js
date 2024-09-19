const express = require('express');
const upload = require('../middlewares/fileUpload');
const { register, sendVerificationMail, forgotPassword, resetPassword } = require('../controllers/users');
const { registerValidator, sendVerificationMailValidator, passwordResetValidator } = require('../middlewares/validators');

const router = express.Router();

router
.route('/register')
.post(upload.single('image'), registerValidator, register);

router
.route('/send-verification-mail')
.post(sendVerificationMailValidator, sendVerificationMail);

router
.route('/forgot-password')
.post(passwordResetValidator, forgotPassword);

router
.route('/reset-password')
.post(passwordResetValidator, resetPassword);

module.exports = router;