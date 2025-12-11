const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validationMiddleware");
const {registerValidation, loginValidation} = require("../validations/authValidation");
const {register, login, refreshToken, logout} = require("../controllers/authController");

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);

router.post("/refresh", refreshToken);
router.post("/logout", logout);

module.exports = router;

// this ends to all middlewares and api integration now we proceed to put security in 4 layers 
//secure http - helmet, rate limiting to prevent brute force attack, cors and monosanitize

//need to add in server and aap.js