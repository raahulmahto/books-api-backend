const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

// Redis limiter
const rateLimiter = require("./middlewares/redisRateLimiter");

// Logging middlewares
const correlation = require("./logger/correlation");
const requestLogger = require("./logger/requestLogger");

// Internal middlewares
const errorHandler = require("./middlewares/errorMiddlewares");
const notFound = require("./middlewares/notFound");

// Create app
const app = express();

/**********************************************
 * CORE SECURITY + PARSING
 **********************************************/
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Basic console HTTP logs (developer-friendly)
app.use(morgan("dev"));

/**********************************************
 * CORRELATION ID + REQUEST LOGGING
 **********************************************/
app.use(correlation);
app.use(requestLogger);

/**********************************************
 * GLOBAL RATE LIMITER
 **********************************************/
app.use(rateLimiter({ window: 60, limit: 200 }));

/**********************************************
 * HEALTH CHECK
 **********************************************/
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now(), uptime: process.uptime() });
});

/**********************************************
 * SWAGGER (optional)
 **********************************************/
try {
  require("./swagger")(app);
} catch {}

/**********************************************
 * VERSIONED ROUTES
 **********************************************/
app.use("/api/v1/auth", require("./routes/v1/authRoutes"));
app.use("/api/v1/users", require("./routes/v1/userRoutes"));
app.use("/api/v1/books", require("./routes/v1/books"));
app.use("/api/v1/protected", require("./routes/v1/protectedRoutes"));

// Future v2 routes
app.use("/api/v2/books", require("./routes/v2/books"));

/**********************************************
 * NOT FOUND + ERROR HANDLING
 **********************************************/
app.use(notFound);
app.use(errorHandler);

module.exports = app;
