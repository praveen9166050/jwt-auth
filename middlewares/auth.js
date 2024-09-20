const CustomError = require("../utils/customError");
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError(403, "Unauthorized");
    }
    const token = authHeader.split(' ')[1];
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedData) {
      throw new CustomError(403, "Unauthorized");
    }
    req.user = decodedData;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = auth;