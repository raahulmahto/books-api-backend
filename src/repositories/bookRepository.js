const Book = require('../models/bookModels');

exports.create = (data) => Book.create(data);

exports.findById = (id, opts = {}) =>
  Book.findOne({_id: id, isDeleted: false}).setOptions(opts);

exports.findOne = (filter = {}, opts = {}) =>
  Book.findOne({...filter, isDeleted: false}).setOptions(opts);

exports.find = (filter = {}, projection = null, opts = {}) =>
  Book.find({...filter, isDeleted: false}, projection, opts);

exports.count = (filter = {}) => Book.countDocuments({...filter, isDeleted: false});

exports.updateById = (id, update, opts = {new: true}) =>
  Book.findOneAndUpdate({_id: id, isDeleted: false}, update, opts);

exports.deleteById = (id) =>
  Book.findOneAndUpdate({_id: id}, {isDeleted: true, deletedAt: new Date()}, {new: true});

exports.hardDeleteById = (id) =>
  Book.findByIdAndDelete(id);


//this is advance aggregation for stats of books model
exports.aggregate = (pipeline = []) => Book.aggregate(pipeline);