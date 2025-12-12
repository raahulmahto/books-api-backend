const express = require('express');
const router = express.Router();

const auth = require('../../middlewares/authMiddleware');
const authorize = require('../../middlewares/roleMiddleware');

// Superadmin only
router.get('/admin-panel', auth, authorize('superadmin'), (req, res) => {
  res.json({ message: 'superadmin access granted' });
});

// Editor + superadmin
router.get('/edit-panel', auth, authorize('superadmin', 'editor'), (req, res) => {
  res.json({ message: 'editor access granted' });
});

// All authenticated roles
router.get('/profile', auth, authorize('superadmin', 'editor', 'user'), (req, res) => {
  res.json({
    message: 'profile access granted',
    user: req.user
  });
});

module.exports = router;
