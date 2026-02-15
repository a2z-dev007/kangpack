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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateUser, useUpdateUser } from "../queries";
import { Loader2 } from "lucide-react";
import SelectInput from "@/components/ui/select-input";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
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
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      form.reset({
        name: "",
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
        { id: user._id, data },
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
            <FormField
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
            />

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
                  <FormControl>
                    <SelectInput
                      options={[
                        { value: "user", label: "User" },
                        { value: "staff", label: "Staff" },
                        { value: "admin", label: "Admin" },
                      ]}
                      value={[
                        { value: "user", label: "User" },
                        { value: "staff", label: "Staff" },
                        { value: "admin", label: "Admin" },
                      ].find((opt) => opt.value === field.value)}
                      onChange={(option: any) => field.onChange(option?.value)}
                      placeholder="Select role"
                    />
                  </FormControl>
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
