"use client";

import { useEffect, useState } from "react";
import { useInfiniteLogs } from "@/hooks/useLog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { HeaderSection } from "../ui/header-section";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { DateTime } from "luxon";
import { Filter } from "lucide-react";
import { useInView } from "react-intersection-observer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const getActionColor = (action: string) => {
  const colors: Record<string, string> = {
    create: "bg-green-100 text-green-800",
    update: "bg-blue-100 text-blue-800",
    delete: "bg-red-100 text-red-800",
    comment: "bg-purple-100 text-purple-800",
    assign: "bg-yellow-100 text-yellow-800",
    status_change: "bg-indigo-100 text-indigo-800",
    priority_change: "bg-pink-100 text-pink-800",
    login: "bg-teal-100 text-teal-800",
    logout: "bg-orange-100 text-orange-800",
  };
  return colors[action] || "bg-gray-100 text-gray-800";
};

export default function LogsMain() {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteLogs({
      action: selectedActions.join(","),
      entityType: selectedEntities.join(","),
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredLogs = data?.pages.flat() || [];

  const actions = [
    "create",
    "update",
    "delete",
    "comment",
    "assign",
    "status_change",
    "priority_change",
    "login",
    "logout",
    "other",
  ];

  const entityTypes = ["task", "project", "team", "user", "comment"];

  const handleActionChange = (value: string) => {
    setSelectedActions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleEntityChange = (value: string) => {
    setSelectedEntities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <HeaderSection title="Logs" subtitle="Manage your App's logs." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>View all recorded user actions</CardDescription>
            </div>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={`${
                      selectedActions.length > 0 || selectedEntities.length > 0
                        ? "default"
                        : "outline"
                    }`}
                    size="sm"
                    className="relative"
                  >
                    {selectedActions.length + selectedEntities.length > 0 && (
                      <Badge className="absolute -top-[10px] -right-2 h-4 w-4 bg-destructive text-white flex items-center justify-center">
                        {selectedActions.length + selectedEntities.length}
                      </Badge>
                    )}
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-auto p-2" align="end">
                  <DropdownMenuLabel className="flex justify-between">
                    Filters{" "}
                    {selectedActions.length + selectedEntities.length > 0 && (
                      <span
                        className="cursor-pointer text-destructive hover:text-destructive/80"
                        onClick={() => {
                          setSelectedActions([]);
                          setSelectedEntities([]);
                        }}
                      >
                        (clear)
                      </span>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <div className="flex gap-2">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <div className="flex flex-col gap-1 mt-1">
                        {actions.map((a) => (
                          <DropdownMenuCheckboxItem
                            key={a}
                            checked={selectedActions.includes(a)}
                            onCheckedChange={() => handleActionChange(a)}
                            className="capitalize"
                          >
                            {a.replace("_", " ")}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </div>
                    </DropdownMenuGroup>
                    <div className="w-px bg-border" />

                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Entity Type</DropdownMenuLabel>
                      <div className="flex flex-col gap-1 mt-1">
                        {entityTypes.map((t) => (
                          <DropdownMenuCheckboxItem
                            key={t}
                            checked={selectedEntities.includes(t)}
                            onCheckedChange={() => handleEntityChange(t)}
                            className="capitalize"
                          >
                            {t}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </div>
                    </DropdownMenuGroup>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col"></div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                        </TableRow>
                      ))
                    : filteredLogs.map((activity) => (
                        <TableRow key={activity._id}>
                          <TableCell className="font-medium">
                            {activity.user?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            <Badge className={getActionColor(activity.action)}>
                              {activity.action}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {activity.entityType}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {activity.message}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {DateTime.fromISO(
                              activity.createdAt
                            ).toLocaleString(DateTime.DATETIME_MED)}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center" ref={ref}>
              <span className="p-4 text-center text-muted-foreground text-xs">
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                  ? "Scroll to load more"
                  : "No more logs"}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
