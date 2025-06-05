import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";
import { getRandomUser } from "../database";

const secretKey = process.env.LIVEBLOCKS_SECRET_KEY;
if (!secretKey) {
  console.error("Missing LIVEBLOCKS_SECRET_KEY");
}
const liveblocks = new Liveblocks({ secret: secretKey! });

export async function POST(request: NextRequest) {
  if (!secretKey) {
    return new NextResponse("Missing LIVEBLOCKS_SECRET_KEY", { status: 403 });
  }

  // Await getRandomUser (it returns a Promise)
  const user = await getRandomUser();
  if (!user) {
    return new NextResponse("No users available", { status: 500 });
  }

  // Prepare and authorize a session for this user
  const session = liveblocks.prepareSession(user.id, {
    userInfo: user.info,
  });

  // Grant full access under your namespace
  session.allow("userspace:*", session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new NextResponse(body, { status });
}
