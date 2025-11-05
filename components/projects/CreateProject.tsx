import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema, TCreateProjectSchema } from "@/schemas/project";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { useCreateProject } from "@/hooks/useProjects";
import AddProjectTeams from "./AddProjectTeams";

const CreateProject = () => {
  const addProject = useCreateProject();
  const [open, setOpen] = useState(false);

  const form = useForm<TCreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      teams: [],
    },
  });

  const onSubmit = (data: TCreateProjectSchema) => {
    addProject.mutate(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        toast.success("Project created successfully");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all">
        <Plus className="mr-2 h-4 w-4" />
        Create project
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Add a new project to your workspace
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter project description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AddProjectTeams form={form} />

            <Button type="submit" className="w-full">
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;
