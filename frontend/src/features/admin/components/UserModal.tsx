"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateUser, useUpdateUser } from "../queries";
import { Loader2 } from "lucide-react";

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  // name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  role: z.enum(["user", "staff", "admin"]),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const isEditing = !!user;

  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      // name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        // name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        // name: "",
        email: "",
        password: "",
        role: "user",
      });
    }
  }, [user, form]);

  const onSubmit = (values: UserFormValues) => {
    const data = { ...values };
    if (isEditing && !data.password) {
      delete data.password;
    }

    if (isEditing) {
      updateUser(
        { id: user.id || user._id, data },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      createUser(data, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit User" : "Create New User"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing ? "New Password (Optional)" : "Password"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
