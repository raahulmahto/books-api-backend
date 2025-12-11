const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserRepo = require("../repositories/userRepository");
const AppError = require("../utils/AppError");

const generateAccessToken = (id) =>
  jwt.sign({id}, process.env.JWT_ACCESS_TOKEN, {expiresIn: "15m"});

const generateRefreshToken = (id) =>
  jwt.sign({id}, process.env.JWT_REFRESH_TOKEN, {expiresIn: "7d"});

exports.register = async(name, email, password) =>{
  const exists = await UserRepo.findByEmail(email);
  if(exists) throw new AppError("User Already Exists", 400);

  const user = await UserRepo.createUser({name, email, password});
  return user;
};

exports.login = async(email, password) =>{
  const user = await UserRepo.findByEmail(email);
  if(!user)
    throw new AppError("Not found! Invalid credentials", 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch)
    throw new AppError("Invalid credentials", 400);

  const accessToken = generateAccessToken(use._id);
  const refreshToken = generateRefreshToken(user._id);

  return (user, accessToken, refreshToken);
}

exports.verifyRefresh = async (token) =>{
  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
};
