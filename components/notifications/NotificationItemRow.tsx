"use client";

import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationItemRow({
  notif,
}: {
  notif: {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    read: boolean;
  };
}) {
  const markAsRead = useNotificationStore((s) => s.markAsRead);

  const onRead = async () => {
    if (!notif.read) {
      await fetch("/api/notifications/read", {
        method: "POST",
        body: JSON.stringify({
          userId: "USER_ID_HERE", // ← replace with auth user
          notificationId: notif.id,
        }),
      });
      markAsRead(notif.id);
    }
  };

  return (
    <button
      onClick={onRead}
      className={`w-full p-4 text-left hover:bg-muted transition ${
        !notif.read ? "bg-slate-100 dark:bg-slate-800" : ""
      }`}
    >
      <h4 className="font-semibold">{notif.title}</h4>
      <p className="text-sm text-muted-foreground">{notif.body}</p>

      {!notif.read && (
        <span className="text-xs mt-2 inline-block bg-blue-600 text-white px-2 py-1 rounded">
          New
        </span>
      )}
    </button>
  );
}
