
const { connectRedis } = require('./redisClient');

function cache(ttlSeconds = 30) {
  return async function (req, res, next) {
    try {
      const client = await connectRedis();
      if (!client) return next(); // no redis -> continue normally

      // Build cache key from pathname + sorted query + user if needed
      const keyParts = [req.method, req.originalUrl];
      const cacheKey = `cache:${encodeURIComponent(keyParts.join('|'))}`;

      const cached = await client.get(cacheKey);
      if (cached) {
        // Return cached response
        const payload = JSON.parse(cached);
        return res.status(200).json(payload);
      }

      // Capture original res.json to cache after handler finishes
      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        try {
          // Only cache successful responses (status 200 or 201)
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const toCache = JSON.stringify(body);
            await client.set(cacheKey, toCache, { EX: Number(ttlSeconds) });
          }
        } catch (err) {
          console.error('Failed to set cache:', err);
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('Cache middleware error:', err);
      return next();
    }
  };
}

module.exports = cache;
