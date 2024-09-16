const multer = require('multer');
const path = require('path');
const CustomError = require('../utils/customError');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' 
      || file.mimetype === 'image/jpg' 
      || file.mimetype === 'image/png'
    ) {
      cb(null, path.join(__dirname, '../public/images'));
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' 
      || file.mimetype === 'image/jpg' 
      || file.mimetype === 'image/png'
    ) {
      cb(null, true);
    } else {
      cb(new CustomError(400, "Image is not an image file"), false);
    }
  }
});

module.exports = upload;