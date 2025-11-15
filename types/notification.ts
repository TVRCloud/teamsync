import { z } from "zod";

export const CreateNotificationSchema = z.object({
  type: z.enum(["BROADCAST", "ROLE_BASED", "DIRECT", "SYSTEM", "TASK"]),
  title: z.string().min(3),
  body: z.string().min(3),
  audienceType: z.enum(["ALL", "ROLE", "USER"]),
  roles: z.array(z.string()).optional(),
  users: z.array(z.string()).optional(),
  meta: z.any().optional(),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
