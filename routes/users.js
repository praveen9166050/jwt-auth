const express = require('express');
const upload = require('../middlewares/fileUpload');
const { register, sendVerificationMail } = require('../controllers/users');
const { registerValidator, sendVerificationMailValidator } = require('../middlewares/validators');
const multer = require('multer');

const router = express.Router();

router
.route('/register')
.post(upload.single('image'), registerValidator, register);

router
.route('/send-verification-mail')
.post(sendVerificationMailValidator, sendVerificationMail);
module.exports = router;