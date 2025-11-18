import { NextResponse } from "next/server";
import { initServer, db } from "../../../../../../lib/initServer";
import { loadSettings } from "../../../../../../lib/settings";
import getRedisSettingsKey from "../../../../../../utils/Redis/getSettingsRedisKey";
import { logAudit } from "../../../../../../utils/Variables/AuditLogger.util";
import { SettingRow } from "../../../../../../types/Admin/Settings/setting.type";
import { getRedis } from "../../../../../../lib/Redis/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../api/auth/[...nextauth]/route";

/**
 * @description Adds a new global route access setting to the database.
 *
 * @workflow
 * 1. Initializes the server and database connection.
 * 2. Authenticates the requesting user; rejects if unauthenticated.
 * 3. Normalizes the `key` parameter to uppercase for consistency.
 * 4. Checks if a setting with the same key already exists in `global_settings`.
 * 5. If it exists → returns a `400` error response.
 * 6. If not → inserts the new setting with a default value of `true`.
 * 7. Logs the action in the audit log (`logAudit`) for traceability.
 * 8. Returns the new setting key and value in the JSON response.
 **/
export async function POST(
  req: Request,
  context: { params: Promise<{ key: string }> }
): Promise<NextResponse> {
  await initServer();
  const pool = db();
  const redis = getRedis();

  const user = await getServerSession(authOptions);
  if (!user || !user.user.is_admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await context.params;
  const normalizedKey = key.toUpperCase();

  const [rows] = await pool.query<SettingRow[]>(
    "SELECT setting_key FROM global_settings WHERE setting_key = ? LIMIT 1",
    [normalizedKey]
  );

  if (rows.length > 0) {
    return NextResponse.json(
      { error: "Setting already exists" },
      { status: 400 }
    );
  }

  const defaultValue: boolean = true;
  await pool.query(
    "INSERT INTO global_settings (setting_key, setting_value) VALUES (?, ?)",
    [normalizedKey, defaultValue]
  );

  await logAudit(
    {
      user_id: user.user.user_id!,
      email: user.user.email!,
      name: user.user.name!,
    },
    "system",
    `Added new global setting '${normalizedKey}'`
  );

  await redis.del(getRedisSettingsKey());
  await loadSettings();
  return NextResponse.json({
    normalizedKey,
    value: defaultValue,
    message: "Route added successfully",
  });
}
