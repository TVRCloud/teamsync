import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import teams from "@/models/teams";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { errorResponse } = await authenticateUser(["admin", "manager"]);
    if (errorResponse) return errorResponse;

    await connectDB();

    const team = await teams.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
          pipeline: [
            { $project: { password: 0, __v: 0, createdAt: 0, updatedAt: 0 } },
          ],
        },
      },

      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "teams",
          as: "projects",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
          pipeline: [
            { $project: { password: 0, __v: 0, createdAt: 0, updatedAt: 0 } },
          ],
        },
      },
      { $unwind: "$createdBy" },

      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          members: 1,
          projects: 1,
          createdBy: 1,
        },
      },
    ]);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team[0], { status: 200 });
  } catch (error) {
    console.error("GET /api/teams/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {}

export async function DELETE(request: Request) {}
