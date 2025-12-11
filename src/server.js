//create express
const errorHandler = require("./middlewares/errorMiddlewares");
const mongoose = require("mongoose");
const morgan = require("morgan");
const express = require("express");
const authRoutes = require("./routes/auth");
const useRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();

//setup routes
const bookRoutes = require("./routes/books");

const app = express();
//middleware logic to parse json
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(helmet());

app.use(cors({
  origin: "http://localhost:3000", //frontend url
  credentials: true,
}));

//rate limiter to avoid too many attempts 
const limiter = rateLimit({
  windows: 15*60*1000,
  max: 100, 
  message: "Sorry too many attempts!!!!!!!!!!! please try again later",
});
app.use(limiter);

app.use(mongoSanitize());

//api versioning 
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/auth", authRoutes);  //new added while registering 
//app.use("/api/books", bookRoutes);
app.use("/user", userRoutes);

//health check 
app.get("/api/v1/health", (req,res) =>{
  res.status(200).json({success: true, message: "API Running"});
})

//central error handling 
app.use(errorHandler);

//connecting mongodb server 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB is successfully connected "))
  .catch((err) => console.log("DB, ERROR", err));

//setup server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


/**
 * first is to write server.js and declare express and setup server
 * then next step is to declaring all necessary requirements for this project routes and middlewares
 * then now we have to write code logic for respective folders
 */
