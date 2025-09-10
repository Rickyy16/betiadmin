import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const { phone, password } = await req.json();
        await connectDB();

        const user = await User.findOne({ phone, role: "admin" });

        if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

        return new Response(JSON.stringify({ token, balance: user.balance, firstname: user.firstname }), { status: 200 });
    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message || "Login Failed" }), { status: 500 });
    }
}
