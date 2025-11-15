import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell, X } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  useNotificationStore,
  useNotificationStream,
} from "@/store/useNotificationStore";
import { useRecentAlerts } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NavNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useNotificationStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;

  useRecentAlerts();
  useNotificationStream();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10">
          <Bell className="h-4 w-4" />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold",
              unread === 0 && "hidden"
            )}
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end">
        <div className="p-2 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Bell className="h-3.5 w-3.5 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">
                Notifications
              </h4>
              {unread > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
                >
                  {unread} new
                </Badge>
              )}
            </div>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs hover:bg-accent/80 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  toast("Dummy don't click me");
                }}
              >
                <X className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="h-[400px]">njnj</ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavNotification;
