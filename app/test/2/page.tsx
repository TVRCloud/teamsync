/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import NotificationBadge from "@/components/notifications/NotificationBadge";
import NotificationDrawer from "@/components/notifications/NotificationDrawer";
import {
  useNotificationStore,
  useNotificationStream,
} from "@/store/useNotificationStore";

const USER_ID = "YOUR_USER_ID";

export default function TestNotifications() {
  const [open, setOpen] = useState(false);
  const setAll = useNotificationStore((s) => s.setAll);

  // Load existing notifications from API
  useEffect(() => {
    async function fetchNotifications() {
      const res = await fetch(`/api/notifications/list`);
      const data = await res.json();
      setAll(
        data.map((n: any) => ({
          id: n._id,
          title: n.title,
          body: n.body,
          createdAt: n.createdAt,
          read: n.read,
        }))
      );
    }
    fetchNotifications();
  }, [setAll]);

  // Connect to real-time stream
  useNotificationStream();

  return (
    <div className="p-4 flex flex-col gap-4">
      <NotificationBadge onClick={() => setOpen(true)} />
      <NotificationDrawer open={open} setOpen={setOpen} userId={USER_ID} />

      <button
        onClick={async () => {
          await fetch("/api/notifications/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "BROADCAST",
              title: "Button Test",
              body: "This notification should appear in drawer & badge",
              audienceType: "ALL",
            }),
          });
        }}
        className="p-2 bg-blue-600 text-white rounded"
      >
        Send Test Notification
      </button>
    </div>
  );
}
