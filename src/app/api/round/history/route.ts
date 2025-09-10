// app/api/round/history/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Round from "@/models/Round";

export async function GET() {
  await connectDB();

  const rounds = await Round.find()
    .sort({ startTime: -1 })
    .limit(50) // last 50 rounds
    .lean();

  return NextResponse.json({ rounds });
}
