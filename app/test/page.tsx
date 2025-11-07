/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Download,
  Search,
  User,
  FileText,
  Database,
  Shield,
  Settings,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  Briefcase,
  ListTodo,
  Package,
  Bell,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Mock system logs data ---
const systemLogs = [
  {
    _id: "690c46964ff6e77ed5990b31",
    user: { name: "Amegh T S", email: "amegh2002@gmail.com" },
    action: "create",
    entityType: "user",
    message: "Created user amegh2002@gmail.com",
    createdAt: "2025-11-06T06:56:22.075Z",
  },
  {
    _id: "690c7b02d514d0141bcb5da0",
    user: { name: "Admin User", email: "admin@company.com" },
    action: "create",
    entityType: "user",
    message: "Created user jithin@gmail.com",
    createdAt: "2025-11-06T10:40:02.440Z",
  },
  {
    _id: "690c7b03d514d0141bcb5da1",
    user: { name: "Admin User", email: "admin@company.com" },
    action: "update",
    entityType: "project",
    message: "Updated project status to completed",
    createdAt: "2025-11-06T12:15:30.123Z",
  },
  {
    _id: "690c7b04d514d0141bcb5da3",
    user: { name: "Amegh T S", email: "amegh2002@gmail.com" },
    action: "delete",
    entityType: "task",
    message: "Deleted task: Fix login bug",
    createdAt: "2025-11-06T13:22:45.678Z",
  },
  {
    _id: "690c7b08d514d0141bcb5dab",
    user: { name: "Jithin Kumar", email: "jithin@gmail.com" },
    action: "login",
    entityType: "user",
    message: "User logged in successfully",
    createdAt: "2025-11-07T08:15:22.456Z",
  },
];

// --- Component ---
export default function SystemLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");

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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const min = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (min < 1) return "Just now";
    if (min < 60) return `${min} min ago`;
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredLogs = systemLogs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      log.message.toLowerCase().includes(q) ||
      log.user.email.toLowerCase().includes(q) ||
      log.user.name.toLowerCase().includes(q);
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    const matchEntity =
      entityFilter === "all" || log.entityType === entityFilter;
    return matchSearch && matchAction && matchEntity;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-linear-to-r from-background via-primary/5 to-background">
        <div className="max-w-[1800px] mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-linear-to-br from-primary/20 to-secondary/20">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">System Activity Logs</h1>
              <p className="text-muted-foreground">
                Complete audit trail of all system activities
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Settings className="w-4 h-4 mr-2" /> Configure
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Log Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Shield className="w-4 h-4 mr-2" /> Access Control
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="w-4 h-4 mr-2" /> Alert Rules
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash2 className="w-4 h-4 mr-2" /> Clear Old Logs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-8 space-y-8">
        {/* Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and narrow down logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search logs..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Action</Label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                    <SelectItem value="logout">Logout</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Entity</Label>
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>
                Showing {filteredLogs.length} of {systemLogs.length}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {filteredLogs.length === 0 ? (
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
                <div className="space-y-4">
                  {filteredLogs.map((log, i) => {
                    const ActionIcon = getActionIcon(log.action);
                    const EntityIcon = getEntityIcon(log.entityType); // Used for the badge
                    return (
                      <motion.div
                        key={log._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {/* Action Icon */}
                        <div className="p-2 rounded-full bg-primary/10">
                          <ActionIcon className="w-4 h-4 text-primary" />
                        </div>
                        {/* Message and Details */}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <User className="w-3 h-3 inline mr-1" />
                            {log.user.name} ({log.user.email}) •{" "}
                            {formatDate(log.createdAt)}
                          </p>
                        </div>

                        {/* Entity Type Badge (New) */}
                        <Badge
                          variant="secondary"
                          className="text-xs capitalize shrink-0"
                        >
                          <EntityIcon className="w-3 h-3 mr-1" />
                          {log.entityType}
                        </Badge>

                        {/* Action Badge (Original) */}
                        <Badge
                          variant="outline"
                          className="text-xs capitalize shrink-0"
                        >
                          {log.action}
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
