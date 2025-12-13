const express = require('express');
const router = express.Router();

const authController = require('../../controllers/authController');
const validate = require('../../middlewares/validationMiddleware');
const { registerValidation, loginValidation } = require('../../validation/v1/authValidation');
const authMiddleware = require('../../middlewares/authMiddleware');
const authorize = require('../../middlewares/roleMiddleware');

// Redis Rate Limiter
const rateLimiter = require('../../middlewares/redisRateLimiter');

const registerLimiter = rateLimiter({ window: 300, limit: 5 });
const loginLimiter = rateLimiter({ window: 60, limit: 10 });
const refreshLimiter = rateLimiter({ window: 60, limit: 20 });

router.post('/register', registerLimiter, validate(registerValidation), authController.register);

router.post('/login', loginLimiter, validate(loginValidation), authController.login);

router.post('/refresh', refreshLimiter, authController.refreshToken);

router.post('/logout', authMiddleware, authController.logout);

// Superadmin ability to revoke all
router.post(
  '/revoke-all/:userId',
  authMiddleware,
  authorize('superadmin'),
  authController.revokeAllForUser
);

module.exports = router;
