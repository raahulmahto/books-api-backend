const ApiError = require("../utils/ApiError");
const logger = require("../logger/logger");

function errorHandler(err, req, res, next) {
  let error = err;

  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    error = new ApiError(statusCode, err.message || "Internal server error", false, err.stack);
  }

  logger.error({
    type: "error",
    requestId: req.id,
    statusCode: error.statusCode,
    message: error.message,
    stack: error.stack,
    user: req.user ? req.user.id : null,
  });

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
}

module.exports = errorHandler;
