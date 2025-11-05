import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { hashPassword, verifyPassword } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    await connectDB();
    const { oldPassword, newPassword, confirmPassword } = await request.json();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New passwords do not match" },
        { status: 400 }
      );
    }

    const user = await users.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isOldPasswordValid = await verifyPassword(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return NextResponse.json(
        { error: "Old password is incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);
    await users.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    return NextResponse.json(
      { message: "Password updated successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("PATCH /api/me/password error:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
