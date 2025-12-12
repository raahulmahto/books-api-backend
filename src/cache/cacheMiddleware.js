
const { client } = require('./redisClient');

function cacheMiddleware(ttlSeconds = 60) {
  return async (req, res, next) => {
    try {
      const key = `cache:${req.originalUrl}`;
      const cached = await client.get(key);
      if (cached) {
        res.set('X-Cache', 'HIT');
        return res.json(JSON.parse(cached));
      }

      // capture body to set in cache
      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        try {
          await client.setEx(key, ttlSeconds, JSON.stringify(body));
        } catch (err) {
          console.warn('Redis setEx failed:', err.message);
        }
        res.set('X-Cache', 'MISS');
        return originalJson(body);
      };

      return next();
    } catch (err) {
      console.warn('Cache middleware error; proceeding without cache:', err.message);
      return next();
    }
  };
}

module.exports = cacheMiddleware;
