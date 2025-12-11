// investigate later 

// src/services/userService.js
const User = require('../models/userModels');
const ApiError = require('../utils/ApiError');

async function findById(id) {
  return User.findById(id).select('-password');
}

async function updateRole(userId, newRole) {
  const validRoles = ['superadmin', 'editor', 'user'];
  if (!validRoles.includes(newRole)) throw new ApiError(400, 'Invalid role');
  const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true }).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

module.exports = { findById, updateRole };
