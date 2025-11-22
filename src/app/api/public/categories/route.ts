/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { initServer, db } from "@/lib/initServer";

// TODO: in file
interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface CategoriesResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * @description
 * Retrieves a paginated list of categories with id, name, and description.
 * Supports pagination with page and limit query parameters.
 *
 * @query_parameters
 * - page: Page number (default: 1)
 * - limit: Number of items per page (default: 10, max: 100)
 *
 * @response
 * - categories: Array of category objects
 * - total: Total number of categories
 * - page: Current page number
 * - limit: Number of items per page
 * - totalPages: Total number of pages
 */
export async function GET(req: Request): Promise<NextResponse> {
  try {
    await initServer();
    const pool = db();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10"))
    );
    const offset = (page - 1) * limit;

    // Get total count of categories
    const [countResult] = await pool.query(
      "SELECT COUNT(*) as total FROM categories"
    );

    const total =
      Array.isArray(countResult) && countResult.length > 0
        ? (countResult[0] as any).total
        : 0;

    // Get paginated categories
    const [categories] = await pool.query(
      `SELECT id, name, description 
       FROM categories 
       ORDER BY name ASC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const totalPages = Math.ceil(total / limit);

    const response: CategoriesResponse = {
      categories: (Array.isArray(categories) ? categories : []) as Category[],
      total,
      page,
      limit,
      totalPages,
    };

    return NextResponse.json({ success: true, response }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);

    return NextResponse.json(
      { error: "Internal server error, please try again later" },
      { status: 500 }
    );
  }
}
