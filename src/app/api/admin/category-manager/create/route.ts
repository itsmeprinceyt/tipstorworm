/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { initServer, db } from '../../../../../lib/initServer';
import { getServerSession } from 'next-auth';
import { MyJWT } from '../../../../../types/User/JWT.type';
import { getCurrentDateTime } from '../../../../../utils/Variables/getDateTime';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { generateHexId } from '../../../../../utils/Variables/generateHexID.util';
import { logAudit } from '../../../../../utils/Variables/AuditLogger';
import { CreateCategoryRequest } from '../../../../../types/Category/CategoryCreate.type';

/**
 * @brief Create a new category (Admin/Mod only)
 * 
 * @workflow
 *  1. Check user authentication using getServerSession
 *  2. Verify user has admin/mod permissions
 *  3. Validate category name and description
 *  4. Check for duplicate category names
 *  5. Create category in database
 *  6. Log audit action
 *  7. Return created category
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
                { error: 'Insufficient permissions to create categories' },
                { status: 403 }
            );
        }

        if (user.is_banned) {
            return NextResponse.json(
                { error: 'You are banned, lil bro.' },
                { status: 403 }
            );
        }

        const { name, description }: CreateCategoryRequest = await req.json();

        if (!name || name.trim() === '') {
            return NextResponse.json(
                { error: 'Category name is required' },
                { status: 400 }
            );
        }

        if (name.length > 200) {
            return NextResponse.json(
                { error: 'Category name must be less than 200 characters' },
                { status: 400 }
            );
        }

        if (description && description.length > 1000) {
            return NextResponse.json(
                { error: 'Description must be less than 1000 characters' },
                { status: 400 }
            );
        }

        await initServer();
        const pool = db();

        const [existing]: any = await pool.query(
            `SELECT id FROM categories WHERE name = ? LIMIT 1`,
            [name.trim()]
        );

        if (existing.length > 0) {
            return NextResponse.json(
                { error: 'Category with this name already exists' },
                { status: 409 }
            );
        }

        const id: string = generateHexId(36);
        const now: string = getCurrentDateTime();

        await pool.query(
            `INSERT INTO categories (id, name, description, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                id,
                name.trim(),
                description?.trim() || null,
                user.id,
                now,
                now
            ]
        );

        await logAudit(
            {
                user_id: user.user_id!,
                email: user.email!,
                name: user.name || "Unknown",
            },
            "category_create",
            `User ${user.email} created category: ${name}`,
            {
                category_id: id,
                category_name: name,
                description: description || null,
            }
        );


        return NextResponse.json(
            { message: 'Category created successfully' },
            { status: 201 });

    } catch (error: unknown) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: 'Server error, please try again later' },
            { status: 500 }
        );
    }
}