import { NextResponse } from "next/server";
import { initServer } from "../../../../lib/initServer";
import { getSettingCached } from "../../../../lib/settings";

/**
 * @brief API endpoint handler for retrieving a single setting value
 * 
 * @description
 * This POST API handler retrieves a boolean setting value from the cached settings store.
 * It's designed to be used by client-side applications to check feature flags or system settings.
 */
export async function POST(request: Request): Promise<NextResponse> {
    await initServer();
    try {
        const { key } = await request.json();

        if (!key) {
            return NextResponse.json({ error: "Key is required" }, { status: 400 });
        }

        const value = await getSettingCached(key);
        return NextResponse.json({ [key]: value });
    } catch (error: unknown) {
        console.log(`Error fetching Setting:`,error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}