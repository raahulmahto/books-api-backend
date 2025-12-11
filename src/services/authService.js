/*const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserRepo = require("../repositories/userRepository"); */
const ApiError = require("../utils/ApiError");
const User = require('../models/userModels');
const RefreshToken = require('../models/refreshToken.model');
const {hashToken} = require('../utils/logger');
//const ms = require('ms');

async function register(name, email, password){
  const exists = await User.findOne(email);
  if(exists) throw new ApiError("email Already Exists", 400);

  const user = await User.create({name, email, password});
  return user;
}

//validate 
async function validateCredentials(email, password){
  const user = await User.findOne({email}.select('+password'));
  if(!user) return null;
  const match = await user.isPasswordMatch(password);
  if(!match) return null;
  return user;
}

//hashed refreshtoken
async function createRefreshToken ({userId, token, ip, userAgent, ttlMs}){
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + ttlMs);
  const doc = await RefreshToken.create({
    user: userId,
    tokenHash,
    userAgent,
    ip,
    expiresAt,
  });
  return doc
}

//find refresh token
async function findRefreshTokenByHash(token){
  const tokenHash = hashToken(token);
  return RefreshToken.findOne({tokenHash}).populate('user');
}

async function revokeRefreshTokenByHash(token){
  const tokenHash = hashToken(token);
  return RefreshToken.findOneAndUpdate({tokenHash, revoked: false},{revoked:true},{new: true});
}

async function revokeAllForUser(userId){
  return RefreshToken.updateMany({user: userId, revoked: false}, {revoked: true}, {new: true});
}
module.exports = {
  register,
  validateCredentials,
  createRefreshToken,
  findRefreshTokenByHash,
  revokeRefreshTokenByHash,
  revokeAllForUser,
};