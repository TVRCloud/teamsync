"use client";

import { getMenuList } from "@/lib/menu-list";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const MobileDock = () => {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  const flatMenus = menuList.flatMap((group) => group.menus);
  const maxVisible = 4;
  const visibleMenus = flatMenus.slice(0, maxVisible);
  const extraMenus = flatMenus.slice(maxVisible);

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md lg:hidden">
      <div
        ref={containerRef}
        className="bg-background border border-border shadow-xl rounded-full px-4 py-3 flex items-center justify-evenly relative"
      >
        {visibleMenus.slice(0, 2).map((menu, index) => {
          const isActive = pathname === menu.href;
          return (
            <Link
              href={menu.href}
              key={index}
              className="flex flex-col items-center justify-center group px-2"
            >
              {menu.icon && (
                <menu.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "stroke-primary" : "stroke-muted-foreground"
                  )}
                />
              )}
              <span
                className={cn(
                  "text-[10px] mt-1 truncate transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {menu.label}
              </span>
            </Link>
          );
        })}

        {/* Center FAB */}
        {extraMenus.length > 0 && (
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-background shadow-md z-10"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}

        {visibleMenus.slice(2).map((menu, index) => {
          const isActive = pathname === menu.href;
          return (
            <Link
              href={menu.href}
              key={index}
              className="flex flex-col items-center justify-center group px-2"
            >
              {menu.icon && (
                <menu.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "stroke-primary" : "stroke-muted-foreground"
                  )}
                />
              )}
              <span
                className={cn(
                  "text-[10px] mt-1 truncate transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {menu.label}
              </span>
            </Link>
          );
        })}

        {/* Radial extra menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-64 h-32"
            >
              {extraMenus.map((menu, index) => {
                const isActive = pathname === menu.href;
                const count = extraMenus.length;
                const angleStep = Math.PI / (count + 1); // spread across 180°
                const angle = angleStep * (index + 1); // skip 0 to avoid flat center
                const radius = 80;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, x, y: -y }} // invert y for upward arc
                    exit={{ opacity: 0, x: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <Link
                      href={menu.href}
                      className="flex flex-col items-center justify-center bg-background border border-border rounded-full w-12 h-12 shadow"
                    >
                      {menu.icon && (
                        <menu.icon
                          className={cn(
                            "w-5 h-5",
                            isActive
                              ? "stroke-primary"
                              : "stroke-muted-foreground"
                          )}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MobileDock;
