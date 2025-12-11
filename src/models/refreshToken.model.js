const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema(
  {
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true},
    tokenHash: {type: String, required: true, index: true}, 
    userAgent: {type: String}, //device and IP basically metadata 
    ip: {type: String},
    revoked: {type: Boolean, default: false},
    expiresAt: {type: Date, required: true, index: {expireAfterSeconds: 0}},
  },
  {timpestamps: true}
);

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);