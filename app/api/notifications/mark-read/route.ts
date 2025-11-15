import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { NotificationRead } from "@/models/notification-read";
import { authenticateUser } from "@/lib/authenticateUser";
import { isValidObjectId, toObjectId } from "@/utils/object-id";

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

    if (!isValidObjectId(userId) || !isValidObjectId(notificationId)) {
      return NextResponse.json(
        { error: "Invalid userId or notificationId format" },
        { status: 400 }
      );
    }

    const userObjectId = toObjectId(userId);
    const notifObjectId = toObjectId(notificationId);

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
