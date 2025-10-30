/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { config } from "@/lib/config";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import connectDB from "@/lib/mongodb";
import ActivityLog from "@/models/log";

export async function GET(request: Request) {
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

    if (decoded && decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }
    await connectDB();
    const { searchParams } = new URL(request.url);
    const skip = Number.parseInt(searchParams.get("skip") || "0");
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const action = searchParams.get("action");
    const entityType = searchParams.get("entityType");

    const query: Record<string, any> = {};
    if (action) query.action = { $in: action.split(",") };
    if (entityType) query.entityType = { $in: entityType.split(",") };

    const logs = await ActivityLog.find(query)
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("GET /api/log error:", error);
    return NextResponse.json({ error: "Failed to fetch log" }, { status: 500 });
  }
}
