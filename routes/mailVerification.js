const express = require('express');
const { mailVerification } = require('../controllers/users');

const router = express.Router();

router
.route('/')
.get(mailVerification);

module.exports = router;