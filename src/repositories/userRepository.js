const User = require("../models/userModels");

exports.findByEmail = (email) =>{
  return User.findOne({email});
};

exports.findById = (id) =>{
  return User.findById(id).select("-password");
};

exports.createUser = (data) =>{
  return User.create(data);
};