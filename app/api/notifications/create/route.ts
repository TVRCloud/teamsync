import connectDB from "@/lib/mongodb";
import { Notification } from "@/models/notification";
import { CreateNotificationSchema } from "@/types/notification";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = CreateNotificationSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(parsed.error, { status: 400 });

    const notification = await Notification.create(parsed.data);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("POST /api/notifications/create error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
