import { getRedis } from "./redis";
import { RateLimiterRedis } from "rate-limiter-flexible";

const redis = getRedis();

export const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl",
  points: 10, // 10 requests
  duration: 60, // per 60 seconds (TTL = 60s)
  blockDuration: 900, // optional: block for 15 minutes after limit reached
  insuranceLimiter: undefined,
});
