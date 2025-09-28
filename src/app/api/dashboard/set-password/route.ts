import { NextRequest, NextResponse } from "next/server";
import { initServer, db } from "@/lib/initServer";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  await initServer();
  const pool = db();

  const hashed = await bcrypt.hash(password, 10); // always hash the password
  await pool.execute("UPDATE users SET password = ? WHERE email = ?", [hashed, email]);

  return NextResponse.json({ success: true });
}
