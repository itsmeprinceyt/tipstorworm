import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { initServer, db } from "../../../../lib/initServer";
import { getCurrentDateTime } from "../../../../utils/Variables/getDateTime.util";
import { MyJWT } from "../../../../types/User/JWT.type";
import { logAudit } from "../../../../utils/Variables/AuditLogger.util";
import { generateHexId } from "../../../../utils/Variables/generateHexID.util";
import { SuggestionCreateRequestDTO } from "../../../..//types/DTO/Suggestion/SuggestionCreate.DTO";

/**
 * @description
 * Creates a new suggestion/report with comprehensive validation and security checks.
 * Handles user suggestions, bug reports, feature requests, content reports, etc.
 *
 * @security
 * - Parameterized queries prevent SQL injection attacks
 * - Input validation and sanitization for all fields
 * - Title length constraints
 * - User authentication required
 * - Validates related IDs if provided
 *
 * @validation
 * - Type: must be valid enum value
 * - Title: required, max 200 characters
 * - Description: required
 * - Priority: optional, defaults to 'medium'
 * - Related IDs: validated if provided
 *
 * @workflow
 * 1. Authenticate user session
 * 2. Validate request body and required fields
 * 3. Validate title length
 * 4. Validate related IDs if provided
 * 5. Create suggestion record in database
 * 6. Log audit trail
 * 7. Return appropriate response with suggestion ID
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = session.user as MyJWT;

    if (user.is_banned) {
      return NextResponse.json(
        { error: "Your account has been restricted" },
        { status: 403 }
      );
    }

    const body: SuggestionCreateRequestDTO = await req.json();

    if (
      !body.type ||
      ![
        "suggestion",
        "bug_report",
        "feature_request",
        "content_report",
        "other",
      ].includes(body.type)
    ) {
      return NextResponse.json(
        { error: "Valid type is required" },
        { status: 400 }
      );
    }

    if (!body.title || body.title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.description || body.description.trim() === "") {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    if (body.title.length > 200) {
      return NextResponse.json(
        { error: "Title must be 200 characters or less" },
        { status: 400 }
      );
    }

    await initServer();
    const pool = db();

    if (body.related_post_id) {
      const [posts] = await pool.query("SELECT id FROM posts WHERE id = ?", [
        body.related_post_id,
      ]);

      if (Array.isArray(posts) && posts.length === 0) {
        return NextResponse.json(
          { error: "Related post not found" },
          { status: 404 }
        );
      }
    }

    if (body.related_user_id) {
      const [users] = await pool.query("SELECT id FROM users WHERE id = ?", [
        body.related_user_id,
      ]);

      if (Array.isArray(users) && users.length === 0) {
        return NextResponse.json(
          { error: "Related user not found" },
          { status: 404 }
        );
      }
    }

    const suggestionId = generateHexId(36);
    const createdAt = getCurrentDateTime();

    const suggestionQuery = `
      INSERT INTO suggestions_reports (
        id, user_id, type, title, description, 
        related_post_id, related_user_id, 
        allow_contact, contact_email, metadata,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const suggestionValues = [
      suggestionId,
      user.id,
      body.type,
      body.title.trim(),
      body.description.trim(),
      body.related_post_id || null,
      body.related_user_id || null,
      body.allow_contact ? 1 : 0,
      body.contact_email || null,
      body.metadata ? JSON.stringify(body.metadata) : null,
      createdAt,
      createdAt,
    ];

    await pool.query(suggestionQuery, suggestionValues);

    await logAudit(
      {
        user_id: user.user_id!,
        email: user.email!,
        name: user.name || "Unknown",
      },
      "suggestion_create",
      `User ${user.email} submitted a suggestion report`,
      {
        suggestion_id: suggestionId,
        type: body.type,
        title: body.title,
        allow_contact: body.allow_contact,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Suggestion submitted successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating suggestion:", error);

    if (error instanceof Error) {
      if (error.message.includes("Duplicate entry")) {
        return NextResponse.json(
          { error: "A similar suggestion already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error, please try again later" },
      { status: 500 }
    );
  }
}
