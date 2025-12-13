const express = require("express");
const router = express.Router();


const authMiddleware = require("../../middlewares/authMiddleware");
const authorize = require("../../middlewares/roleMiddleware");
const userController = require("../../controllers/userController");
// List all users — superadmin only
router.get(
  '/',
  authMiddleware,
  authorize("superadmin"),
  userController.getAllUsers
);

// User profile
router.get(
  '/profile',
  authMiddleware,
  authorize("superadmin", "editor", "user"),
  userController.getProfile
);

// Superadmin can update roles
router.patch(
  "/:id/role",
  authMiddleware,
  authorize("superadmin"),
  userController.updateRole
);

module.exports = router;
