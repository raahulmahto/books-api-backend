const express = require("express");
const protect = require("../middlewares/authMidlleware");
const router = express.Router();
const authorize = require("../middlewares/roleMiddleware");

router.get("/admin-panel", 
  protect, 
  authorize("superadmin"),
  (req, res) =>{
  res.json({message: "superadmin access granted"});
}
);
router.get("/edit-panel", 
  protect, 
  authorize("superadmin", "editor"),
  (req, res) =>{
  res.json({message: "superadmin access granted"});
}
);

router.get("/profile", 
  protect, 
  authorize("superadmin", "editor", "user"),
  (req, res) =>{
  res.json({message: "superadmin access granted", user: req.user});
}
);

module.exports = router;