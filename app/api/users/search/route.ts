import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("text") || "";
  const matches = await db.user.findMany({
    where: { email: { contains: text } },
    take: 10,
  });
  return NextResponse.json(matches.map((u) => u.email));
}
