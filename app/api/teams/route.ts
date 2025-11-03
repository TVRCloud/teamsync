import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import "@/models/users";
import teams from "@/models/teams";
import { createTeamSchema } from "@/schemas/teams";
import { logActivity } from "@/utils/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { errorResponse } = await authenticateUser(["admin"]);
    if (errorResponse) return errorResponse;

    await connectDB();
    const { searchParams } = new URL(request.url);

    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const teamList = await teams
      .find(query)
      .populate("createdBy", "name email role")
      // .populate("members", "name email role")
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json(teamList, { status: 200 });
  } catch (error) {
    console.error("GET /api/teams error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { user: decoded, errorResponse } = await authenticateUser(["admin"]);
    if (errorResponse) return errorResponse;

    await connectDB();
    const body = await request.json();
    const validated = createTeamSchema.parse(body);

    const existingTeam = await teams.findOne({ name: validated.name });
    if (existingTeam) {
      return NextResponse.json(
        { error: "Team already exists" },
        { status: 400 }
      );
    }

    const team = await teams.create({
      ...validated,
      createdBy: decoded.id,
    });

    await logActivity({
      userId: decoded.id,
      action: "create",
      entityType: "team",
      entityId: team._id.toString(),
      message: `Created team ${validated.name}`,
      metadata: { name: validated.name, description: validated.description },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("POST /api/teams error:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
