// src/validation/bookValidation.js
const Joi = require('joi');

exports.createBookSchema = Joi.object({
  title: Joi.string().min(2).max(300).required(),
  author: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(2000).allow('', null),
  category: Joi.string().max(100).allow('', null),
  price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(100).optional(),
  stock: Joi.number().integer().min(0).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  publisher: Joi.string().max(200).optional(),
  isbn: Joi.string().max(50).optional(),
  publishedYear: Joi.number().integer().min(1000).max(9999).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

exports.updateBookSchema = Joi.object({
  title: Joi.string().min(2).max(300).optional(),
  author: Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(2000).allow('', null).optional(),
  category: Joi.string().max(100).allow('', null).optional(),
  price: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).max(100).optional(),
  stock: Joi.number().integer().min(0).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  publisher: Joi.string().max(200).optional(),
  isbn: Joi.string().max(50).optional(),
  publishedYear: Joi.number().integer().min(1000).max(9999).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
}).min(1);
