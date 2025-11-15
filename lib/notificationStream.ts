/* eslint-disable @typescript-eslint/no-explicit-any */

import { Notification, NotificationRead } from "@/models/notification";

let started = false;
const listeners = new Set<(e: any) => void>();

export function subscribe(cb: (e: any) => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function initStream() {
  if (started) return;
  started = true;

  console.log("🔄 Notifications Change Stream Live...");

  Notification.watch([], { fullDocument: "updateLookup" }).on("change", (e) => {
    if (e.operationType === "insert") {
      const d = e.fullDocument;
      listeners.forEach((cb) =>
        cb({
          type: "NEW",
          payload: {
            id: d._id.toString(),
            title: d.title,
            body: d.body,
            type: d.type,
            audienceType: d.audienceType,
            roles: d.roles,
            users: d.users,
          },
        })
      );
    }
  });

  NotificationRead.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    (e: any) => {
      if (e.operationType === "insert") {
        const d = e.fullDocument;
        listeners.forEach((cb) =>
          cb({
            type: "READ",
            payload: {
              userId: d.userId.toString(),
              notificationId: d.notificationId.toString(),
              readAt: d.readAt,
            },
          })
        );
      }
    }
  );
}
