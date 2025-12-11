const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const userController = require("../controllers/userController"); // required for role update

// Admin-only route
router.get(
  "/admin-panel",
  authMiddleware,
  authorize("superadmin"),
  (req, res) => {
    res.json({ message: "superadmin access granted" });
  }
);

// Editor + Admin route
router.get(
  "/edit-panel",
  authMiddleware,
  authorize("superadmin", "editor"),
  (req, res) => {
    res.json({ message: "editor access granted" });
  }
);

// Profile (all authenticated roles)
router.get(
  "/profile",
  authMiddleware,
  authorize("superadmin", "editor", "user"),
  (req, res) => {
    res.json({
      message: "profile access granted",
      user: req.user
    });
  }
);

// Superadmin: update user role
router.patch(
  "/:id/role",
  authMiddleware,
  authorize("superadmin"),
  userController.updateRole
);

module.exports = router;
