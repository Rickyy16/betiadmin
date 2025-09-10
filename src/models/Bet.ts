import mongoose, { Schema, Document } from "mongoose";

export interface IBet extends Document {
  roundId: string;
  userId: string;
  betType: "number" | "color";
  betValue: string;
  amount: number;
  status: "pending" | "won" | "lost";
  payout: number;
}

const BetSchema = new Schema<IBet>({
  roundId: { type: String, required: true },
  userId: { type: String, required: true },
  betType: { type: String, required: true },
  betValue: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "pending" },
  payout: { type: Number, default: 0 }
});

export default mongoose.models.Bet || mongoose.model<IBet>("Bet", BetSchema);
