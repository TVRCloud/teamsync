import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import projects from "@/models/projects";
import { createProjectSchema } from "@/schemas/project";
import { logActivity } from "@/utils/logger";
import { NextResponse } from "next/server";

function getRandomColor() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
}

async function generateUniqueColor() {
  let color = getRandomColor();
  let exists = await projects.exists({ color });

  while (exists) {
    color = getRandomColor();
    exists = await projects.exists({ color });
  }

  return color;
}

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

    const projectList = await projects.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "teams",
          foreignField: "_id",
          as: "teams",
        },
      },
      { $unwind: "$createdBy" },
      {
        $project: {
          name: 1,
          status: 1,
          priority: 1,
          createdAt: 1,
          updatedAt: 1,

          "createdBy.name": 1,
          "teams.name": 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    return NextResponse.json(projectList, { status: 200 });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
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
    const validated = createProjectSchema.parse(body);

    const existingProject = await projects.findOne({ name: validated.name });
    if (existingProject) {
      return NextResponse.json(
        { error: "Project already exists" },
        { status: 400 }
      );
    }

    const color = await generateUniqueColor();

    const project = await projects.create({
      ...validated,
      createdBy: decoded.id,
      color,
    });

    await logActivity({
      userId: decoded.id,
      action: "create",
      entityType: "project",
      entityId: project._id.toString(),
      message: `Created project ${validated.name}`,
      metadata: { name: validated.name, description: validated.description },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
