"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  CheckCircle,
  Edit2,
  Users,
  User,
  Loader2,
  Calendar,
  Link,
  Tag,
  MessageSquare,
  ChevronsUp,
  Clock,
  MoreVertical,
  Settings,
  Trash2,
  Code,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as tabs from "@/components/ui/tabs";

interface TeamMember {
  _id: string;
  name: string;
  avatar?: string;
  role: string;
  isActive: boolean;
}

interface TeamProject {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "completed" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
}

interface TeamData {
  _id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projects: TeamProject[];
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const dummyTeamData: TeamData = {
  _id: "team_1234567890",
  name: "Frontend Avengers",
  description:
    "Responsible for all client-side logic and UI/UX implementation, focusing on user experience and component architecture. This team is central to the product's visual identity.",
  createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: { _id: "user_creator", name: "Alice Johnson" },
  members: [
    {
      _id: "user_a",
      name: "Bob Builder",
      role: "lead",
      isActive: true,
      avatar: "https://i.pravatar.cc/150?img=68",
    },
    {
      _id: "user_b",
      name: "Charlie Code",
      role: "member",
      isActive: true,
      avatar: "https://i.pravatar.cc/150?img=69",
    },
    {
      _id: "user_c",
      name: "Eve Eavesdrop",
      role: "member",
      isActive: false,
      avatar: "https://i.pravatar.cc/150?img=70",
    },
  ],
  projects: [
    {
      _id: "proj_a1",
      name: "Dashboard Redesign",
      description: "Complete overhaul of the main user dashboard interface.",
      status: "active",
      priority: "urgent",
    },
    {
      _id: "proj_b2",
      name: "Mobile App Beta",
      description: "Developing the first version of the mobile application.",
      status: "active",
      priority: "high",
    },
    {
      _id: "proj_c3",
      name: "Legacy System Migration",
      description: "Moving old API endpoints to the new server infrastructure.",
      status: "completed",
      priority: "medium",
    },
  ],
};

const useViewTeam = (id: string) => {
  // Simulating loading state for initial render smoothness
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simulate a short load time
    return () => clearTimeout(timer);
  }, [id]);

  return { data: dummyTeamData, isLoading };
};

// --- CUSTOM COMPONENTS (Unchanged - they are fine) ---
const getPriorityBadge = (priority: TeamProject["priority"]) => {
  switch (priority) {
    case "urgent":
      return (
        <Badge variant="destructive" className="capitalize">
          <ChevronsUp className="w-3 h-3 mr-1" />
          {priority}
        </Badge>
      );
    case "high":
      return (
        <Badge
          variant="secondary"
          className="bg-orange-500 text-white capitalize"
        >
          {priority}
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="secondary" className="capitalize">
          {priority}
        </Badge>
      );
    case "low":
      return (
        <Badge variant="outline" className="capitalize">
          {priority}
        </Badge>
      );
    default:
      return null;
  }
};

const getStatusBadge = (status: TeamProject["status"]) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white capitalize">
          {status}
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="secondary" className="capitalize">
          {status}
        </Badge>
      );
    case "archived":
      return (
        <Badge variant="outline" className="capitalize">
          {status}
        </Badge>
      );
    default:
      return null;
  }
};

const TeamProjectItem = ({
  project,
  index,
}: {
  project: TeamProject;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 * index }}
    className="border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-bold flex items-center gap-2 text-foreground">
        <Briefcase className="w-4 h-4 text-primary" />
        {project.name}
      </h4>
      <div className="flex gap-2">
        {getPriorityBadge(project.priority)}
        {getStatusBadge(project.status)}
      </div>
    </div>
    <p className="text-sm text-muted-foreground mt-2">
      {project.description || "No description available."}
    </p>
    <Button variant="link" size="sm" className="p-0 mt-3 h-auto text-xs">
      View Project <Link className="w-3 h-3 ml-1" />
    </Button>
  </motion.div>
);

const MemberItem = ({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * index }}
    className="flex items-center space-x-4 p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
  >
    <Avatar className="w-10 h-10">
      <AvatarImage src={member.avatar || ""} />
      <AvatarFallback className="text-xs font-semibold">
        {member.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="font-semibold truncate">{member.name}</p>
      <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
    </div>
    <Badge
      variant={member.isActive ? "default" : "secondary"}
      className="text-xs w-16 justify-center"
    >
      {member.isActive ? "Active" : "Inactive"}
    </Badge>
    <Button variant="ghost" size="icon" className="w-8 h-8">
      <MoreVertical className="w-4 h-4" />
    </Button>
  </motion.div>
);

// --- MAIN COMPONENT ---

const ViewTeamMain = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useViewTeam(params.id || "dummy_id");

  if (isLoading)
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" /> Loading Team
        Data...
      </div>
    );

  if (!data)
    return (
      <div className="p-8 text-center text-destructive">Team not found.</div>
    );

  const activeProjectsCount = data.projects.filter(
    (p) => p.status === "active"
  ).length;
  const activeMembersCount = data.members.filter((m) => m.isActive).length;

  return (
    <div className="flex flex-col gap-3">
      {/* --- UNIQUE HEADER SECTION: Emphasizing Group Identity --- */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b pb-8 px-4 sm:px-6 pt-4" // Added pt-4 for spacing
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Team Logo/Icon Block (More distinctive than an Avatar) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-linear-to-br from-primary to-blue-500/80 border-4 border-background shadow-xl flex items-center justify-center">
                <Code className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-1">
                {data.name}
              </h1>
              <p className="text-base text-primary mb-3 font-medium flex items-center gap-1">
                <Users className="w-4 h-4" /> {data.members.length} Members
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <User className="w-3 h-3" /> Lead: {data.createdBy.name}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  ID: {data._id.slice(-8)}
                </Badge>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons (Consistent structure but customized look) */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button size="sm" className="sm:h-10">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Details
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
                <DropdownMenuLabel>Team Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Team Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Archive Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      {/* --- STATS CARDS: Focusing on Team Health --- */}
      <div className="px-4 sm:px-6 -mt-8 mb-2">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Members", value: data.members.length, icon: Users },
            {
              label: "Active Staff",
              value: activeMembersCount,
              icon: CheckCircle,
            },
            {
              label: "Total Projects",
              value: data.projects.length,
              icon: Briefcase,
            },
            {
              label: "Current Workload",
              value: activeProjectsCount,
              icon: Clock,
            },
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
                      {stat.value ?? "-"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {stat.label ?? "-"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- TABS SECTION --- */}
      <div className="pb-12 px-4 sm:px-6">
        <tabs.Tabs defaultValue="overview" className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Horizontal Scrolling Tabs (The fixed version) */}
            <tabs.TabsList className="flex overflow-x-auto whitespace-nowrap p-1 mb-4 h-10 border rounded-lg bg-muted/50 scrollbar-hide">
              <tabs.TabsTrigger
                value="overview"
                className="min-w-fit px-4 text-sm"
              >
                Overview
              </tabs.TabsTrigger>
              <tabs.TabsTrigger
                value="projects"
                className="min-w-fit px-4 text-sm"
              >
                Projects ({data.projects.length})
              </tabs.TabsTrigger>
              <tabs.TabsTrigger
                value="members"
                className="min-w-fit px-4 text-sm"
              >
                Members ({data.members.length})
              </tabs.TabsTrigger>
              <tabs.TabsTrigger
                value="activity"
                className="min-w-fit px-4 text-sm"
              >
                Activity
              </tabs.TabsTrigger>
            </tabs.TabsList>
          </motion.div>

          <tabs.TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Team Narrative/Description Card (Large Focus) */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />{" "}
                    Team Narrative
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {data.description ||
                      "No detailed description available. This team is focused on delivering high-quality, scalable solutions for its assigned projects."}
                  </p>
                </CardContent>
              </Card>

              {/* Team Details Card (Unchanged, as this is essential metadata) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                    <CardDescription>
                      Administrative details and history.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3 pt-6">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-muted-foreground flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Team ID:
                      </p>
                      <p className="font-mono text-xs">{data._id.slice(-8)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" /> Created By:
                      </p>
                      <p>{data.createdBy.name}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Created On:
                      </p>
                      <p>{new Date(data.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Last Updated:
                      </p>
                      <p>{new Date(data.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </tabs.TabsContent>

          {/* Projects Tab: Displaying Project Cards */}
          <tabs.TabsContent value="projects">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {data.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects.map((project: TeamProject, index: number) => (
                    <TeamProjectItem
                      key={project._id}
                      project={project}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground p-4 border rounded-md">
                  This team is not currently assigned to any projects.
                </p>
              )}
            </motion.div>
          </tabs.TabsContent>

          {/* Members Tab: Displaying Member Cards */}
          <tabs.TabsContent value="members">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {data.members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {" "}
                  {/* Increased grid columns on desktop */}
                  {data.members.map((member: TeamMember, index: number) => (
                    <MemberItem
                      key={member._id}
                      member={member}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground p-4 border rounded-md">
                  This team currently has no members.
                </p>
              )}
            </motion.div>
          </tabs.TabsContent>

          <tabs.TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Team Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                Recent team activity and audit trails will be displayed here...
              </CardContent>
            </Card>
          </tabs.TabsContent>
        </tabs.Tabs>
      </div>
    </div>
  );
};

export default ViewTeamMain;
