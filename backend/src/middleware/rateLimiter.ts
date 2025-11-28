import type { RequestHandler } from 'express';
import dotenv from 'dotenv';
import { RateLimiterRedis, type RateLimiterRes } from 'rate-limiter-flexible';
import { createClient } from 'redis';

// Ensure env vars are loaded before reading REDIS_URL
dotenv.config();

const redisUrl = process.env.REDIS_URL;

let rateLimiter: RateLimiterRedis | null = null;

if (!redisUrl) {
  console.warn(
    '[rateLimiter] REDIS_URL is not set; Redis-backed rate limiting is disabled.',
  );
} else {
  console.log('[rateLimiter] Using Redis URL:', redisUrl);

  const redisClient = createClient({
    url: redisUrl,
  });

  redisClient.on('error', error => {
    console.error('[rateLimiter] Redis client error:', error);
  });

  void redisClient
    .connect()
    .then(() => {
      console.log('[rateLimiter] Connected to Redis');
    })
    .catch(error => {
      console.error('[rateLimiter] Failed to connect to Redis:', error);
    });

  rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rate_limit',
    points: 100,
    duration: 60,
  });
}

export const rateLimiterMiddleware: RequestHandler = (req, res, next) => {
  if (!rateLimiter) {
    next();
    return;
  }

  const key = req.ip ?? 'unknown';
  console.log('[rateLimiter] Consume key:', key);

  rateLimiter
    .consume(key)
    .then(() => {
      next();
    })
    .catch((error: RateLimiterRes | Error) => {
      if (error instanceof Error) {
        console.error('Rate limiter error:', error);
        next();
        return;
      }

      const retryAfterSeconds = Math.max(
        1,
        Math.round(error.msBeforeNext / 1000),
      );

      res.setHeader('Retry-After', retryAfterSeconds.toString());
      res.status(429).json({
        message: 'Too many requests',
        retryAfter: retryAfterSeconds,
      });
    });
};
