const Joi = require('joi');

// User Registration Validation Schema
const registerValidation = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  dateOfBirth: Joi.date().iso().required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
});

// User Login Validation Schema
const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const postValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).required(),
});

// Update Post Validation (Optional Fields)
const updatePostValidation = Joi.object({
  title: Joi.string().min(3).max(100),
  content: Joi.string().min(10),
});

// Validate function middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  validate,
};
