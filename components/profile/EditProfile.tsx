import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Loader2, Mail, Save, Settings, User, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TUpdateUserSchema, updateUserSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditProfile } from "@/hooks/useUser";
import { toast } from "sonner";

type Props = {
  user: {
    name: string;
    email: string;
    role: string;
  };
  refetch: () => void;
};

const EditProfile = ({ user, refetch }: Props) => {
  const editProfile = useEditProfile();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<TUpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const onSubmit = (data: TUpdateUserSchema) => {
    editProfile.mutate(data, {
      onSuccess: () => {
        refetch();
        setIsEditing(false);
        form.reset();
        toast.success("Profile updated successfully");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Something went wrong");
      },
    });
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-2xl">Edit Profile Details</CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Update your personal and account information below."
                    : "Click 'Edit' to make changes to your profile."}
                </CardDescription>
              </div>

              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button type="button" onClick={handleEdit} size="sm">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-2"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      {editProfile.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="relative"
                        >
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="Your Name"
                            className="pl-10"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="cursor-not-allowed">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="relative"
                        >
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input {...field} disabled className="pl-10" />
                        </motion.div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="cursor-not-allowed">
                      <FormLabel>User Role</FormLabel>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                      >
                        <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          disabled
                          className="pl-10 capitalize"
                        />
                      </motion.div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
