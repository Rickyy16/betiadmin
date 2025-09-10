import mongoose, { Schema, Document } from "mongoose";

export interface IRound extends Document {
  roundId: string;
  startTime: Date;
  endTime: Date;
  resultNumber?: number;
  resultColor?: string;
  manualResultNumber?: number;
}

const RoundSchema = new Schema<IRound>({
  roundId: { type: String, required: true, unique: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  resultNumber: { type: Number },
  resultColor: { type: String },
  manualResultNumber: { type: Number }
});

export default mongoose.models.Round || mongoose.model<IRound>("Round", RoundSchema);
