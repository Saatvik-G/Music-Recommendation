import { NextRequest, NextResponse } from "next/server";
import { colorMoodSearch, weatherMoodSearch, personalitySearch, activitySearch } from "@/lib/gemini";
import { enrichRecommendationsWithArtwork } from "@/lib/artwork";

export async function POST(req: NextRequest) {
  try {
    const { mode, value } = await req.json();
    if (!mode || !value) return NextResponse.json({ error: "Mode and value required" }, { status: 400 });

    let result;
    switch (mode) {
      case "color": result = await colorMoodSearch(value); break;
      case "weather": result = await weatherMoodSearch(value); break;
      case "personality": result = await personalitySearch(value); break;
      case "activity": result = await activitySearch(value); break;
      case "mood": result = await weatherMoodSearch(value); break;
      default: return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    if (result && result.recommendations) {
      result.recommendations = await enrichRecommendationsWithArtwork(result.recommendations);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Recommendations API error:", error);
    return NextResponse.json({ error: "Recommendation failed" }, { status: 500 });
  }
}
