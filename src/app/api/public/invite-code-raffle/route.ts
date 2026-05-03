import { NextResponse } from "next/server";
import { initServer, db } from "../../../../lib/initServer";
import { getCurrentDateTime } from "../../../../utils/Variables/getDateTime.util";
import { generateHexId } from "../../../../utils/Variables/generateHexID.util";

/**
 * Token Raffle API - Returns the current raffle token string on a 24-hour interval
 *
 * Returns only the raw token string - no JSON, no extra data
 * Returns 500 error if something goes wrong
 *
 * Behavior:
 * - Only one raffle token exists at any time
 * - Each token expires exactly 24 hours after creation
 * - Tokens are shown even if already used (single-use, but always displayed)
 * - New tokens created only when 24 hours have passed since last creation
 * - Shows the token even if max_uses has been reached
 *
 * @route POST /api/public/invite-code-raffle
 * @returns {Promise<NextResponse>} Plain text response with token or empty string
 */
export async function POST(): Promise<NextResponse> {
  try {
    await initServer();
    const pool = db();

    const [latestRaffleTokens] = await pool.execute(
      `SELECT * FROM invite_tokens 
       WHERE raffle = TRUE 
       ORDER BY created_at DESC 
       LIMIT 1`
    );

    const raffleTokenList = latestRaffleTokens as Array<{
      token: string;
      expires_at: string;
      created_at: string;
      uses: number;
      max_uses: number;
      active: number;
    }>;

    const now = new Date();
    let tokenToReturn: string = "";

    if (Array.isArray(raffleTokenList) && raffleTokenList.length > 0) {
      const tokenData = raffleTokenList[0];
      const tokenCreatedAt = new Date(tokenData.created_at);

      const hoursSinceCreation =
        (now.getTime() - tokenCreatedAt.getTime()) / (1000 * 60 * 60);

      if (hoursSinceCreation < 24) {
        // Always return the token even if used or expired
        // This allows users to see what the current/previous token was
        tokenToReturn = tokenData.token;
      }
      // If 24+ hours have passed, we'll create a new token below
    }

    if (!tokenToReturn) {
      // No valid current token or 24+ hours have passed since last creation
      const newToken = generateHexId({
        length: 36,
        uppercase: true,
      });

      const expiresDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const expiresDateString = expiresDate.toISOString();
      const createdAt = getCurrentDateTime();

      await pool.execute(`DELETE FROM invite_tokens WHERE raffle = TRUE`);
      await pool.execute(
        `INSERT INTO invite_tokens (token, raffle, created_at, expires_at, uses, max_uses, active) 
         VALUES (?, TRUE, ?, ?, 0, 1, 1)`,
        [newToken, createdAt, expiresDateString]
      );

      tokenToReturn = newToken;
    }

    return new NextResponse(tokenToReturn, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error: unknown) {
    console.error("Token raffle error:", error);
    return new NextResponse("", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
