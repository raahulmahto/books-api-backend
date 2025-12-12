const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

// Log directory
const logDir = path.join(__dirname, "../../logs");

// File rotation settings
const dailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: "%DATE%-app.log",
  dirname: logDir,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "10m",
  maxFiles: "30d",
  level: "info",
});

const dailyErrorRotateTransport = new winston.transports.DailyRotateFile({
  filename: "%DATE%-error.log",
  dirname: logDir,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "10m",
  maxFiles: "30d",
  level: "error",
});

// Format logs for cloud systems (ELK, Loki, Datadog)
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    dailyRotateTransport,
    dailyErrorRotateTransport,
  ],
});

// Export
module.exports = logger;
