import { NextResponse } from "next/server";
import { initServer, db } from "../../../../lib/initServer";
import { getCurrentDateTime } from "../../../../utils/Variables/getDateTime.util";
import { generateHexId } from "../../../../utils/Variables/generateHexID.util";

/**
 * Token Raffle API - Returns a single invite code string on a 24-hour interval
 *
 * Returns only the raw token string - no JSON, no extra data
 * Returns 500 error if something goes wrong
 *
 * Behavior:
 * - Only one raffle token exists at any time
 * - Each token expires exactly 24 hours after creation
 * - Tokens are single-use (max_uses = 1)
 * - New tokens created only when 24 hours have passed since last creation
 * - Used tokens block new creation until their 24-hour lifecycle completes
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
      const tokenExpiry = new Date(tokenData.expires_at);
      const tokenCreatedAt = new Date(tokenData.created_at);

      const hoursSinceCreation =
        (now.getTime() - tokenCreatedAt.getTime()) / (1000 * 60 * 60);

      if (hoursSinceCreation < 24) {
        if (
          tokenData.active === 1 &&
          tokenData.uses < tokenData.max_uses &&
          now < tokenExpiry
        ) {
          tokenToReturn = tokenData.token;
        } else {
          return new NextResponse("", { status: 200 });
        }
      }
    }

    if (!tokenToReturn) {
      const newToken = generateHexId({
        length: 36,
        uppercase: true,
      });

      const expiresDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const expiresDateString = expiresDate.toISOString();
      const createdAt = getCurrentDateTime();

      await pool.execute(`DELETE FROM invite_tokens WHERE raffle = TRUE`);
      await pool.execute(
        `INSERT INTO invite_tokens (token, raffle, created_at, expires_at) VALUES (?, TRUE, ?, ?)`,
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
