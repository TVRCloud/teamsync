import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { verifyToken } from "@/utils/auth";
import connectDB from "@/lib/mongodb";
import ActivityLog from "@/models/log";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const cookieStore = cookies();
    const token = (await cookieStore).get(config.session.cookieName)?.value;

    if (!token) {
      return NextResponse.json({ error: "Please log in" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    if (decoded && decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    await connectDB();
    const log = await ActivityLog.find({ user: id });

    if (!log) {
      return NextResponse.json(
        { error: "Activity log not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(log, { status: 200 });
  } catch (error) {
    console.error("GET /api/activity-log/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity log" },
      { status: 500 }
    );
  }
}
