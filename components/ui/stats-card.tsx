"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type LucideIcon,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
  index?: number;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  isLoading,
  index = 0,
}: StatsCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ delay: 0.1 + index * 0.05 }}
    >
      <Card className="p-3 md:p-4 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 sm:pb-1 md:pb-2">
          <CardTitle className="text-sm md:text-base font-medium truncate w-[calc(100%-1.5rem)]">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
        </CardHeader>
        <CardContent className="h-full">
          <div className="text-lg md:text-2xl font-bold h-9 flex items-center">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              value
            )}
          </div>

          {!isLoading && description && (
            <div className="flex items-center text-[10px] md:text-xs text-muted-foreground mt-1 truncate">
              {trend && (
                <TrendIcon
                  className={cn(
                    "mr-1 h-3 w-3 shrink-0",
                    trend === "up" && "text-green-600",
                    trend === "down" && "text-red-600",
                    trend === "neutral" && "text-gray-600"
                  )}
                />
              )}
              <span className="truncate">{description}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
