const redis = require("../cache/redisClient");

module.exports = function rateLimiter({ window, limit }) {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      const key = `rate:${ip}`;
      const ttl = window; // seconds

      // Redis INCR and EXPIRE together
      const requests = await redis.incr(key);

      if (requests === 1) {
        await redis.expire(key, ttl);
      }

      if (requests > limit) {
        return res.status(429).json({
          success: false,
          message: "Too many requests — slow down!",
        });
      }

      next();
    } catch (err) {
      console.error("Rate Limit Error:", err);
      next(); // fail open (never block API if Redis fails)
    }
  };
};
