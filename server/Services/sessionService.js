// services/sessionService.js
import redis from '../config/redis.js';
import jwt from 'jsonwebtoken';

export async function verifyAndCacheToken(token) {
  const cacheKey = `auth:token:${token}`;

  // Check if already verified and cached
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Verify JWT (expensive operation)
  const decoded = jwt.verify(token, process.env.KEY);

  // Cache the result for 15 minutes
  await redis.setex(cacheKey, 900, JSON.stringify(decoded));

  return decoded;
}

export async function cacheUserProfile(userId, profile) {
  await redis.setex(`user:${userId}:profile`, 3600, JSON.stringify(profile));
}

export async function getCachedUserProfile(userId) {
  const cached = await redis.get(`user:${userId}:profile`);
  return cached ? JSON.parse(cached) : null;
}

export async function invalidateUserCache(userId) {
  await redis.del(`user:${userId}:profile`);
}// add to services/sessionService.js
export async function invalidateToken(token) {
  await redis.del(`auth:token:${token}`);
}