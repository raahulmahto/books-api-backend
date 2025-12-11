const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Internal imports (routes, middlewares)
const errorHandler = require("./middlewares/errorMiddlewares");
const notFound = require("./middlewares/notFound");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const bookRoutes = require("./routes/books");

// Create app
const app = express();

// Security & Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

// Logging
app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, try again later." },
});
app.use(limiter);

// Health Check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ success: true, message: "API Running" });
});

// Swagger docs (if present)
try {
  require('./swagger')(app);
} catch (e) {
  // ignore in case swagger file isn't available in minimal test env
  // console.warn('Swagger not loaded in test environment');
}

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/protected", protectedRoutes);

// 404 + Error handlers
app.use(notFound);
app.use(errorHandler);

// export app for server and tests
module.exports = app;
