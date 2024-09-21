const CustomError = require("../utils/customError");
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError(403, "Unauthorized");
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    if (!decoded) {
      throw new CustomError(403, "Unauthorized");
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = auth;