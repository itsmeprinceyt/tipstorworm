import { NextResponse } from "next/server";
import { initServer, db } from "../../../../../lib/initServer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import { loadSettings } from "../../../../../lib/settings";
import { logAudit } from "../../../../../utils/Variables/AuditLogger.util";
import { SettingRow } from "../../../../../types/Admin/Settings/setting.type";
import { getRedis } from "../../../../../lib/Redis/redis";
import getRedisSettingsKey from "../../../../../utils/Redis/getSettingsRedisKey";

/**
 * @description Handles HTTP PATCH requests to toggle a specific global route access setting.
 *
 * @workflow
 * 1. Initializes the server and retrieves a database connection.
 * 2. Authenticates the current user.
 * 3. Normalizes the `key` to uppercase for consistency.
 * 4. Fetches the current setting value from the `global_settings` table.
 * 5. Toggles the boolean value and updates it in the database.
 * 6. Logs the action to the audit log for tracking.
 * 7. Reloads in-memory global settings for immediate effect.
 * 8. Returns the change details in the JSON response.
 */

export async function PATCH(
  req: Request,
  context: { params: Promise<{ key: string }> }
): Promise<NextResponse> {
  await initServer();
  const pool = db();
  const redis = getRedis();

  const user = await getServerSession(authOptions);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await context.params;
  const normalizedKey = key.toUpperCase();

  const [rows] = await pool.query<SettingRow[]>(
    "SELECT setting_value FROM global_settings WHERE setting_key = ? LIMIT 1",
    [normalizedKey]
  );

  if (!rows.length) {
    return NextResponse.json({ error: "Invalid setting key" }, { status: 404 });
  }

  const currentValue = Boolean(rows[0].setting_value);
  const newValue = !currentValue;

  await pool.query(
    "UPDATE global_settings SET setting_value = ? WHERE setting_key = ?",
    [newValue, normalizedKey]
  );

  await logAudit(
    {
      user_id: user.user.user_id!,
      email: user.user.email!,
      name: user.user.name!,
    },
    "system",
    `Toggled global setting '${normalizedKey}' from '${currentValue}' to '${newValue}'`
  );

  await redis.del(getRedisSettingsKey());
  await loadSettings();
  return NextResponse.json({
    message: `'${normalizedKey}' has been ${newValue ? "enabled" : "disabled"}`,
    normalizedKey,
    oldValue: currentValue,
    newValue,
  });
}
