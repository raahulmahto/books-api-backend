const ApiError = require("../utils/ApiError");
const AuthService = require("../services/authService");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const config = require('../config');
const ms = require('ms');

function sendRefreshCookie(res, token, maxAgeMs) {
  const cookieOptions = {
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: 'lax',
    maxAge: maxAgeMs,
    path: '/',
    domain: config.cookie.domain || undefined,
  };
  res.cookie('refreshToken', token, cookieOptions);
}

function parseDurationToMs(d) {
  if (!d) return 7 * 24 * 60 * 60 * 1000;
  try {
    return ms(d);
  } catch (error) {
    const n = Number(d);
    if (!Number.isNaN(n)) return n;
    return 7 * 24 * 60 * 60 * 1000;
  }
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const user = await AuthService.register({ name, email, password });

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await AuthService.validateCredentials(email, password);
    if (!user) return next(new ApiError(401, "Invalid credentials"));

    const payload = { id: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const ttlMs = parseDurationToMs(config.jwt.refreshExp);

    await AuthService.createRefreshToken({
      userId: user._id,
      token: refreshToken,
      ip: req.ip,
      userAgent: req.get('User-Agent') || '',
      ttlMs,
    });

    sendRefreshCookie(res, refreshToken, ttlMs);

    res.json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function refreshToken(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return next(new ApiError(401, "No refresh token found"));

    const decoded = verifyRefreshToken(token);

    const stored = await AuthService.findRefreshTokenByHash(token);
    if (!stored || stored.revoked)
      return next(new ApiError(401, "Invalid refresh token"));

    await AuthService.revokeRefreshTokenByHash(token);

    const payload = { id: decoded.sub, role: decoded.role };
    const newAccess = signAccessToken(payload);
    const newRefresh = signRefreshToken(payload);
    const ttlMs = parseDurationToMs(config.jwt.refreshExp);

    await AuthService.createRefreshToken({
      userId: decoded.sub,
      token: newRefresh,
      ip: req.ip,
      userAgent: req.get('User-Agent') || '',
      ttlMs,
    });

    sendRefreshCookie(res, newRefresh, ttlMs);
    res.json({ success: true, accessToken: newAccess });
  } catch (error) {
    next(new ApiError(401, "Invalid refresh token"));
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await AuthService.revokeRefreshTokenByHash(token);
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: "lax",
      path: "/",
      domain: config.cookie.domain || undefined,
    });

    res.json({ success: true, message: "Logged out" });
  } catch (err) {
    next(err);
  }
}

async function revokeAllForUser(req, res, next) {
  try {
    const { userId } = req.params;
    if (!userId) return next(new ApiError(400, "userId required"));

    await AuthService.revokeAllForUser(userId);

    res.json({ success: true, message: "All tokens revoked for user" });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refreshToken, logout, revokeAllForUser };
