"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  CreateNotificationInput,
  CreateNotificationSchema,
} from "@/types/notification";

export default function NotificationForm() {
  const form = useForm<CreateNotificationInput>({
    resolver: zodResolver(CreateNotificationSchema),
    defaultValues: {
      type: "BROADCAST",
      title: "",
      body: "",
      audienceType: "ALL",
    },
  });

  const onSubmit = async (data: CreateNotificationInput) => {
    await fetch("/api/notifications/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Send Notification</Button>
      </form>
    </Form>
  );
}
