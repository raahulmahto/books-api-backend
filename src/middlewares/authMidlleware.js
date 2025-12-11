const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

async function protect(req, res, next){
  try {
    /*const token = req.headers.authorization?.split(" ")[1];

    if(!token){
      return res.status(401).json({message: "Unauthorized"});
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); */

    //new code after cookies 
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({message: "unauthorized: no token"})
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id).select("password");
    if(!req.user){
      return res.status(401).json({message: "unauthorized: user doesnt exist"});
    }

    next();
  } catch (error) {
    res.status(401).json({message: "Invalid or expired token"});
  }
}

module.exports = protect;