/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { INotification, Notification } from "@/models/notification";
import { NotificationRead } from "@/models/notification-read";
import {
  CreateNotificationInput,
  NotificationWithRead,
} from "@/types/notification";
import { authenticateUser } from "@/lib/authenticateUser";

// GET /api/notifications - Fetch notifications with pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { user, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Build query filter
    const filter: any = {
      $or: [
        { audienceType: "ALL" },
        {
          audienceType: "ROLE",
          roles: { $in: [searchParams.get("userRole") || "user"] },
        },
        { audienceType: "USER", users: new mongoose.Types.ObjectId(userId) },
      ],
    };

    if (type) {
      filter.type = type;
    }

    // Fetch notifications
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<INotification[]>();

    // Fetch read status for user
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const readRecords = await NotificationRead.find({
      userId: userObjectId,
      notificationId: { $in: notifications.map((n) => n._id) },
    }).lean();

    const readMap = new Map(
      readRecords.map((r) => [r.notificationId.toString(), r])
    );

    // Merge notifications with read status
    const notificationsWithRead: NotificationWithRead[] = notifications.map(
      (notif) => ({
        notification: notif,
        read: !!readMap.has(notif._id.toString()),
        readAt: readMap.get(notif._id.toString())?.readAt,
      })
    );

    const total = await Notification.countDocuments(filter);

    return NextResponse.json({
      data: notificationsWithRead,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: CreateNotificationInput = await request.json();

    // Validate input
    if (!body.title || !body.body || !body.audienceType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create notification
    const notification = new Notification({
      type: body.type || "BROADCAST",
      title: body.title,
      body: body.body,
      audienceType: body.audienceType,
      roles: body.roles || [],
      users: body.users?.map((id) => new mongoose.Types.ObjectId(id)) || [],
      meta: body.meta || {},
    });

    await notification.save();

    // TODO: Emit socket event to relevant rooms
    // getIO().to(getRoomName(body.audienceType, body.roles, body.users)).emit('new-notification', notification);

    return NextResponse.json({ data: notification }, { status: 201 });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
