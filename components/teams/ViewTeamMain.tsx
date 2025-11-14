/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useViewTeam } from "@/hooks/useTeam";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  MessageSquare,
  Tag,
  User,
  Users,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import TeamProjectItem from "./TeamProjectItem";
import MemberItem from "./MemberItem";
import EditTeam from "./EditTeam";
import DeleteTeam from "./DeleteTeam";

const ViewTeamMain = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useViewTeam(params.id);

  if (isLoading) {
    return <div>Loading Team Data...</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b pb-8 px-4 sm:px-6 pt-4"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4 sm:gap-6">
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

          <div className="flex items-center gap-2 self-start md:self-auto">
            <EditTeam defaultValues={data} />
          </div>
        </div>
      </motion.div>

      <div className="px-4 sm:px-6 -mt-8 mb-2">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Members", value: data.members.length, icon: Users },
            {
              label: "Active Staff",
              value: data.members.filter((m: any) => m.isActive === true)
                .length,
              icon: CheckCircle,
            },
            {
              label: "Total Projects",
              value: data.projects.length,
              icon: Briefcase,
            },
            {
              label: "Current Workload",
              value: data.projects.filter((p: any) => p.status === "active")
                .length,
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

      <div className="pb-12 px-4 sm:px-6">
        <Tabs defaultValue="overview" className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TabsList className="flex overflow-x-auto whitespace-nowrap p-1 mb-4 h-10 border rounded-lg bg-muted/50 scrollbar-hide">
              <TabsTrigger value="overview" className="min-w-fit px-4 text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="projects" className="min-w-fit px-4 text-sm">
                Projects ({data.projects.length})
              </TabsTrigger>
              <TabsTrigger value="members" className="min-w-fit px-4 text-sm">
                Members ({data.members.length})
              </TabsTrigger>
              <TabsTrigger value="activity" className="min-w-fit px-4 text-sm">
                Activity
              </TabsTrigger>
              <TabsTrigger value="settings" className="min-w-fit px-4 text-sm">
                Settings
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
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />{" "}
                    Team Narrative
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {data.description || "No detailed description available."}
                  </p>
                </CardContent>
              </Card>

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
                  <CardContent className="text-sm space-y-3">
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
          </TabsContent>

          <TabsContent value="projects">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {data.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects.map((project: any, index: number) => (
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
          </TabsContent>

          <TabsContent value="members">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {data.members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.members.map((member: any, index: number) => (
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
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Team Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                Recent team activity and audit trails will be displayed here...
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <DeleteTeam data={data} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewTeamMain;
