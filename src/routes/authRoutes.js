const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const { registerValidation, loginValidation } = require('../validation/authValidation');
const authMiddleware = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');
const authorize = require('../middlewares/roleMiddleware');

const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: { success: false, message: 'Too many requests' } });

router.post('/register', authLimiter, validate(registerValidation), authController.register);
router.post('/login', authLimiter, validate(loginValidation), authController.login);
router.post('/refresh', authLimiter, authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

// admin-only revoke all
router.post('/revoke-all/:userId', authMiddleware, authorize('superadmin'), authController.revokeAllForUser);

module.exports = router;


// this ends to all middlewares and api integration now we proceed to put security in 4 layers 
//secure http - helmet, rate limiting to prevent brute force attack, cors and monosanitize

//need to add in server and aap.js