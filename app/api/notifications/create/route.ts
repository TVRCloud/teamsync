import connectDB from "@/lib/mongodb";
import { Notification } from "@/models/notification";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { type, title, body: content, audienceType, roles, users } = body;

    if (!type || !title || !content || !audienceType)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const notification = await Notification.create({
      type,
      title,
      body: content,
      audienceType,
      roles,
      users,
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
