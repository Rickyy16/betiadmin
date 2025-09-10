// app/api/admin/round/[id]/override/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Round from "@/models/Round";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const admin = await getUserFromToken(req);

  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { number } = await req.json(); // number chosen by admin

  const round = await Round.findOne({ roundId: params.id });
  if (!round) {
    return NextResponse.json({ error: "Round not found" }, { status: 404 });
  }

  if (round.resultNumber) {
    return NextResponse.json({ error: "Round already closed" }, { status: 400 });
  }

  round.manualResultNumber = number;
  await round.save();

  return NextResponse.json({ success: true, manualResultNumber: number });
}
