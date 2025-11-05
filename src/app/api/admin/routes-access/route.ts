import { NextResponse } from "next/server";
import { getAllSettingsCached } from "../../../../lib/settings";

/**
 * @brief This gets all the settings from cached data
 */
export async function GET(): Promise<NextResponse> {
  const settings = await getAllSettingsCached();
  return NextResponse.json(settings);
}
