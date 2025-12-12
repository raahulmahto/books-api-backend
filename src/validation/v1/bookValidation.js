const Joi = require("joi");

exports.createBookSchema = Joi.object({
  title: Joi.string().min(2).max(200).trim().required(),
  author: Joi.string().min(2).max(100).trim().required(),
  price: Joi.number().min(1).max(100000).required(),
  discount: Joi.number().min(0).max(90).default(0),
  category: Joi.string().min(3).max(50).required(),
  description: Joi.string().max(2000).allow(""),
});

exports.updateBookSchema = Joi.object({
  title: Joi.string().min(2).max(200).trim(),
  author: Joi.string().min(2).max(100).trim(),
  price: Joi.number().min(1).max(100000),
  discount: Joi.number().min(0).max(90),
  category: Joi.string().min(3).max(50),
  description: Joi.string().max(2000).allow(""),
});
