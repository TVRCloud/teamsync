import z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "manager", "member", "guest"]),
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;
