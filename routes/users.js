const express = require('express');
const upload = require('../middlewares/fileUpload');
const { register } = require('../controllers/users');
const { registerValidator } = require('../middlewares/validators');

const router = express.Router();

router
.route('/register')
.post(upload.single('image'), registerValidator, register);

module.exports = router;