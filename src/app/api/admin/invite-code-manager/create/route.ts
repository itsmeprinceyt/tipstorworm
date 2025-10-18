import { NextResponse } from 'next/server';
import { initServer, db } from '../../../../../lib/initServer';
import { getServerSession } from 'next-auth';
import { MyJWT } from '../../../../../types/User/JWT.type';
import { getCurrentDateTime } from '../../../../../utils/Variables/getDateTime';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { generateHexId } from '../../../../../utils/Variables/generateHexID.util';
import { logAudit } from '../../../../../utils/Variables/logAudit.type';

interface InviteTokenCreateRequestDTO {
    expires_at: string;
}

/**
 * @brief Create a new invite code (Admin/Mod only)
 * 
 * @workflow
 *  1. Check user authentication using getServerSession
 *  2. Verify user has admin/mod permissions
 *  3. Validate max_uses and expires_at
 *  4. Generate UUID token (uppercase with hyphens)
 *  5. Create invite token in database
 *  6. Log audit action
 *  7. Return created invite token
 */

export async function POST(req: Request): Promise<NextResponse> {
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
                { error: 'Insufficient permissions to create invite codes' },
                { status: 403 }
            );
        }

        if (user.is_banned) {
            return NextResponse.json(
                { error: 'You are banned, lil bro.' },
                { status: 403 }
            );
        }

        const { expires_at }: InviteTokenCreateRequestDTO = await req.json();

        let expiresAtDate: Date | null = null;
        if (expires_at) {
            expiresAtDate = new Date(expires_at);
            if (isNaN(expiresAtDate.getTime())) {
                return NextResponse.json(
                    { error: 'Invalid expiration date format' },
                    { status: 400 }
                );
            }

            if (expiresAtDate <= new Date()) {
                return NextResponse.json(
                    { error: 'Expiration date must be in the future' },
                    { status: 400 }
                );
            }
        }

        await initServer();
        const pool = db();

        const token: string = generateHexId({
            length: 36,
            uppercase: true
        });
        const now: string = getCurrentDateTime();

        await pool.query(
            `INSERT INTO invite_tokens (token, created_by, expires_at, created_at) VALUES (?, ?, ?, ?)`,
            [
                token,
                user.id,
                expires_at ? expiresAtDate : null,
                now
            ]
        );

        await logAudit(
            {
                user_id: user.user_id!,
                email: user.email!,
                name: user.name || "Unknown",
            },
            "invite_token_create",
            `User ${user.email} created invite code: ${token}`,
            {
                token: token,
                expires_at: expires_at || null,
            }
        );

        return NextResponse.json(
            { message: 'Invite code created successfully' },
            { status: 201 }
        );

    } catch (error: unknown) {
        console.error('Error creating invite code:', error);
        return NextResponse.json(
            { error: 'Server error, please try again later' },
            { status: 500 }
        );
    }
}