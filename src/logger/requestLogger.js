const logger = require("./logger");

module.exports = function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    logger.info({
      type: "request",
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: Date.now() - start + "ms",
      user: req.user ? req.user.id : null,
    });
  });

  next();
};
