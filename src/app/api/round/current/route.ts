import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Round from "@/models/Round";

export async function GET() {
  await connectDB();

  const currentRound = await Round.findOne().sort({ startTime: -1 });

  if (!currentRound) {
    return NextResponse.json({ success: false, message: "No round found" }, { status: 404 });
  }

  const now = new Date();
  const timeLeft = Math.max(
    0,
    Math.floor((currentRound.endTime.getTime() - now.getTime()) / 1000)
  );

  return NextResponse.json({
    success: true,
    round: {
      roundId: currentRound.roundId,
      startTime: currentRound.startTime,
      endTime: currentRound.endTime,
      timeLeft,
      resultNumber: currentRound.resultNumber || null,
      resultColor: currentRound.resultColor || null,
    },
  });
}
