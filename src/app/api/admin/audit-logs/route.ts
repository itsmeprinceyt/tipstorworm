/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { initServer, db } from '../../../../lib/initServer';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { GetAuditLogsResponseDTO } from '../../../../types/DTO/Audit.DTO';

/**
 * @brief Get audit logs with pagination, searching, and filtering
 * 
 * @description
 * Fetches audit logs from the database with support for:
 * - Pagination (page, limit)
 * - Text search across description, actor name, and email
 * - Filtering by action type, actor user ID, target user ID
 * - Date range filtering
 * - Custom sorting
 * 
 * @workflow
 * 1. Authenticate user and check admin/mod permissions
 * 2. Validate query parameters
 * 3. Build dynamic SQL query with WHERE clauses
 * 4. Execute count query for pagination
 * 5. Fetch audit logs with user joins
 * 6. Format response with pagination metadata
 * 
 * 
 * @query_params
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 50, max: 100)
 * - search: Text search in description, actor_name, actor_email
 * - action_type: Filter by specific action type
 * - actor_user_id: Filter by actor user ID
 * - target_user_id: Filter by target user ID
 * - start_date: Filter logs from this date
 * - end_date: Filter logs until this date
 * - sort_by: Sort field (performed_at, action_type, actor_name)
 * - sort_order: Sort direction (asc, desc)
 */
export async function GET(req: Request): Promise<NextResponse<GetAuditLogsResponseDTO | { error: string }>> {
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
                { error: 'Insufficient permissions to view audit logs' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const search = searchParams.get('search') || '';
        const action_type = searchParams.get('action_type') || '';
        const actor_user_id = searchParams.get('actor_user_id') || '';
        const target_user_id = searchParams.get('target_user_id') || '';
        const start_date = searchParams.get('start_date') || '';
        const end_date = searchParams.get('end_date') || '';
        const sort_by = (searchParams.get('sort_by') as 'performed_at' | 'action_type' | 'actor_name') || 'performed_at';
        const sort_order = (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc';
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

        const validSortFields = ['performed_at', 'action_type', 'actor_name'];
        if (!validSortFields.includes(sort_by)) {
            return NextResponse.json(
                { error: `Invalid sort field. Must be one of: ${validSortFields.join(', ')}` },
                { status: 400 }
            );
        }

        if (sort_order !== 'asc' && sort_order !== 'desc') {
            return NextResponse.json(
                { error: 'Sort order must be "asc" or "desc"' },
                { status: 400 }
            );
        }

        const offset = (page - 1) * limit;

        await initServer();
        const pool = db();

        const whereConditions: string[] = [];
        const queryParams: any[] = [];

        if (search) {
            whereConditions.push(`
                (al.description LIKE ? 
                OR al.actor_name LIKE ? 
                OR al.actor_email LIKE ?)
            `);
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (action_type) {
            whereConditions.push('al.action_type = ?');
            queryParams.push(action_type);
        }

        if (actor_user_id) {
            whereConditions.push('al.actor_user_id = ?');
            queryParams.push(actor_user_id);
        }

        if (target_user_id) {
            whereConditions.push('al.target_user_id = ?');
            queryParams.push(target_user_id);
        }

        if (start_date) {
            whereConditions.push('al.performed_at >= ?');
            queryParams.push(start_date);
        }

        if (end_date) {
            whereConditions.push('al.performed_at <= ?');
            queryParams.push(end_date + ' 23:59:59');
        }

        const whereClause = whereConditions.length > 0
            ? `WHERE ${whereConditions.join(' AND ')}`
            : '';

        const countQuery = `SELECT COUNT(*) as total FROM audit_logs al ${whereClause}`;
        const [countResult]: any = await pool.query(countQuery, queryParams);
        const total = countResult[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);

        const dataQuery = `
            SELECT 
                al.id,
                al.action_type,
                al.actor_user_id,
                al.target_user_id,
                al.actor_email,
                al.actor_name,
                al.description,
                al.meta,
                al.performed_at,
                actor.id as actor_user_db_id,
                actor.name as actor_user_name,
                actor.username as actor_username,
                target.id as target_user_db_id,
                target.name as target_user_name,
                target.username as target_username
            FROM audit_logs al
            LEFT JOIN users actor ON al.actor_user_id = actor.id
            LEFT JOIN users target ON al.target_user_id = target.id
            ${whereClause}
            ORDER BY al.${sort_by} ${sort_order.toUpperCase()}
            LIMIT ? OFFSET ?
        `;

        const dataParams = [...queryParams, limit, offset];
        const [auditLogs]: any = await pool.query(dataQuery, dataParams);

        const formattedLogs = auditLogs.map((log: any) => ({
            id: log.id,
            action_type: log.action_type,
            actor: {
                user_id: log.actor_user_id,
                email: log.actor_email,
                name: log.actor_name,
                db_id: log.actor_user_db_id,
                username: log.actor_username,
                display_name: log.actor_user_name || log.actor_name
            },
            target: log.target_user_id ? {
                user_id: log.target_user_id,
                db_id: log.target_user_db_id,
                name: log.target_user_name,
                username: log.target_username
            } : null,
            description: log.description,
            meta: typeof log.meta === 'string' ? JSON.parse(log.meta) : log.meta,
            performed_at: log.performed_at
        }));

        const response: GetAuditLogsResponseDTO = {
            audit_logs: formattedLogs,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            filters: {
                search,
                action_type,
                actor_user_id,
                target_user_id,
                start_date,
                end_date,
                sort_by,
                sort_order
            }
        };

        return NextResponse.json(response);

    } catch (error: unknown) {
        console.error('Error fetching audit logs:', error);
        return NextResponse.json(
            { error: 'Server error, please try again later' },
            { status: 500 }
        );
    }
}