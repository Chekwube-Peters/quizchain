import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Room code required" }, { status: 400 });
    }
    // In production: look up room in DB
    // For now, rooms exist only in socket server memory
    return NextResponse.json({ exists: true, code: code.toUpperCase() });
  } catch {
    return NextResponse.json({ error: "Failed to check room" }, { status: 500 });
  }
}
