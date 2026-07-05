import { NextRequest, NextResponse } from "next/server";
import { generatePlaylist } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    const playlist = await generatePlaylist(prompt);
    return NextResponse.json(playlist);
  } catch (error) {
    console.error("Playlist generate error:", error);
    return NextResponse.json({ error: "Playlist generation failed" }, { status: 500 });
  }
}
