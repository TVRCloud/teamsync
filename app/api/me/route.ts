import { cookies } from "next/headers";
import { config } from "@/lib/config";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get(config.session.cookieName)?.value;

    if (!token) {
      return NextResponse.json({ error: "Please log in" }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const user = await users.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET /api/me error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
