import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { Notification } from "@/models/notification";
import { NotificationRead } from "@/models/notification-read";
import { UnreadCountResponse } from "@/types/notification";
import { authenticateUser } from "@/lib/authenticateUser";

export async function GET() {
  try {
    await connectDB();
    const { user, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const userId = user?.id;
    const userRole = user?.role;
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get all notifications the user should see
    const filter = {
      $or: [
        { audienceType: "ALL" },
        { audienceType: "ROLE", roles: { $in: [userRole] } },
        { audienceType: "USER", users: userObjectId },
      ],
    };

    const totalCount = await Notification.countDocuments(filter);

    // Get notifications the user has NOT read
    const readNotifications = await NotificationRead.find({
      userId: userObjectId,
    })
      .select("notificationId")
      .lean();

    const readIds = readNotifications.map((r) => r.notificationId);

    const unreadCount = await Notification.countDocuments({
      ...filter,
      _id: { $nin: readIds },
    });

    const response: UnreadCountResponse = {
      unreadCount,
      totalCount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/notifications/unread-count error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
