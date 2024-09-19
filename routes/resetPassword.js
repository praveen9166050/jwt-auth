const express = require('express');
const { resetPassword, updatePassword } = require('../controllers/users');

const router = express.Router();

router
.route('/')
.get(resetPassword)
.post(updatePassword);

module.exports = router;