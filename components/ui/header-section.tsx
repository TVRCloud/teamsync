"use client";

import { motion } from "framer-motion";
import { JSX } from "react";

interface HeaderSectionProps {
  title: string;
  subtitle?: string;
  actions?: JSX.Element;
}

export function HeaderSection({
  title,
  subtitle,
  actions,
}: HeaderSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </motion.div>
  );
}
