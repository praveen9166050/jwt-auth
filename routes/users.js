const express = require('express');
const upload = require('../middlewares/fileUpload');
const { 
  register, 
  sendVerificationMail, 
  forgotPassword, 
  login, 
  getProfile, 
  updateProfile, 
  refreshAccessToken
} = require('../controllers/users');
const { 
  registerValidator, 
  sendVerificationMailValidator, 
  forgotPasswordValidator, 
  loginValidator, 
  updateProfileValidator 
} = require('../middlewares/validators');
const auth = require('../middlewares/auth');

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

router.use(auth);

router
.route('/profile')
.get(getProfile)
.patch(upload.single('image'), updateProfileValidator, updateProfile);

router
.route('/refresh-access-token')
.get(refreshAccessToken)

module.exports = router;