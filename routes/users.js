const express = require('express');
const upload = require('../middlewares/fileUpload');
const { register } = require('../controllers/users');

const router = express.Router();

router
.route('/register')
.post(upload.single('image'), register);

module.exports = router;