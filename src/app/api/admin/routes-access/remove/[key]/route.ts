import { NextResponse } from "next/server";
import { initServer, db } from "../../../../../../lib/initServer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../api/auth/[...nextauth]/route";
import { loadSettings } from "../../../../../../lib/settings";
import getRedisSettingsKey from "../../../../../../utils/Redis/getSettingsRedisKey";
import { logAudit } from "../../../../../../utils/Variables/AuditLogger";
import { SettingRow } from "../../../../../../types/Settings/setting.type";
import { getRedis } from "../../../../../../lib/Redis/redis";

/**
 * @brief Deletes a specific global route access setting from the database.
 *
 * @workflow
 * 1. Initializes the server & database connection.
 * 2. Authenticates the request using `getCurrentUser`.
 *    - Returns 401 if the user is not logged in.
 * 3. Normalizes the provided `key` to uppercase for consistency.
 * 4. Checks if the setting exists in the `global_settings` table.
 *    - Returns 404 if the setting does not exist.
 * 5. Deletes the setting from the database.
 * 6. Logs the deletion action in the audit log via `logAudit` for accountability.
 * 7. Reloads the in-memory settings cache via `loadSettings` so changes apply immediately.
 * 8. Returns a success message in JSON with a 200 status.
 */
export async function DELETE(
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

  if (!rows.length) {
    return NextResponse.json(
      { error: "Setting you are trying to delete does not exist" },
      { status: 404 }
    );
  }

  await pool.query("DELETE FROM global_settings WHERE setting_key = ?", [
    normalizedKey,
  ]);

  await logAudit(
    {
      user_id: user.user.user_id!,
      email: user.user.email!,
      name: user.user.name!,
    },
    "system",
    `Global setting '${normalizedKey}' has been deleted`
  );

  await redis.del(getRedisSettingsKey());
  await loadSettings();
  return NextResponse.json(
    {
      message: "Setting deleted",
    },
    { status: 200 }
  );
}
