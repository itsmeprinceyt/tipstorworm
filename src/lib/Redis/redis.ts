import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL!);
  }
  return redis;
}