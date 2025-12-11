//create express
const errorHandler = require("./middlewares/errorMiddlewares");
const morgan = require("morgan");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const useRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const xss = require('xss-clean');
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const config = require('./config');
const {connectDB, gracefulShutdown} = require('./config/mongoose');
const logger = require('./utils/logger');
const notFound = require('./middlewares/notFound');
const protectedRoutes = require('./routes/protectedRoutes');
require("dotenv").config();

const app = express();

//middleware logic to parse json
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cors({origin: true, credentials: true,}));

//logging
app.use(morgan("dev"));

//rate limiter to avoid too many attempts 
const limiter = rateLimit({
  windowMs: 15*60*1000,
  max: 100, 
  message: "Sorry too many attempts!!!!!!!!!!! please try again later",
});
app.use(limiter);

//health check 
app.get("/api/v1/health", (req,res) =>{
  res.status(200).json({success: true, message: "API Running"});
})

//setup routes
const bookRoutes = require("./routes/books");
//api versioning 
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/auth", authRoutes);  //new added while registering 
app.use('/api/v1/protected', protectedRoutes);
//app.use("/api/books", bookRoutes);
app.use("/user", useRoutes);

//404
app.use(notFound);

//central error handling 
app.use(errorHandler);

const start = async () => {
  await connectDB();
  const server = app.listen(config.port, ()=>{
    console.log(`Server listening on port ${config.port} `);
  });
  gracefulShutdown(server);
};

start().catch((err)=>{
  console.error('Failed to start server', err);
  process.exit(1);
});

//connecting mongodb server 
/*mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB is successfully connected "))
  .catch((err) => console.log("DB, ERROR", err));

//setup server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); */


/**
 * first is to write server.js and declare express and setup server
 * then next step is to declaring all necessary requirements for this project routes and middlewares
 * then now we have to write code logic for respective folders
 */
