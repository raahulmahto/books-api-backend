const { v4: uuid } = require("uuid");

module.exports = function correlationMiddleware(req, res, next) {
  req.id = req.headers["x-request-id"] || uuid();
  res.setHeader("X-Request-ID", req.id);
  next();
};
