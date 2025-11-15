import { NextRequest, NextResponse } from "next/server";
import { notificationBroadcaster } from "@/lib/socket";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const userRole = searchParams.get("userRole");

  if (!userId || !userRole) {
    return NextResponse.json(
      { error: "userId and userRole are required" },
      { status: 400 }
    );
  }

  console.log("[v0] Socket listener connected:", { userId, userRole });

  // Register user for notifications
  notificationBroadcaster.joinRoom("ALL", userId);
  notificationBroadcaster.joinRoom(`ROLE_${userRole}`, userId);
  notificationBroadcaster.joinRoom(`USER_${userId}`, userId);

  // Setup listener for this user's rooms
  const rooms = ["ALL", `ROLE_${userRole}`, `USER_${userId}`];
  const notifications: any[] = [];
  let notificationReceived = false;

  // Create promise that resolves when notification arrives or timeout
  const notificationPromise = new Promise<any>((resolve) => {
    const listeners: { [key: string]: (data: any) => void } = {};

    rooms.forEach((room) => {
      listeners[room] = (data: any) => {
        notificationReceived = true;
        resolve(data);
      };
      notificationBroadcaster.on(`${room}:notification`, listeners[room]);
    });

    // Timeout after 30 seconds
    const timeout = setTimeout(() => {
      rooms.forEach((room) => {
        notificationBroadcaster.off(`${room}:notification`, listeners[room]);
      });
      resolve(null);
    }, 30000);
  });

  const notification = await notificationPromise;

  if (notification) {
    console.log("[v0] Sending notification to client:", {
      userId,
      title: notification.title,
    });
    return NextResponse.json({ notification, received: true });
  }

  return NextResponse.json({ notification: null, received: false });
}
