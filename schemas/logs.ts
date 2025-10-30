import { z } from "zod";

export const logSchema = z.object({
  logs: z.array(
    z.union([
      z.object({
        _id: z.string(),
        user: z.object({
          _id: z.string(),
          name: z.string(),
          email: z.string(),
          role: z.string(),
        }),
        action: z.string(),
        entityType: z.string(),
        entityId: z.string(),
        message: z.string(),
        metadata: z.object({ email: z.string(), role: z.string() }),
        createdAt: z.string(),
        updatedAt: z.string(),
        __v: z.number(),
      }),
      z.object({
        _id: z.string(),
        user: z.null(),
        action: z.string(),
        entityType: z.string(),
        entityId: z.string(),
        message: z.string(),
        metadata: z.object({ email: z.string(), role: z.string() }),
        createdAt: z.string(),
        updatedAt: z.string(),
        __v: z.number(),
      }),
      z.object({
        _id: z.string(),
        user: z.object({
          _id: z.string(),
          name: z.string(),
          email: z.string(),
          role: z.string(),
        }),
        action: z.string(),
        entityType: z.string(),
        entityId: z.string(),
        message: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        __v: z.number(),
      }),
    ])
  ),
  total: z.number(),
});

export type TLogSchema = z.infer<typeof logSchema>;
