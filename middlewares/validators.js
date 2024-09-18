const { z } = require("zod");
const CustomError = require("../utils/customError");

const registerValidator = (req, res, next) => {
  const payload = req.body;
  const schema = z.object({
    name: z
      .string({message: "Name is required"})
      .min(1, {message: "Name is required"}),
    email: z
      .string()
      .min(1, {message: "Email is required"})
      .email({message: "Invalid email address"}),
    mobile: z
      .string()
      .length(10, {message: "Mobile number must be of exactly 10 digits"}),
    password: z
      .string()
      .min(6, {message: "Password must contain atleast 6 characters"})
      .regex(/[a-z]/, {message: "Password must contain atleast one lowercase character"})
      .regex(/[A-Z]/, {message: "Password must contain atleast one uppercase character"})
      .regex(/[0-9]/, {message: "Password must contain atleast one digit"})
      .regex(/[*@!#%&()^~{}]/, {message: "Password must contain atleast one special character"})
  });
  try {
    schema.parse(payload);
    next();
  } catch (error) {
    next(new CustomError(400, error.errors[0].message));
  }
}

const sendVerificationMailValidator = (req, res, next) => {
  const payload = req.body;
  const schema = z.object({
    email: z
    .string({message: "Email is required"})
    .min(1, {message: "Email is required"})
    .email({message: "Invalid email address"})
  });
  try {
    schema.parse(payload);
    next();
  } catch (error) {
    next(new CustomError(400, error.errors[0].message));
  }
}

const passwordResetValidator = (req, res, next) => {
  const payload = req.body;
  const schema = z.object({
    email: z
    .string({message: "Email is required"})
    .min(1, {message: "Email is required"})
    .email({message: "Invalid email address"})
  });
  try {
    schema.parse(payload);
    next();
  } catch (error) {
    next(new CustomError(400, error.errors[0].message));
  }
}

module.exports = {registerValidator, sendVerificationMailValidator, passwordResetValidator};