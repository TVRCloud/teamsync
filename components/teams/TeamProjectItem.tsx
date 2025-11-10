import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Briefcase, ChevronsUp, Link } from "lucide-react";
import { Button } from "../ui/button";

interface TeamProject {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "completed" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
}

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

const TeamProjectItem = ({
  project,
  index,
}: {
  project: TeamProject;
  index: number;
}) => {
  return (
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
};

export default TeamProjectItem;
