import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { NotificationRead } from "@/models/notification-read";
import { authenticateUser } from "@/lib/authenticateUser";

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const { user, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { notificationId } = body;
    const userId = user?.id;

    if (!userId || !notificationId) {
      return NextResponse.json(
        { error: "userId and notificationId are required" },
        { status: 400 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const notifObjectId = new mongoose.Types.ObjectId(notificationId);

    // Use upsert to create or update
    const result = await NotificationRead.findOneAndUpdate(
      { userId: userObjectId, notificationId: notifObjectId },
      { readAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("PATCH /api/notifications/mark-read error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
