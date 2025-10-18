import { NextRequest, NextResponse } from 'next/server';
import { initServer, db } from '../../../../../lib/initServer';
import { PoolConnection } from 'mysql2/promise';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token || token.length !== 36) {
            return NextResponse.json({
                valid: false,
                message: "Token must be exactly 36 characters long"
            }, { status: 400 });
        }

        // SQL injection prevention
        const sqlInjectionPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)\b)/i,
            /('|"|;|--|\/\*|\*\/|\\\*|\\-)/,
            /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
            /(\b(WAITFOR|DELAY)\b\s+)/i,
            /(\b(SLEEP)\b\s*\(\s*\d+\s*\))/i
        ];

        for (const pattern of sqlInjectionPatterns) {
            if (pattern.test(token)) {
                return NextResponse.json({
                    valid: false,
                    message: "Invalid token format detected"
                }, { status: 400 });
            }
        }

        await initServer();
        const pool = db();

        const [tokens] = await pool.execute(
            `SELECT * FROM invite_tokens 
       WHERE token = ? 
       AND active = 1 
       AND uses < max_uses 
       AND (expires_at IS NULL OR expires_at > NOW())`,
            [token]
        );

        if (!Array.isArray(tokens) || tokens.length === 0) {
            return NextResponse.json({
                valid: false,
                message: "Invalid, expired, or already used token"
            }, { status: 404 });
        }

        const connection: PoolConnection = await pool.getConnection();
        await connection.execute(
            `UPDATE invite_tokens 
       SET uses = uses + 1, 
           active = IF(uses + 1 >= max_uses, 0, active)
       WHERE token = ?`,
            [token]
        );

        connection.release();

        return NextResponse.json({
            valid: true,
            message: "Token validated successfully"
        });

    } catch (error: unknown) {
        console.error('Token validation error:', error);
        return NextResponse.json({
            valid: false,
            message: "Internal server error during validation"
        }, { status: 500 });
    }
}