/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { Notification } from "@/models/notification";
import { NotificationRead } from "@/models/notification-read";
import {
  CreateNotificationInput,
  NotificationWithRead,
} from "@/types/notification";
import { authenticateUser } from "@/lib/authenticateUser";
import { emitNotification } from "@/lib/socket";
import { isValidObjectId, toObjectId } from "@/utils/object-id";

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

    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const userObjectId = toObjectId(userId);

    // Build query filter
    const filter: any = {
      $or: [
        { audienceType: "ALL" },
        {
          audienceType: "ROLE",
          roles: { $in: [searchParams.get("userRole") || "user"] },
        },
        { audienceType: "USER", users: userObjectId },
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
      .lean();

    // Fetch read status for user
    const readRecords = await NotificationRead.find({
      userId: userObjectId,
      notificationId: { $in: notifications.map((n) => n._id) },
    }).lean();

    const readMap = new Map(
      readRecords.map((r) => [r.notificationId.toString(), r])
    );

    // Merge notifications with read status
    const notificationsWithRead = notifications.map((notif: any) => ({
      notification: notif,
      read: !!readMap.has(notif._id.toString()),
      readAt: readMap.get(notif._id.toString())?.readAt,
    }));

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
    const { user, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

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

    try {
      console.log("[v0] Broadcasting notification after save");
      emitNotification(
        body.audienceType as "ALL" | "ROLE" | "USER",
        {
          _id: notification._id,
          type: notification.type,
          title: notification.title,
          body: notification.body,
          audienceType: notification.audienceType,
          createdAt: notification.createdAt,
        },
        body.roles,
        body.users?.map(String)
      );
    } catch (socketError) {
      console.error("[v0] Broadcast error:", socketError);
    }

    return NextResponse.json({ data: notification }, { status: 201 });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
