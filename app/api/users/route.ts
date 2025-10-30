import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { hashPassword, verifyToken } from "@/utils/auth";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { SignupSchema } from "@/schemas/auth";
import { logActivity } from "@/utils/logger";

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

    await connectDB();
    const { searchParams } = new URL(request.url);

    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            {
              email: { $regex: search, $options: "i" },
            },
          ],
        }
      : {};

    const userList = await users.find(query).skip(skip).limit(limit).lean();

    return NextResponse.json(userList, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(config.session.cookieName)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await request.json();

    const validated = SignupSchema.parse(body);

    const existingUser = await users.findOne({ email: validated.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(validated.password);

    const user = await users.create({
      ...validated,
      password: hashedPassword,
    });
    const userResponse = user.toObject();
    delete userResponse.password;

    await logActivity({
      userId: decoded.id.toString(),
      action: "create",
      entityType: "user",
      entityId: user._id.toString(),
      message: `Created user ${validated.email}`,
      metadata: { email: validated.email, role: validated.role },
    });

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
