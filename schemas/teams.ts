import z from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(2, "Team name is required"),
  description: z.string().optional(),
  members: z.array(z.string()).optional(),
});

export type TCreateTeamSchema = z.infer<typeof createTeamSchema>;
