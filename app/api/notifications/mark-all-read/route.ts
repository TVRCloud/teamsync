import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { authenticateUser } from "@/lib/authenticateUser";
import { isValidObjectId, toObjectId } from "@/utils/object-id";
import { Notification } from "@/models/notification";
import { NotificationRead } from "@/models/notification-read";

export async function PATCH() {
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

    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    const userObjectId = toObjectId(userId);

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
      (id) => !readIds.includes(id)
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
