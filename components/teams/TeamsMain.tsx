"use client";
import { Link, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { HeaderSection } from "../ui/header-section";
import AddTeam from "./AddTeam";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteTeams } from "@/hooks/useTeam";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const TeamsMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { ref, inView } = useInView();
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteTeams(searchTerm);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredTeams = data?.pages.flat() || [];

  return (
    <div className="flex flex-col gap-3">
      <HeaderSection
        title="Teams"
        subtitle="Manage your teams and their members."
        actions={<AddTeam />}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Teams Directory</CardTitle>
              <CardDescription>
                View all your teams and their members.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search Teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {isLoading
                        ? [...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                              {Array(5)
                                .fill(0)
                                .map((_, j) => (
                                  <TableCell key={j}>
                                    <Skeleton className="h-4 w-[100px]" />
                                  </TableCell>
                                ))}
                            </TableRow>
                          ))
                        : filteredTeams.map((team) => (
                            <TableRow key={team._id}>
                              <TableCell className="font-medium">
                                {team.name || "-"}
                              </TableCell>
                              <TableCell className="truncate max-w-[250px]">
                                {team.description || "-"}
                              </TableCell>
                              <TableCell>
                                {team.members?.length ?? 0}{" "}
                                {team.members?.length === 1
                                  ? "member"
                                  : "members"}
                              </TableCell>
                              <TableCell>
                                {team.createdBy?.name || "Unknown"}
                              </TableCell>

                              <TableCell className="max-w-[70px]">
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() => {
                                    router.push(`/teams/${team._id}`);
                                  }}
                                >
                                  View Team
                                  <Link className="w-3 h-3 ml-1" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-center" ref={ref}>
                <span className="p-4 text-center text-muted-foreground text-xs">
                  {isFetchingNextPage
                    ? "Loading more..."
                    : hasNextPage
                    ? "Scroll to load more"
                    : "No more teams"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TeamsMain;
