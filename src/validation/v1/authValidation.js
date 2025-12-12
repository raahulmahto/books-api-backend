const Joi = require("joi");

exports.registerValidation = Joi.object({
  name: Joi.string().min(3).max(50).trim().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string()
    .min(8)
    .max(32)
    .pattern(/[A-Z]/, "one uppercase letter")
    .pattern(/[0-9]/, "one number")
    .pattern(/[@$!%*?&#]/, "one special character")
    .required(),
  role: Joi.string().valid("user", "editor", "superadmin").default("user"),
});

exports.loginValidation = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});
