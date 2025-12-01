/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { initServer, db } from "../../../../lib/initServer";
import { getCurrentDateTime } from "../../../../utils/Variables/getDateTime.util";
import { MyJWT } from "../../../../types/User/JWT.type";
import { logAudit } from "../../../../utils/Variables/AuditLogger.util";

// TODO: fix in file
interface StatusUpdateDTO {
  status:
    | "open"
    | "in_review"
    | "planned"
    | "in_progress"
    | "completed"
    | "rejected"
    | "duplicate";
  admin_notes?: string;
  assigned_to?: string;
  priority?: "low" | "medium" | "high" | "critical";
}

interface SuggestionFilters {
  type?: string;
  status?: string;
  priority?: string;
  assigned_to?: string;
  user_id?: string;
  search?: string;
}

// Type definitions for query results
interface CountResult {
  total: number;
}

interface StatsResult {
  status: string;
  count: number;
  critical_count: number;
  high_count: number;
}

interface UserInfoResult {
  email: string;
  username: string;
}

interface SuggestionResult {
  id: string;
  title: string;
  status: string;
  user_id: string;
  closed_at: string | null;
  [key: string]: any;
}

/**
 * @description
 * Admin API for managing suggestions/reports
 * GET: Fetch all suggestions with filtering, sorting, and pagination
 * PATCH: Update suggestion status and admin details
 *
 * @security
 * - Admin-only access
 * - Parameterized queries prevent SQL injection
 * - Input validation for all fields
 * - Audit logging for all admin actions
 *
 * @permissions
 * - Only admin users can access this endpoint
 * - Admins can view all suggestions regardless of user
 * - Admins can update status, assign users, and add notes
 */
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = session.user as MyJWT;

    // Only admin users can access
    if (!user.is_admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await initServer();
    const pool = db();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Get filters
    const filters: SuggestionFilters = {};
    const filterParams: any[] = [];

    if (searchParams.get("type")) filters.type = searchParams.get("type")!;
    if (searchParams.get("status"))
      filters.status = searchParams.get("status")!;
    if (searchParams.get("priority"))
      filters.priority = searchParams.get("priority")!;
    if (searchParams.get("assigned_to"))
      filters.assigned_to = searchParams.get("assigned_to")!;
    if (searchParams.get("user_id"))
      filters.user_id = searchParams.get("user_id")!;
    if (searchParams.get("search"))
      filters.search = searchParams.get("search")!;

    // Build base query
    let query = `
      SELECT 
        sr.*,
        u.username as user_username,
        u.email as user_email,
        u.is_mod as user_is_mod,
        u.is_admin as user_is_admin,
        au.username as assigned_username,
        au.email as assigned_email,
        p.title as post_title,
        ru.username as related_user_username
      FROM suggestions_reports sr
      LEFT JOIN users u ON sr.user_id = u.id
      LEFT JOIN users au ON sr.assigned_to = au.id
      LEFT JOIN posts p ON sr.related_post_id = p.id
      LEFT JOIN users ru ON sr.related_user_id = ru.id
      WHERE 1=1
    `;

    // Apply filters
    if (filters.type) {
      query += " AND sr.type = ?";
      filterParams.push(filters.type);
    }

    if (filters.status) {
      query += " AND sr.status = ?";
      filterParams.push(filters.status);
    }

    if (filters.priority) {
      query += " AND sr.priority = ?";
      filterParams.push(filters.priority);
    }

    if (filters.assigned_to) {
      query += " AND sr.assigned_to = ?";
      filterParams.push(filters.assigned_to);
    }

    if (filters.user_id) {
      query += " AND sr.user_id = ?";
      filterParams.push(filters.user_id);
    }

    if (filters.search) {
      query +=
        " AND (sr.title LIKE ? OR sr.description LIKE ? OR u.username LIKE ? OR u.email LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      filterParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`;
    const [countResult] = await pool.query(countQuery, filterParams);
    const countArray = countResult as CountResult[];
    const total = countArray.length > 0 ? countArray[0].total : 0;

    // Apply sorting and pagination
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") === "asc" ? "ASC" : "DESC";

    query += ` ORDER BY sr.${sort} ${order} LIMIT ? OFFSET ?`;

    // Execute query with all parameters
    const [suggestions] = await pool.query(query, [
      ...filterParams,
      limit,
      offset,
    ]);

    // Get statistics
    const statsQuery = `
      SELECT 
        status,
        COUNT(*) as count,
        SUM(CASE WHEN priority = 'critical' THEN 1 ELSE 0 END) as critical_count,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_count
      FROM suggestions_reports 
      GROUP BY status
    `;

    const [stats] = await pool.query(statsQuery);
    const statsArray = stats as StatsResult[];

    return NextResponse.json(
      {
        success: true,
        data: {
          suggestions,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
          stats: statsArray,
          filters,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Internal server error, please try again later" },
      { status: 500 }
    );
  }
}

/**
 * @description
 * Update suggestion status and admin details
 * Only admin users can perform updates
 */
export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = session.user as MyJWT;

    // Only admin users can update
    if (!user.is_admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const suggestionId = searchParams.get("id");

    if (!suggestionId) {
      return NextResponse.json(
        { error: "Suggestion ID is required" },
        { status: 400 }
      );
    }

    const updateData: StatusUpdateDTO = await req.json();

    // Validate status if provided
    const validStatuses = [
      "open",
      "in_review",
      "planned",
      "in_progress",
      "completed",
      "rejected",
      "duplicate",
    ];
    if (updateData.status && !validStatuses.includes(updateData.status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Validate priority if provided
    const validPriorities = ["low", "medium", "high", "critical"];
    if (updateData.priority && !validPriorities.includes(updateData.priority)) {
      return NextResponse.json(
        { error: "Invalid priority value" },
        { status: 400 }
      );
    }

    // Validate assigned_to if provided
    if (updateData.assigned_to) {
      await initServer();
      const pool = db();

      const [users] = await pool.query("SELECT id FROM users WHERE id = ?", [
        updateData.assigned_to,
      ]);

      const usersArray = users as { id: string }[];
      if (usersArray.length === 0) {
        return NextResponse.json(
          { error: "Assigned user not found" },
          { status: 404 }
        );
      }
    }

    await initServer();
    const pool = db();

    // Check if suggestion exists
    const [existing] = await pool.query(
      "SELECT id, title, status, user_id, closed_at FROM suggestions_reports WHERE id = ?",
      [suggestionId]
    );

    const existingArray = existing as SuggestionResult[];
    if (existingArray.length === 0) {
      return NextResponse.json(
        { error: "Suggestion not found" },
        { status: 404 }
      );
    }

    const existingSuggestion = existingArray[0];
    const updatedAt = getCurrentDateTime();

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (updateData.status) {
      updateFields.push("status = ?");
      updateValues.push(updateData.status);

      // If status is being closed, set closed_at
      if (
        ["completed", "rejected", "duplicate"].includes(updateData.status) &&
        !existingSuggestion.closed_at
      ) {
        updateFields.push("closed_at = ?");
        updateValues.push(updatedAt);
      }
    }

    if (updateData.admin_notes !== undefined) {
      updateFields.push("admin_notes = ?");
      updateValues.push(updateData.admin_notes);
    }

    if (updateData.assigned_to !== undefined) {
      updateFields.push("assigned_to = ?");
      updateValues.push(updateData.assigned_to || null);
    }

    if (updateData.priority) {
      updateFields.push("priority = ?");
      updateValues.push(updateData.priority);
    }

    // Always update updated_at
    updateFields.push("updated_at = ?");
    updateValues.push(updatedAt);

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // Add suggestion ID for WHERE clause
    updateValues.push(suggestionId);

    const updateQuery = `
      UPDATE suggestions_reports 
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;

    await pool.query(updateQuery, updateValues);

    // Get user info for audit log
    const [userInfo] = await pool.query(
      "SELECT email, username FROM users WHERE id = ?",
      [existingSuggestion.user_id]
    );

    const userInfoArray = userInfo as UserInfoResult[];
    const submitterInfo =
      userInfoArray.length > 0
        ? userInfoArray[0]
        : { email: "unknown", username: "unknown" };

    // Log audit trail
    await logAudit(
      {
        user_id: user.user_id!,
        email: user.email!,
        name: user.name || "Unknown",
      },
      "suggestion_update",
      `Admin ${user.email} updated suggestion "${
        existingSuggestion.title
      }" from "${existingSuggestion.status}" to "${
        updateData.status || existingSuggestion.status
      }"`,
      {
        suggestion_id: suggestionId,
        previous_status: existingSuggestion.status,
        new_status: updateData.status || existingSuggestion.status,
        assigned_to: updateData.assigned_to,
        priority: updateData.priority,
        admin_id: user.id,
        submitter_email: submitterInfo.email,
      }
    );

    // Get updated suggestion
    const [updatedSuggestion] = await pool.query(
      `SELECT 
        sr.*,
        u.username as user_username,
        u.email as user_email,
        au.username as assigned_username
      FROM suggestions_reports sr
      LEFT JOIN users u ON sr.user_id = u.id
      LEFT JOIN users au ON sr.assigned_to = au.id
      WHERE sr.id = ?`,
      [suggestionId]
    );

    const updatedArray = updatedSuggestion as any[];
    return NextResponse.json(
      {
        success: true,
        message: "Suggestion updated successfully",
        data: {
          suggestion: updatedArray.length > 0 ? updatedArray[0] : null,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating suggestion:", error);

    if (error instanceof Error) {
      if (error.message.includes("foreign key constraint")) {
        return NextResponse.json(
          { error: "Invalid assigned user ID" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error, please try again later" },
      { status: 500 }
    );
  }
}

/**
 * @description
 * Delete a suggestion (admin only, soft delete via status update)
 */
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = session.user as MyJWT;

    if (!user.is_admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const suggestionId = searchParams.get("id");

    if (!suggestionId) {
      return NextResponse.json(
        { error: "Suggestion ID is required" },
        { status: 400 }
      );
    }

    await initServer();
    const pool = db();

    // Get suggestion before deletion for audit
    const [suggestion] = await pool.query(
      "SELECT * FROM suggestions_reports WHERE id = ?",
      [suggestionId]
    );

    const suggestionArray = suggestion as SuggestionResult[];
    if (suggestionArray.length === 0) {
      return NextResponse.json(
        { error: "Suggestion not found" },
        { status: 404 }
      );
    }

    const suggestionData = suggestionArray[0];

    // Soft delete by marking as rejected
    const deletedAt = getCurrentDateTime();
    const updateQuery = `
      UPDATE suggestions_reports 
      SET status = 'rejected', 
          updated_at = ?, 
          closed_at = ?,
          admin_notes = CONCAT(IFNULL(admin_notes, ''), '\\n\\n[Deleted by admin ${user.email} at ${deletedAt}]')
      WHERE id = ?
    `;

    await pool.query(updateQuery, [deletedAt, deletedAt, suggestionId]);

    // Log audit trail
    await logAudit(
      {
        user_id: user.user_id!,
        email: user.email!,
        name: user.name || "Unknown",
      },
      "suggestion_delete",
      `Admin ${user.email} deleted suggestion "${suggestionData.title}"`,
      {
        suggestion_id: suggestionId,
        title: suggestionData.title,
        type: suggestionData.type as string,
        submitter_id: suggestionData.user_id,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Suggestion deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting suggestion:", error);
    return NextResponse.json(
      { error: "Internal server error, please try again later" },
      { status: 500 }
    );
  }
}
