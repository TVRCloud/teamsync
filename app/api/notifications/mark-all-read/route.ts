/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { Notification } from "@/models/notification";
import { NotificationRead } from "@/models/notification-read";

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, userRole } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get all visible notifications
    const filter = {
      $or: [
        { audienceType: "ALL" },
        { audienceType: "ROLE", roles: { $in: [userRole || "user"] } },
        { audienceType: "USER", users: userObjectId },
      ],
    };

    const allNotifications = await Notification.find(filter)
      .select("_id")
      .lean();
    const notificationIds = allNotifications.map((n) => n._id);

    // Get already read notifications
    const readRecords = await NotificationRead.find({
      userId: userObjectId,
      notificationId: { $in: notificationIds },
    })
      .select("notificationId")
      .lean();

    const readIds = readRecords.map((r) => r.notificationId.toString());

    // Create records for unread notifications
    const unreadNotificationIds = notificationIds.filter(
      (id: any) => !readIds.includes(id.toString())
    );

    if (unreadNotificationIds.length > 0) {
      const bulkOps = unreadNotificationIds.map((notifId) => ({
        insertOne: {
          document: {
            userId: userObjectId,
            notificationId: notifId,
            readAt: new Date(),
            createdAt: new Date(),
          },
        },
      }));

      await NotificationRead.collection.bulkWrite(bulkOps);
    }

    return NextResponse.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("PATCH /api/notifications/mark-all-read error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
