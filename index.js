const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const usersRouter = require('./routes/users');
const mailVerificationRouter = require('./routes/mailVerification');
const CustomError = require('./utils/customError');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());

app.use('/api/v1/users', usersRouter);
app.use('/mail-verification', mailVerificationRouter);

app.use('*', (req, res, next) => {
  next(new CustomError(404, "Route doesn't exist"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message
  });
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
})
.catch((error) => {
  console.log("Error:", error);
});