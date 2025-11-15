import React, { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";

const NavNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10">
          <Bell className="h-4 w-4" />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold"
          >
            0{/* {unreadCount > 9 ? "9+" : unreadCount} */}
          </motion.span>
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
};

export default NavNotification;
