import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { authenticateUser } from "@/lib/authenticateUser";

export async function GET() {
  try {
    const { user: decoded, errorResponse } = await authenticateUser();

    if (errorResponse) return errorResponse;

    await connectDB();
    const user = await users.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET /api/me error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
