import { NextResponse } from "next/server";
import { initServer, db } from "../../../../../../lib/initServer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../api/auth/[...nextauth]/route";
import { loadSettings } from "../../../../../../lib/settings";
import getRedisSettingsKey from "../../../../../../utils/Redis/getSettingsRedisKey";

import { logAudit } from "../../../../../../utils/Variables/AuditLogger.util";
import { SettingRow } from "../../../../../../types/Admin/Settings/setting.type";
import { getRedis } from "../../../../../../lib/Redis/redis";

/**
 * @brief Renames a specific global route access setting key in the database.
 *
 * @workflow
 *  1. Initializes server and database connection.
 *  2. Authenticates the current user from the request.
 *  3. Extracts the old setting key from URL params and normalizes it to uppercase.
 *  4. Parses the request body and validates the new setting key (`route`), ensuring it is a non-empty string.
 *  5. Verifies the old key exists in `global_settings`.
 *  6. Ensures the new key does not already exist to avoid duplicates.
 *  7. Updates the `setting_key` in `global_settings` from the old key to the new one.
 *  8. Records an audit log entry for the key rename using `logAudit`.
 *  9. Reloads the in-memory settings cache (`loadSettings`) so changes take effect immediately.
 * 10. Returns the old and new keys in the JSON response with a success message.
 */

export async function PATCH(
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
  const oldKey = key.toUpperCase();
  let body: { route?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.route || typeof body.route !== "string" || !body.route.trim()) {
    return NextResponse.json(
      { error: "New route name is required" },
      { status: 400 }
    );
  }

  const newKey = body.route.toUpperCase();

  const [oldRows] = await pool.query<SettingRow[]>(
    "SELECT setting_key FROM global_settings WHERE setting_key = ? LIMIT 1",
    [oldKey]
  );

  if (!oldRows.length) {
    return NextResponse.json(
      { error: "Original setting not found" },
      { status: 404 }
    );
  }

  const [conflictRows] = await pool.query<SettingRow[]>(
    "SELECT setting_key FROM global_settings WHERE setting_key = ? LIMIT 1",
    [newKey]
  );

  if (conflictRows.length > 0) {
    return NextResponse.json(
      { error: "Setting with new name already exists" },
      { status: 400 }
    );
  }

  await pool.query(
    "UPDATE global_settings SET setting_key = ? WHERE setting_key = ?",
    [newKey, oldKey]
  );

  await logAudit(
    {
      user_id: user.user.user_id!,
      email: user.user.email!,
      name: user.user.name!,
    },
    "system",
    `Toggled global setting key from '${oldKey}' to '${newKey}'`
  );

  await redis.del(getRedisSettingsKey());
  await loadSettings();
  return NextResponse.json(
    {
      message: `Successfully renamed '${oldKey}' to '${newKey}'.`,
      oldKey,
      newKey,
    },
    { status: 200 }
  );
}
