// src/routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.get('/admin-panel', auth, authorize('superadmin'), (req, res) => res.json({ message: 'superadmin access granted' }));
router.get('/edit-panel', auth, authorize('superadmin', 'editor'), (req, res) => res.json({ message: 'editor access granted' }));
router.get('/profile', auth, authorize('superadmin', 'editor', 'user'), (req, res) => res.json({ message: 'profile access', user: req.user }));

module.exports = router;
