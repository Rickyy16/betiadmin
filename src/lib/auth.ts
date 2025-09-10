import jwt from "jsonwebtoken";
import User from "@/models/User";  // <-- your mongoose user model
import { connectDB } from "./mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "ttfrttai7911161718"; 

export interface JwtPayload {
  userId: string;
}

// 🔹 Create JWT
export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

// 🔹 Verify JWT
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    console.error(err)
    return null;
  }
}

// 🔹 Extract user from token inside API routes
export async function getUserFromToken(req: Request) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = await User.findById(decoded.userId);
  return user || null;
}
