import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { authenticateUser } from "@/lib/authenticateUser";
import { updateUserSchema } from "@/schemas/user";

export async function GET() {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const user = await users.findById(decoded.id).select("-password");

    // const user = await users.aggregate([
    //   {
    //     $match: {
    //       _id: mongoose.Types.ObjectId.createFromHexString(decoded.id),
    //     },
    //   },
    //   { $project: { password: 0 } },
    // ]);

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

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const validated = updateUserSchema.parse(body);

    const allowedUpdates = {
      name: validated.name,
    };

    const updatedUser = await users.findByIdAndUpdate(
      decoded.id,
      allowedUpdates,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/me error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
