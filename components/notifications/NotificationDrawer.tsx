"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  userId: string;
}) {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);

  const handleClick = (id: string) => markAsRead(id);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-96">
        <SheetHeader className="border-b p-4">
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col divide-y max-h-[calc(100vh-80px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-muted-foreground">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n.id)}
                className={`w-full p-4 text-left hover:bg-muted transition ${
                  !n.read ? "bg-slate-100 dark:bg-slate-800" : ""
                }`}
              >
                <h4 className="font-semibold">{n.title}</h4>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                {!n.read && (
                  <span className="text-xs mt-2 inline-block bg-blue-600 text-white px-2 py-1 rounded">
                    New
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
