import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import db from "@/lib/db";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);

export async function POST(req: NextRequest) {
  try {
    const { owner, title } = await req.json();
    if (!owner || !title) {
      return NextResponse.json(
        { error: "Missing owner or title" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: owner },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const code = nanoid();
    await db.document.create({
      data: {
        code,
        title,
        userId: user.id,
      },
    });

    return NextResponse.json({ code });
  } catch (err) {
    console.error("Error in /api/documents POST:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const owner = req.nextUrl.searchParams.get("owner");
    if (!owner) {
      return NextResponse.json(
        { error: "Missing owner query param" },
        { status: 400 }
      );
    }

    const docs = await db.document.findMany({
      where: {
        user: {
          email: owner,
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        code: true,
        title: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ documents: docs });
  } catch (err) {
    console.error("Error in /api/documents GET:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { owner, code } = await req.json();
    if (!owner || !code) {
      return NextResponse.json(
        { error: "Missing owner or code" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: owner },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const doc = await db.document.findUnique({
      where: { code },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (doc.userId !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await db.document.delete({
      where: { code },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in /api/documents DELETE:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
