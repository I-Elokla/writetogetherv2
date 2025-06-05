import { NextRequest, NextResponse } from "next/server";

const PUBLIC_LT_URL = "https://api.languagetool.org/v2/check";

export async function POST(req: NextRequest) {
  const { text, language = "en-US" } = await req.json();
  const url = process.env.LT_API_URL || PUBLIC_LT_URL;

  try {
    const params = new URLSearchParams({ text, language, enabledOnly: "false" });
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("LanguageTool error:", err);
      return new NextResponse("LanguageTool API error", { status: 502 });
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (e) {
    console.error("Fetch to LanguageTool failed:", e);
    return new NextResponse("Could not reach LanguageTool", { status: 502 });
  }
}
