const jwt = require('jsonwebtoken');
const config = require('../config');

function signAccessToken(payload){
  return jwt.sign({
    sub: payload.id,
    role: payload.role
  },config.jwt.accessSecret,{
    expiresIn: config.jwt.accessExp || '15m',
  });
}

function signRefreshToken(payload){
  return jwt.sign({sub: payload.id, role: payload.role}, config.jwt.refreshSecret,{
    expiresIn: config.jwt.RrefreshExp || '7d',
  });
}

function verifyAccessToken(token){
  return jwt.verify(token, config.jwt.accessSecret);
}

function verifyRefreshToken(token){
  return jwt.verify(token, config.jwt.refreshSecret);
}

module.exports = {signAccessToken, signRefreshToken, verifyAccessToken,verifyRefreshToken};