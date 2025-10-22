import { NextRequest, NextResponse } from 'next/server';
import { initServer, db } from '../../../../lib/initServer';
import { ErrorResponse, SuccessResponse } from "../../../../types/DTO/Global.DTO";
import { InviteTokenEntity } from '../../../../types/InviteCode/token.type';

/**
 * @brief Validates an invite token and increments its usage count
 * 
 * @description
 * This endpoint validates invitation tokens by checking:
 * - Token format and length (36 characters UUID)
 * - SQL injection prevention
 * - Token existence and active status in invite_tokens table
 * - Usage limits and expiration dates
 * - Fallback to master_invite_token table if not found in regular tokens
 * 
 * @workflow
 * 1. Validate request body contains token
 * 2. Check token format and length
 * 3. Scan for SQL injection patterns
 * 4. Query database for valid, active token in invite_tokens
 * 5. If not found, check master_invite_token table
 * 6. Increment usage count and update active status
 * 7. Return validation result
 */
export async function POST(request: NextRequest): Promise<NextResponse<ErrorResponse | SuccessResponse<{ valid: boolean }>>> {
    try {
        const { token } = await request.json();

        if (!token) {
            const errorResponse: ErrorResponse = {
                success: false,
                message: "Token is required",
                code: "TOKEN_REQUIRED"
            };
            return NextResponse.json(errorResponse, { status: 400 });
        }

        if (token.length !== 36) {
            const errorResponse: ErrorResponse = {
                success: false,
                message: "Token must be exactly 36 characters long",
                code: "INVALID_TOKEN_LENGTH"
            };
            return NextResponse.json(errorResponse, { status: 400 });
        }

        const sqlInjectionPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)\b)/i,
            /('|"|;|--|\/\*|\*\/|\\\*|\\-)/,
            /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
            /(\b(WAITFOR|DELAY)\b\s+)/i,
            /(\b(SLEEP)\b\s*\(\s*\d+\s*\))/i
        ];

        for (const pattern of sqlInjectionPatterns) {
            if (pattern.test(token)) {
                const errorResponse: ErrorResponse = {
                    success: false,
                    message: "Invalid token format detected",
                    code: "MALICIOUS_INPUT"
                };
                return NextResponse.json(errorResponse, { status: 400 });
            }
        }

        await initServer();
        const pool = db();

        const [tokens] = await pool.execute(
            `SELECT * FROM invite_tokens WHERE token = ?`,
            [token]
        );

        const tokenList = tokens as InviteTokenEntity[];
        let isMasterToken = false;

        if (Array.isArray(tokenList) && tokenList.length > 0) {
            const tokenData = tokenList[0];

            if (tokenData.active === 0) {
                const errorResponse: ErrorResponse = {
                    success: false,
                    message: "Token expired",
                    code: "TOKEN_EXPIRED"
                };
                return NextResponse.json(errorResponse, { status: 410 });
            }

            if (tokenData.uses >= tokenData.max_uses) {
                const errorResponse: ErrorResponse = {
                    success: false,
                    message: `Token already used`,
                    code: "TOKEN_MAX_USES_EXCEEDED"
                };
                return NextResponse.json(errorResponse, { status: 410 });
            }

            if (tokenData.expires_at && new Date(tokenData.expires_at) <= new Date()) {
                const errorResponse: ErrorResponse = {
                    success: false,
                    message: `Token expired`,
                    code: "TOKEN_EXPIRED"
                };
                return NextResponse.json(errorResponse, { status: 410 });
            }

        } else {
            const [masterTokens] = await pool.execute(
                `SELECT * FROM master_invite_token WHERE token = ?`,
                [token]
            );

            const masterTokenList = masterTokens as { token: string; uses: number }[];

            if (!Array.isArray(masterTokenList) || masterTokenList.length === 0) {
                const errorResponse: ErrorResponse = {
                    success: false,
                    message: "Invalid token",
                    code: "TOKEN_INVALID"
                };
                return NextResponse.json(errorResponse, { status: 404 });
            }

            isMasterToken = true;
        }

        const successResponse: SuccessResponse<{ valid: boolean; expires_at?: string; is_master_token?: boolean }> = {
            success: true,
            data: {
                valid: true,
                expires_at: isMasterToken ? undefined : (tokenList[0].expires_at ? tokenList[0].expires_at.toISOString() : undefined),
                is_master_token: isMasterToken
            },
            message: isMasterToken ? "Master invite token validated successfully" : "Token validated successfully"
        };
        return NextResponse.json(successResponse);

    } catch (error: unknown) {
        console.error('Token validation error:', error);

        const errorResponse: ErrorResponse = {
            success: false,
            message: "Internal server error during validation",
            code: "INTERNAL_ERROR"
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}