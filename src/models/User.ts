import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  firstname: string;
  lastname: string;
  phone:string;
  email:string;
  password: string;
  balance: number;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required:true , unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
});

export default mongoose.models.User<IUser> || mongoose.model<IUser>("User", UserSchema);