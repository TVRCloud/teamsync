/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "../ui/badge";
import {
  Activity,
  AlertCircle,
  User,
  FileText,
  Database,
  Trash2,
  Edit,
  Plus,
  CheckCircle,
  XCircle,
  Users,
  Briefcase,
  ListTodo,
  Package,
  RefreshCw,
  Loader2,
} from "lucide-react";
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
import { DateTime } from "luxon";

const getActionIcon = (action: string) => {
  const icons: Record<string, any> = {
    create: Plus,
    update: Edit,
    delete: Trash2,
    comment: FileText,
    assign: Users,
    status_change: RefreshCw,
    login: CheckCircle,
    logout: XCircle,
    other: Activity,
  };
  return icons[action] || Activity;
};

const getEntityIcon = (entity: string) => {
  const icons: Record<string, any> = {
    task: ListTodo,
    project: Briefcase,
    team: Users,
    user: User,
    comment: FileText,
    workspace: Package,
  };
  return icons[entity] || Database;
};

export default function LogsMain() {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const { ref, inView } = useInView();

  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteLogs({
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

  return (
    <div className="flex flex-col gap-3">
      <HeaderSection
        title="System Activity Logs"
        subtitle="Complete audit trail of all system activities."
        icon={<Activity />}
        actions={
          <Button onClick={() => refetch()}>
            <RefreshCw
              className={`${isLoading && "animate-spin"} w-4 h-4 mr-2`}
            />
            Refresh
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex justify-between flex-col gap-4 md:flex-row">
            <div>
              <CardTitle>Project Directory</CardTitle>
              <CardDescription>
                Search for a project to get started
              </CardDescription>
            </div>
            <div className="flex gap-4">
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={
                        selectedActions.length > 0 ||
                        selectedEntities.length > 0
                          ? "default"
                          : "outline"
                      }
                      className="relative"
                    >
                      Filter
                      {selectedActions.length + selectedEntities.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-2 -right-2"
                        >
                          {selectedActions.length + selectedEntities.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {actions.map((action) => (
                        <DropdownMenuCheckboxItem
                          key={action}
                          checked={selectedActions.includes(action)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedActions((prev) => [...prev, action]);
                            } else {
                              setSelectedActions((prev) =>
                                prev.filter((a) => a !== action)
                              );
                            }
                          }}
                        >
                          {action}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Entities</DropdownMenuLabel>
                      {entityTypes.map((entity) => (
                        <DropdownMenuCheckboxItem
                          key={entity}
                          checked={selectedEntities.includes(entity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedEntities((prev) => [...prev, entity]);
                            } else {
                              setSelectedEntities((prev) =>
                                prev.filter((e) => e !== entity)
                              );
                            }
                          }}
                        >
                          {entity}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence>
              {
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                    </div>
                  ) : filteredLogs.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium">No logs found</p>
                      <p className="text-sm text-muted-foreground">
                        Try changing your filters or search query
                      </p>
                    </motion.div>
                  ) : (
                    filteredLogs.map((log, i) => {
                      const ActionIcon = getActionIcon(log.action);
                      const EntityIcon = getEntityIcon(log.entityType);
                      return (
                        <motion.div
                          key={log._id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="p-2 rounded-full bg-primary/10">
                            <ActionIcon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{log.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              <User className="w-3 h-3 inline mr-1" />
                              {log.user.name} ({log.user.email}) •{" "}
                              {DateTime.fromISO(log.createdAt).toRelative()}
                            </p>
                          </div>

                          <Badge
                            variant="secondary"
                            className="text-xs capitalize shrink-0"
                          >
                            <EntityIcon className="w-3 h-3 mr-1" />
                            {log.entityType}
                          </Badge>

                          <Badge
                            variant="outline"
                            className="text-xs capitalize shrink-0"
                          >
                            {log.action}
                          </Badge>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              }
            </AnimatePresence>
          </CardContent>

          <div className="flex justify-center" ref={ref}>
            <span className="p-4 text-center text-muted-foreground text-xs">
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Scroll to load more"
                : "No more logs"}
            </span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
