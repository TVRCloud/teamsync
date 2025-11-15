"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useCreateNotification } from "@/hooks/useNotification";
import { CreateNotificationInput } from "@/types/notification";

const notificationSchema = z.object({
  type: z.enum(["BROADCAST", "ROLE_BASED", "DIRECT", "SYSTEM", "TASK"]),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  audienceType: z.enum(["ALL", "ROLE", "USER"]),
  roles: z.array(z.string()).optional(),
  users: z.array(z.string()).optional(),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export function NotificationForm() {
  const { createNotification, isLoading, error } = useCreateNotification();
  const [successMessage, setSuccessMessage] = useState("");

  const { control, handleSubmit, watch, reset } = useForm<NotificationFormData>(
    {
      resolver: zodResolver(notificationSchema),
      defaultValues: {
        type: "BROADCAST",
        audienceType: "ALL",
        roles: [],
        users: [],
      },
    }
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const audienceType = watch("audienceType");

  const onSubmit = async (data: NotificationFormData) => {
    try {
      const input: CreateNotificationInput = {
        type: data.type,
        title: data.title,
        body: data.body,
        audienceType: data.audienceType,
        roles: data.roles,
        users: data.users,
      };

      await createNotification(input);
      setSuccessMessage("Notification created successfully!");
      reset();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to create notification:", err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create Notification</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Notification Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="BROADCAST">Broadcast</option>
                  <option value="ROLE_BASED">Role Based</option>
                  <option value="DIRECT">Direct</option>
                  <option value="SYSTEM">System</option>
                  <option value="TASK">Task</option>
                </select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="audienceType">Audience</Label>
            <Controller
              name="audienceType"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="ALL">All Users</option>
                  <option value="ROLE">By Role</option>
                  <option value="USER">Direct Users</option>
                </select>
              )}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Notification title" />
            )}
          />
        </div>

        <div>
          <Label htmlFor="body">Message</Label>
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Notification message"
                className="w-full px-3 py-2 border rounded-md bg-background"
                rows={4}
              />
            )}
          />
        </div>

        {audienceType === "ROLE" && (
          <div>
            <Label htmlFor="roles">Roles (comma-separated)</Label>
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="admin, manager, lead"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((r) => r.trim())
                    )
                  }
                />
              )}
            />
          </div>
        )}

        {audienceType === "USER" && (
          <div>
            <Label htmlFor="users">User IDs (comma-separated)</Label>
            <Controller
              name="users"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="user-id-1, user-id-2"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((u) => u.trim())
                    )
                  }
                />
              )}
            />
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating..." : "Create Notification"}
        </Button>
      </form>
    </Card>
  );
}
