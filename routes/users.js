const express = require('express');
const upload = require('../middlewares/fileUpload');
const { register, sendVerificationMail, forgotPassword, login } = require('../controllers/users');
const { registerValidator, sendVerificationMailValidator, forgotPasswordValidator, loginValidator } = require('../middlewares/validators');

const router = express.Router();

router
.route('/register')
.post(upload.single('image'), registerValidator, register);

router
.route('/send-verification-mail')
.post(sendVerificationMailValidator, sendVerificationMail);

router
.route('/forgot-password')
.post(forgotPasswordValidator, forgotPassword);

router
.route('/login')
.post(loginValidator, login);

module.exports = router;