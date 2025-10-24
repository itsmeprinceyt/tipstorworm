/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { initServer, db } from '../../../../lib/initServer';
import { getServerSession } from 'next-auth';
import { MyJWT } from '../../../../types/User/JWT.type';
import { authOptions } from '../../auth/[...nextauth]/route';
import { InviteToken } from '../../../../types/InviteCode/InviteToken.type';

/**
 * @brief Get all invite tokens with details (Admin/Mod only)
 * 
 * @workflow
 *  1. Check user authentication using getServerSession
 *  2. Verify user has admin/mod permissions
 *  3. Fetch all invite tokens from database
 *  4. Join with users table to get creator information
 *  5. Format response data
 *  6. Return tokens array
 */
export async function GET(): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const user = session.user as MyJWT;
        if (!user.is_admin && !user.is_mod) {
            return NextResponse.json(
                { error: 'Insufficient permissions to view invite codes' },
                { status: 403 }
            );
        }

        await initServer();
        const pool = db();

        const [tokens]: any = await pool.query(`
            SELECT 
                it.token,
                it.created_by,
                it.uses,
                it.max_uses,
                it.active,
                it.created_at,
                it.expires_at,
                u.email as creator_email,
                u.name as creator_name
            FROM invite_tokens it
            LEFT JOIN users u ON it.created_by = u.id
            ORDER BY it.created_at DESC
            `);

        const formattedTokens: InviteToken[] = tokens.map((token: any) => ({
            token: token.token,
            created_by: token.created_by,
            uses: token.uses,
            max_uses: token.max_uses,
            active: Boolean(token.active),
            created_at: token.created_at,
            expires_at: token.expires_at,
            creator_email: token.creator_email || null,
            creator_name: token.creator_name || null
        }));

        return NextResponse.json(
            {
                tokens: formattedTokens,
                count: formattedTokens.length
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('Error fetching invite tokens:', error);
        return NextResponse.json(
            { error: 'Server error, please try again later' },
            { status: 500 }
        );
    }
}