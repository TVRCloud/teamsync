"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X, ArrowRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useDeleteTeam } from "@/hooks/useTeam";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  data: {
    _id: string;
    name: string;
  };
};

const DeleteTeam = ({ data }: Props) => {
  const router = useRouter();
  const deleteTeam = useDeleteTeam(data._id);
  const [isDangerVisible, setIsDangerVisible] = useState(false);

  const handleDelete = () => {
    deleteTeam.mutate(undefined, {
      onSuccess: () => {
        toast.success(`Team ${data.name} deleted successfully`);
        router.replace("/teams");
      },

      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <AlertTriangle className="w-6 h-6 text-primary" />
            Dangerous Settings
          </CardTitle>
          <CardDescription>
            These settings are potentially dangerous and should be used with
            caution.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {!isDangerVisible ? (
              <motion.div
                key="danger-prompt"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Button
                  onClick={() => setIsDangerVisible(true)}
                  variant="outline"
                  className="group"
                >
                  Proceed
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="danger-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <AlertDialog>
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-destructive">
                      <Trash2 className="w-5 h-5" />
                      Delete Team
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      Once you delete this team, there is no going back. Please
                      be certain.
                    </p>

                    <div className="mt-3 text-sm">
                      <p>
                        <span className="font-semibold">Team Name:</span>{" "}
                        {data.name}
                      </p>
                      <p>
                        <span className="font-semibold">Team ID:</span>{" "}
                        {data._id}
                      </p>
                    </div>

                    <div className="flex mt-4 gap-3">
                      <Button
                        variant="destructive"
                        onClick={() => setIsDangerVisible(false)}
                        type="button"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>

                      <AlertDialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete Team
                        </Button>
                      </AlertDialogTrigger>
                    </div>
                  </div>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        Confirm Deletion
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Type the team name <strong>{data.name}</strong> to
                        confirm deletion.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        type="button"
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                      >
                        Yes, Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteTeam;
