import { initServer, db } from "./initServer";
import { getRedis } from "./Redis/redis";
import { SettingRow } from "../types/Admin/Settings/setting.type";
import getRedisSettingsKey from "../utils/Redis/getSettingsRedisKey";
import { REDIS_SETTINGS_TTL } from "../utils/Redis/redisTTL";

const REDIS_KEY: string = getRedisSettingsKey();
const CACHE_TTL_SECONDS: number = REDIS_SETTINGS_TTL;

let isSettingsLoading = false;
let settingsLoadingPromise: Promise<void> | null = null;

/**
 * Loads all settings from DB and saves to Redis with 24-hour expiry
 */
export async function loadSettings(): Promise<void> {
  if (isSettingsLoading) {
    console.log("⚡ loadSettings: Already loading, returning same promise...");
    return settingsLoadingPromise!;
  }

  isSettingsLoading = true;
  settingsLoadingPromise = (async () => {
    try {
      console.log("📥 Loading settings from DB...");
      await initServer();
      const pool = db();
      const [rows] = await pool.query<SettingRow[]>(
        "SELECT setting_key, setting_value FROM global_settings"
      );

      const redis = getRedis();

      const multi = redis.multi();

      multi.del(REDIS_KEY);

      for (const { setting_key, setting_value } of rows) {
        // Store the actual boolean value, not string "1"/"0"
        multi.hset(REDIS_KEY, { [setting_key]: setting_value ? 1 : 0 });
      }
      multi.expire(REDIS_KEY, CACHE_TTL_SECONDS);

      await multi.exec();
      console.log("✅ Settings cached successfully in Redis");
    } catch (error) {
      console.error("❌ Failed to load settings:", error);
      throw error;
    } finally {
      isSettingsLoading = false;
      settingsLoadingPromise = null;
    }
  })();

  return settingsLoadingPromise;
}

/**
 * Retrieves a setting from Redis cache. If missing, loads from DB.
 */
export async function getSettingCached(key: string): Promise<boolean> {
  const redis = getRedis();

  try {
    console.log(`🔎 Checking Redis for key "${key}"...`);
    let val = await redis.hget(REDIS_KEY, key);

    if (val === null) {
      console.log(`⚠️ Key "${key}" not found in Redis`);
      const exists = await redis.exists(REDIS_KEY);
      if (!exists) {
        console.log("⏳ Redis hash expired or empty. Reloading from DB...");
        await loadSettings();
        val = await redis.hget(REDIS_KEY, key);
        console.log(`📤 Reloaded "${key}" from DB into Redis`);
      } else {
        console.log(`❌ Key "${key}" does not exist in DB either`);
        return false;
      }
    } else {
      console.log(
        `✅ Found "${key}" in Redis with value: ${val} (type: ${typeof val})`
      );
    }

    // Handle both string and number values
    return val === "1" || val === 1 || val === true;
  } catch (error) {
    console.error("⚡ Redis error, falling back to DB:", error);
    await initServer();
    const pool = db();
    console.log(`📥 Fetching "${key}" directly from DB...`);
    const [rows] = await pool.query<SettingRow[]>(
      "SELECT setting_value FROM global_settings WHERE setting_key = ?",
      [key]
    );
    return rows.length > 0 ? Boolean(rows[0].setting_value) : false;
  }
}

/**
 * Returns all settings from Redis cache, loads from DB if empty
 */
export async function getAllSettingsCached(): Promise<Record<string, boolean>> {
  const redis = getRedis();

  try {
    console.log("🔎 Checking if Redis has all settings...");
    const exists = await redis.exists(REDIS_KEY);
    if (!exists) {
      console.log("⚠️ Redis empty. Loading all settings from DB...");
      await loadSettings();
    } else {
      console.log("✅ Redis has settings, fetching all...");
    }

    const all = await redis.hgetall(REDIS_KEY);
    const result: Record<string, boolean> = {};

    for (const [k, v] of Object.entries(all || {})) {
      // Handle both string and number values
      result[k] = v === "1" || v === 1 || v === true;
    }

    console.log("📤 Returning settings from Redis:", result);
    return result;
  } catch (error) {
    console.error("⚡ Redis error, falling back to DB:", error);
    await initServer();
    const pool = db();
    console.log("📥 Fetching all settings directly from DB...");
    const [rows] = await pool.query<SettingRow[]>(
      "SELECT setting_key, setting_value FROM global_settings"
    );

    const result: Record<string, boolean> = {};
    for (const row of rows) {
      result[row.setting_key] = Boolean(row.setting_value);
    }
    return result;
  }
}

/**
 * Force refresh the cache (useful when settings are updated)
 */
export async function refreshSettingsCache(): Promise<void> {
  const redis = getRedis();
  console.log("♻️ Forcing settings cache refresh...");
  await redis.del(REDIS_KEY);
  await loadSettings();
}

/**
 * Update a specific setting in cache without reloading everything
 */
export async function updateSettingInCache(
  key: string,
  value: boolean
): Promise<void> {
  const redis = getRedis();
  try {
    console.log(`✏️ Updating "${key}" in Redis cache to: ${value}`);
    const multi = redis.multi();
    // Store as number 1/0 instead of string
    multi.hset(REDIS_KEY, { [key]: value ? 1 : 0 });
    multi.expire(REDIS_KEY, CACHE_TTL_SECONDS);
    await multi.exec();
  } catch (error) {
    console.error("❌ Failed to update setting in cache:", error);
  }
}
