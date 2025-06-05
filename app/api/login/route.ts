import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const valid = await compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  return NextResponse.json({
    message: "Login successful",
    user: { id: user.id, email: user.email, name: user.name },
  });
}
