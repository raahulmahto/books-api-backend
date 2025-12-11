const ApiError = require("../utils/ApiError");
const User = require('../models/userModels');
const RefreshToken = require('../models/refreshToken.model');
const { hashToken } = require('../utils/logger');

// -------------------------
// REGISTER USER (FIXED)
// -------------------------
async function register(name, email, password) {
  // check if email exists
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, "Email already exists");

  // create user properly
  const user = await User.create({ name, email, password });
  return user;
}

// -------------------------
// VALIDATE LOGIN CREDENTIALS (FIXED)
// -------------------------
async function validateCredentials(email, password) {
  // FIXED: Proper query + password select
  const user = await User.findOne({ email }).select("+password");

  if (!user) return null;

  const match = await user.isPasswordMatch(password);
  if (!match) return null;

  return user;
}

// -------------------------
// CREATE REFRESH TOKEN
// -------------------------
async function createRefreshToken({ userId, token, ip, userAgent, ttlMs }) {
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + ttlMs);

  const doc = await RefreshToken.create({
    user: userId,
    tokenHash,
    userAgent,
    ip,
    expiresAt,
  });

  return doc;
}

// -------------------------
// FIND REFRESH TOKEN
// -------------------------
async function findRefreshTokenByHash(token) {
  const tokenHash = hashToken(token);
  return RefreshToken.findOne({ tokenHash }).populate("user");
}

// -------------------------
// REVOKE ONE REFRESH TOKEN
// -------------------------
async function revokeRefreshTokenByHash(token) {
  const tokenHash = hashToken(token);
  return RefreshToken.findOneAndUpdate(
    { tokenHash, revoked: false },
    { revoked: true },
    { new: true }
  );
}

// -------------------------
// REVOKE ALL FOR USER
// -------------------------
async function revokeAllForUser(userId) {
  return RefreshToken.updateMany(
    { user: userId, revoked: false },
    { revoked: true },
    { new: true }
  );
}

module.exports = {
  register,
  validateCredentials,
  createRefreshToken,
  findRefreshTokenByHash,
  revokeRefreshTokenByHash,
  revokeAllForUser,
};
