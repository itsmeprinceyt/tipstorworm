/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { initServer, db } from '../../../../lib/initServer';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

/**
 * @brief Get all categories with optional filtering and pagination
 * 
 * @workflow
 *  1. Check user authentication (optional - public access for categories)
 *  2. Handle query parameters for pagination and filtering
 *  3. Build SQL query based on parameters
 *  4. Fetch categories with creator information
 *  5. Return categories list with pagination info
 */

export async function GET(req: Request): Promise<NextResponse> {
    try {

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        if (!session.user.is_admin && !session.user.is_mod) {
            return NextResponse.json(
                { error: 'Insufficient permissions to view categories' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const includeCreator = searchParams.get('include_creator') === 'true';
        const search = searchParams.get('search') || '';

        if (page < 1) {
            return NextResponse.json(
                { error: 'Page must be greater than 0' },
                { status: 400 }
            );
        }

        if (limit < 1 || limit > 100) {
            return NextResponse.json(
                { error: 'Limit must be between 1 and 100' },
                { status: 400 }
            );
        }

        const offset = (page - 1) * limit;

        await initServer();
        const pool = db();

        let baseQuery = `
            SELECT 
                c.id,
                c.name,
                c.description,
                c.created_at,
                c.updated_at
        `;

        if (includeCreator) {
            baseQuery += `,
                u.id as creator_id,
                u.user_id as creator_user_id,
                u.name as creator_name,
                u.username as creator_username,
                u.email as creator_email
            `;
        }

        baseQuery += `
            FROM categories c
        `;

        if (includeCreator) {
            baseQuery += ` LEFT JOIN users u ON c.created_by = u.id `;
        }

        let whereClause = '';
        const queryParams: any[] = [];

        if (search) {
            whereClause = ` WHERE c.name LIKE ? OR c.description LIKE ? `;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        const countQuery = `SELECT COUNT(*) as total FROM categories c ${whereClause}`;
        const [countResult]: any = await pool.query(countQuery, queryParams);
        const total = countResult[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);

        const dataQuery = `
            ${baseQuery}
            ${whereClause}
            ORDER BY c.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const dataParams = [...queryParams, limit, offset];
        const [categories]: any = await pool.query(dataQuery, dataParams);

        const formattedCategories = categories.map((category: any) => {
            const baseCategory = {
                id: category.id,
                name: category.name,
                description: category.description,
                created_at: category.created_at,
                updated_at: category.updated_at
            };

            if (includeCreator && category.creator_id) {
                return {
                    ...baseCategory,
                    created_by: {
                        id: category.creator_id,
                        user_id: category.creator_user_id,
                        name: category.creator_name,
                        username: category.creator_username,
                        email: category.creator_email
                    }
                };
            }

            return baseCategory;
        });

        return NextResponse.json({
            success: true,
            categories: formattedCategories,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error: unknown) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Server error, please try again later' },
            { status: 500 }
        );
    }
}