"use client";

import { motion } from "framer-motion";
import { JSX } from "react";

interface HeaderSectionProps {
  title: string;
  subtitle?: string;
  actions?: JSX.Element;
  icon?: JSX.Element;
}

export function HeaderSection({
  title,
  subtitle,
  actions,
  icon,
}: HeaderSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <div className="flex gap-2">
        <div>
          {icon && (
            <div className="p-3 rounded-xl bg-linear-to-br from-primary/60 to-secondary/60">
              {icon}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </motion.div>
  );
}
