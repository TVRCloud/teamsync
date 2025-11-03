import z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  team: z.string().optional(),
  members: z.array(z.string()).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  color: z.string().min(1, "Color is required"),
});

export type TCreateProjectSchema = z.infer<typeof createProjectSchema>;
