const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");
const AuthService = require("../services/authService");

exports.register = async (req, res, next) =>{
   try {
    const {name, email, password } = req.body;

    const user = await AuthService.register({name, email, password});

    res.status(201).json({
      success: true,
      message: "Registered successsfully",
      user:{
      id: user._id,
      name: user.name,
      email: user.email,
      },
    });
   } catch (error) {
       next(error);
   }
};

exports.login = async (req, res, next) => {
  try {
    const {email, password} = req.body;

    const {user, accessToken, refreshToken} = await AuthService.login(email, password);

     //set cookies
     res.cookie("refreshToken", refreshToken,{
      httpOnly: true, 
      accessToken,
      sameSite: "strict",
     });
     //const token = generateToken(user);

     return res.json({
      success: true,
      accessToken,
      user: {id: user._id,
      name: user.name,
      email: user.email,
      },
     });  // this is the code to create all in one login, auth, refresh, register now we create each accordingly
  } catch (error) {
      next(error);
  }
}

exports.refreshToken = async (req, res, next) =>{

  try {
    // to match current token 
    const token = req.cookies?.refreshToken;
    if(!token) return next(new AppError("No refresh token found", 400));
    // to match correct token or not 
   /* jwt.verify(token, process.env.JWT_REFRESH_SECRET, async(err, decoded) =>{
      if(err) return res.status(401).json({message: "invalid refresh token"});

      const user = await User.findById(decoded.id);
      if(!user) return res.status(401).json({message: "user not found"});

        //create new refreshtoken 
      const accessToken = generateAccessToken(user._id);

  return res.status(200).json({
    accessToken,
   });
  }); */

  const decoded = await AuthService.verifyRefresh(token);

  const accessToken = jwt.sign(
    {id: decoded._id},
    process.env.JWT_ACCESS_SECRET,
    {expiresIn: "15m"},
  );

  res.json({accessToken});

  
  } catch (error) {
   // return res.status(500).json({message: "server error", error: error.message});
   next(new AppError("Invalid refresh token", 401));
  }
};

exports.logout = (req, res) => {
  try {
    //clear refreshtoken cookie
    res.clearCookie("refreshToken", {
      httpOnly: true, 
      secure: true, 
      sameSite: "strict",
    });

    return res.status(200).json({message: "logged out successfuly"});
  } catch (error) {
    return res.status(500).json({message: "server error", error: error.message});
  }
}