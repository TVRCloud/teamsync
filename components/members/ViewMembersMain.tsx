"use client";

import { useViewUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Briefcase,
  CheckCircle,
  CheckSquare,
  Edit2,
  ListTodo,
  MoreVertical,
  Save,
  Settings,
  Trash2,
  Users,
  X,
  Mail,
  User,
  Loader2,
  Calendar,
  Link,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";

const UpdateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  role: z.string().min(1, "Role is required."),
});

type UpdateUserFormValues = z.infer<typeof UpdateUserSchema>;

const updateUserAction = async (values: UpdateUserFormValues) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (values.name.toLowerCase().includes("fail")) {
        resolve({
          success: false,
          message: "User update failed due to input.",
        });
      } else {
        console.log("--- User Update Form Submission ---");
        console.log("Submitted Values:", values);
        console.log("-----------------------------------");
        resolve({
          success: true,
          message: "User profile updated successfully!",
        });
      }
    }, 1500);
  });
};

interface Team {
  _id: string;
  name: string;
  description: string;
}

const TeamItem = ({ team, index }: { team: Team; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 * index }}
    className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-card"
  >
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-semibold flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        {team.name}
      </h4>
      <Badge variant="secondary" className="text-xs">
        Team ID: {team._id.slice(-4)}
      </Badge>
    </div>
    <p className="text-sm text-muted-foreground mt-1">
      {team.description || "No description provided."}
    </p>
    <Button variant="link" size="sm" className="p-0 mt-2 h-auto text-xs">
      View Team <Link className="w-3 h-3 ml-1" />
    </Button>
  </motion.div>
);

interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: { name: string };
  teams: { name: string }[];
}

const ProjectItem = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * index }}
    className="border rounded-lg p-4 bg-card shadow-sm"
  >
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-bold flex items-center gap-2 text-foreground">
        <Briefcase className="w-4 h-4 text-primary" />
        {project.name}
      </h4>
      <Badge variant="outline" className="text-xs">
        ID: {project._id.slice(-4)}
      </Badge>
    </div>
    <p className="text-sm text-muted-foreground mt-2">
      {project.description || "No description available."}
    </p>
    <div className="flex flex-wrap gap-2 mt-3 text-xs">
      <Badge variant="secondary">Creator: {project.createdBy.name}</Badge>
      <Badge variant="outline">
        Teams: {project.teams.map((t) => t.name).join(", ")}
      </Badge>
    </div>
    <Button variant="link" size="sm" className="p-0 mt-2 h-auto text-xs">
      View Project <Link className="w-3 h-3 ml-1" />
    </Button>
  </motion.div>
);

const ViewMembersMain = () => {
  const params = useParams<{ id: string }>();
  // NOTE: Assuming useViewUser returns all necessary user properties including nested arrays (teams, projects)
  const { data, isLoading } = useViewUser(params.id);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      role: data?.role || "",
    },
    values: {
      name: data?.name || "",
      email: data?.email || "",
      role: data?.role || "",
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    form.reset({
      name: data.name,
      email: data.email,
      role: data.role,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset({
      name: data.name,
      email: data.email,
      role: data.role,
    });
  };

  const onSubmit = async (values: UpdateUserFormValues) => {
    setLoading(true);

    try {
      const res = (await updateUserAction(values)) as {
        success: boolean;
        message: string;
      };

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred during update.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>User not found.</div>;

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b pb-8 px-4 sm:px-6" // Added mobile padding
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-background shadow-lg">
                {" "}
                {/* Reduced size for mobile */}
                <AvatarImage src={data.avatar || ""} />
                <AvatarFallback className="text-xl sm:text-2xl font-bold bg-linear-to-br from-primary to-secondary text-primary-foreground">
                  {data.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {data.isActive && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full border-4 border-background flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1 sm:mb-2">
                {" "}
                {/* Responsive font size */}
                {data.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-3">
                {data.email}
              </p>{" "}
              {/* Responsive font size */}
              <div className="flex items-center gap-2">
                <Badge variant="default" className="capitalize">
                  {data.role}
                </Badge>
                <Badge variant={data.isActive ? "default" : "destructive"}>
                  {data.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {" "}
            {/* Ensures buttons are easy to tap on mobile */}
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex gap-2"
                >
                  <Button onClick={handleEdit} size="sm" className="sm:h-10">
                    {" "}
                    {/* Smaller button for mobile */}
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 sm:w-10 sm:h-10"
                      >
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
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    size="sm"
                    className="sm:h-10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    form="update-user-form"
                    type="submit"
                    disabled={loading}
                    size="sm"
                    className="sm:h-10"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className="px-4 sm:px-6 -mt-8 mb-2">
        {" "}
        {/* Adjusted padding */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {" "}
          {/* Changed to grid-cols-2 on mobile */}
          {[
            { label: "Teams", value: data.teams.length, icon: Users },
            { label: "Projects", value: data.projects.length, icon: Briefcase },
            { label: "Total Tasks", value: 0, icon: ListTodo },
            { label: "Completed", value: 0, icon: CheckSquare },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-2xl sm:text-3xl font-bold">
                      {" "}
                      {/* Slightly smaller text for mobile */}
                      {stat.value ?? "-"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {" "}
                    {/* Smaller label text */}
                    {stat.label ?? "-"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pb-12 px-4 sm:px-6">
        {" "}
        {/* Added padding to container */}
        <Tabs defaultValue="overview" className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Make tabs scrollable on mobile */}
            <TabsList className="flex flex-wrap justify-start gap-1 p-1 mb-4 h-auto border rounded-lg bg-muted/50">
              <TabsTrigger
                value="overview"
                className="flex-1 min-w-[100px] text-sm md:flex-auto"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex-1 min-w-[100px] text-sm md:flex-auto"
              >
                Projects ({data.projects.length})
              </TabsTrigger>
              <TabsTrigger
                value="teams"
                className="flex-1 min-w-[100px] text-sm md:flex-auto"
              >
                Teams ({data.teams.length})
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="flex-1 min-w-[100px] text-sm md:flex-auto"
              >
                Tasks
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="flex-1 min-w-[100px] text-sm md:flex-auto"
              >
                Activity
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    {isEditing
                      ? "Edit user profile details"
                      : "View user profile details"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Form {...form}>
                    <form
                      id="update-user-form"
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6" // Already responsive (stacks on mobile)
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative"
                              >
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder="User Name"
                                  className="pl-10"
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="relative"
                              >
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  type="email"
                                  disabled={!isEditing}
                                  placeholder="user@email.com"
                                  className="pl-10"
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="relative"
                              >
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                  #
                                </span>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder="user role"
                                  className="pl-10 capitalize"
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <button type="submit" className="hidden" />
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>
                      Important dates and status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3 pt-6">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-muted-foreground">
                        User ID:
                      </p>
                      <p className="font-mono text-xs">{data._id.slice(-8)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Created:
                      </p>
                      <p>{new Date(data.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Updated:
                      </p>
                      <p>{new Date(data.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="projects">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                {data.projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.projects.map((project: Project, index: number) => (
                      <ProjectItem
                        key={project._id}
                        project={project}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground p-4 border rounded-md">
                    This user is not currently assigned to any projects.
                  </p>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="teams">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {data.teams.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {" "}
                    {/* Added sm:grid-cols-2 for tablet/small screens */}
                    {data.teams.map((team: Team, index: number) => (
                      <TeamItem key={team._id} team={team} index={index} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground p-4 border rounded-md">
                  This user is not currently assigned to any teams.
                </p>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Tasks Overview</CardTitle>
              </CardHeader>
              <CardContent>
                Task listing and statistics will be displayed here...
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                Recent user activity and audit trails will be displayed here...
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewMembersMain;
