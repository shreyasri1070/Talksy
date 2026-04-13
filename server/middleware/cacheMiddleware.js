// middleware/cacheMiddleware.js
import redis from '../config/redis.js';

export function cacheMiddleware(ttlSeconds = 300) {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached)); // cache HIT — return immediately
      }
    } catch (err) {
      console.error('Cache read error:', err);
    }

    // cache MISS — capture the response and store it
    const originalJson = res.json.bind(res);
    res.json = async (data) => {
      try {
        await redis.setex(key, ttlSeconds, JSON.stringify(data));
      } catch (err) {
        console.error('Cache write error:', err);
      }
      return originalJson(data);
    };

    next();
  };
}