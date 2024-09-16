const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const CustomError = require('../utils/customError');

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
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {register};