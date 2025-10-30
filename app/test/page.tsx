/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  Users,
  Briefcase,
  ListTodo,
  Activity,
  Clock,
  TrendingUp,
  CheckSquare,
  MoreVertical,
  Trash2,
  Settings,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dummy user data
const initialUserData = {
  _id: "69022b085eebc48c2fc312ef",
  name: "Amegh T S",
  email: "amegh2002@gmail.com",
  role: "admin",
  avatar: null,
  team: "670a1b2c3d4e5f6g7h8i9j0k",
  isActive: true,
  createdAt: "2025-10-29T14:56:08.658Z",
  updatedAt: "2025-10-29T14:56:08.658Z",
};

const userTeams = [
  { _id: "1", name: "Engineering Team", members: 12, role: "Lead" },
  { _id: "2", name: "Design Squad", members: 8, role: "Member" },
  { _id: "3", name: "Product Team", members: 6, role: "Member" },
];

const userTasks = [
  {
    _id: "1",
    title: "Implement authentication",
    status: "in-progress",
    priority: "high",
    project: "Auth System",
    dueDate: "2025-11-05",
  },
  {
    _id: "2",
    title: "Design dashboard mockups",
    status: "completed",
    priority: "medium",
    project: "Dashboard",
    dueDate: "2025-10-28",
  },
  {
    _id: "3",
    title: "Review pull requests",
    status: "todo",
    priority: "urgent",
    project: "Code Review",
    dueDate: "2025-11-01",
  },
  {
    _id: "4",
    title: "Update documentation",
    status: "review",
    priority: "low",
    project: "Docs",
    dueDate: "2025-11-10",
  },
];

const userProjects = [
  { _id: "1", name: "Auth System", status: "active", tasks: 8, completion: 65 },
  { _id: "2", name: "Dashboard", status: "active", tasks: 12, completion: 80 },
  {
    _id: "3",
    name: "Mobile App",
    status: "completed",
    tasks: 20,
    completion: 100,
  },
];

const recentActivity = [
  {
    action: "update",
    entity: "task",
    message: "Updated task status to in-progress",
    time: "2 hours ago",
  },
  {
    action: "create",
    entity: "comment",
    message: "Added comment on Dashboard redesign",
    time: "5 hours ago",
  },
  {
    action: "assign",
    entity: "task",
    message: "Assigned new task to team member",
    time: "1 day ago",
  },
  {
    action: "status_change",
    entity: "project",
    message: "Changed project status to active",
    time: "2 days ago",
  },
];

const UserDetailsPage = () => {
  const [user, setUser] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(initialUserData);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setEditedUser(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser({
      ...editedUser,
      updatedAt: new Date().toISOString(),
    });
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      todo: "secondary",
      "in-progress": "default",
      review: "outline",
      completed: "default",
      active: "default",
      archived: "secondary",
    };
    return variants[status as keyof typeof variants] || "secondary";
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "secondary",
      medium: "default",
      high: "default",
      urgent: "destructive",
    };
    return variants[priority as keyof typeof variants] || "secondary";
  };

  const stats = {
    teams: userTeams.length,
    projects: userProjects.length,
    tasks: userTasks.length,
    completed: userTasks.filter((t) => t.status === "completed").length,
  };

  const currentData = isEditing ? editedUser : user;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-linear-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </motion.div>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarImage src={currentData.avatar || ""} />
                  <AvatarFallback className="text-2xl font-bold bg-linear-to-br from-primary to-secondary text-primary-foreground">
                    {currentData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {currentData.isActive && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-4 border-background flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {currentData.name}
                </h1>
                <p className="text-muted-foreground mb-3">
                  {currentData.email}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="capitalize">
                    {currentData.role}
                  </Badge>
                  <Badge
                    variant={currentData.isActive ? "default" : "destructive"}
                  >
                    {currentData.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-2"
                  >
                    <Button onClick={handleEdit}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                ) : (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-2"
                  >
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Teams", value: stats.teams, icon: Users },
            { label: "Projects", value: stats.projects, icon: Briefcase },
            { label: "Total Tasks", value: stats.tasks, icon: ListTodo },
            { label: "Completed", value: stats.completed, icon: CheckSquare },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update user profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editedUser.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-sm font-medium pt-2">
                          {currentData.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedUser.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-sm font-medium pt-2">
                          {currentData.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">
                        <Shield className="w-4 h-4 inline mr-2" />
                        Role
                      </Label>
                      {isEditing ? (
                        <Select
                          value={editedUser.role}
                          onValueChange={(value) =>
                            handleInputChange("role", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="guest">Guest</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm font-medium pt-2 capitalize">
                          {currentData.role}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      {isEditing ? (
                        <div className="flex items-center space-x-2 pt-2">
                          <Switch
                            id="status"
                            checked={editedUser.isActive}
                            onCheckedChange={(checked: any) =>
                              handleInputChange("isActive", checked)
                            }
                          />
                          <Label htmlFor="status" className="font-normal">
                            {editedUser.isActive ? "Active" : "Inactive"}
                          </Label>
                        </div>
                      ) : (
                        <p className="text-sm font-medium pt-2">
                          {currentData.isActive ? "Active" : "Inactive"}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Member Since
                      </p>
                      <p className="text-sm font-medium">
                        {formatDate(currentData.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Last Updated
                      </p>
                      <p className="text-sm font-medium">
                        {formatDate(currentData.updatedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Task Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        status: "To Do",
                        count: userTasks.filter((t) => t.status === "todo")
                          .length,
                      },
                      {
                        status: "In Progress",
                        count: userTasks.filter(
                          (t) => t.status === "in-progress"
                        ).length,
                      },
                      {
                        status: "Review",
                        count: userTasks.filter((t) => t.status === "review")
                          .length,
                      },
                      {
                        status: "Completed",
                        count: userTasks.filter((t) => t.status === "completed")
                          .length,
                      },
                    ].map((item) => (
                      <div
                        key={item.status}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-muted-foreground">
                          {item.status}
                        </span>
                        <Badge variant="outline">{item.count}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Productivity</AlertTitle>
                  <AlertDescription>
                    <p className="text-2xl font-bold mt-2">
                      {Math.round((stats.completed / stats.tasks) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Task completion rate
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teams">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userTeams.map((team, idx) => (
                <motion.div
                  key={team._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            <Users className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <Badge>{team.role}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="mb-2">{team.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {team.members} members
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="space-y-3">
              {userTasks.map((task, idx) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {task.title}
                            </h3>
                            <Badge>{task.status.replace("-", " ")}</Badge>
                            <Badge>{task.priority}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {task.project}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProjects.map((project, idx) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{project.name}</CardTitle>
                          <CardDescription>
                            {project.tasks} tasks
                          </CardDescription>
                        </div>
                        <Badge>{project.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-bold">
                            {project.completion}%
                          </span>
                        </div>
                        <Progress value={project.completion} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>
                            <Activity className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{activity.message}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Badge variant="outline" className="capitalize">
                              {activity.action}
                            </Badge>
                            <span className="capitalize">
                              {activity.entity}
                            </span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDetailsPage;
