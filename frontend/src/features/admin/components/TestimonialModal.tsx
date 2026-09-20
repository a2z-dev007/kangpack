"use client";

import { useEffect, useState } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCreateTestimonial, useUpdateTestimonial } from "../queries";
import { Loader2, Star } from "lucide-react";
import { AdminTestimonial } from "../api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonialFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  role: z.string().trim().min(2, "Role must be at least 2 characters"),
  company: z.string().trim().default(""),
  content: z.string().trim().min(5, "Testimonial review must be at least 5 characters"),
  image: z.string().trim().default(""),
  rating: z.coerce.number().min(1).max(5).default(5),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial?: AdminTestimonial | null;
}

export function TestimonialModal({ isOpen, onClose, testimonial }: TestimonialModalProps) {
  const isEditing = !!testimonial;
  const { mutate: createTestimonial, isPending: isCreating } = useCreateTestimonial();
  const { mutate: updateTestimonial, isPending: isUpdating } = useUpdateTestimonial();
  const isLoading = isCreating || isUpdating;

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      role: "",
      company: "",
      content: "",
      image: "",
      rating: 5,
      order: 0,
      isActive: true,
    },
  });

  const previewAvatar = form.watch("image");
  const currentRating = form.watch("rating") || 5;

  useEffect(() => {
    if (testimonial) {
      form.reset({
        name: testimonial.name || "",
        role: testimonial.role || "",
        company: testimonial.company || "",
        content: testimonial.content || testimonial.text || "",
        image: testimonial.image || testimonial.avatar || "",
        rating: testimonial.rating ?? 5,
        order: testimonial.order ?? 0,
        isActive: testimonial.isActive ?? true,
      });
    } else {
      form.reset({
        name: "",
        role: "",
        company: "",
        content: "",
        image: "",
        rating: 5,
        order: 0,
        isActive: true,
      });
    }
  }, [testimonial, form]);

  const onSubmit = (values: TestimonialFormValues) => {
    if (isEditing && testimonial) {
      const id = testimonial.id || testimonial._id;
      if (!id) return;
      updateTestimonial(
        { id, data: values },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createTestimonial(values, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Testimonial" : "Add New Testimonial"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-xl border">
              <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                <AvatarImage src={previewAvatar} alt="Avatar preview" />
                <AvatarFallback className="font-semibold text-sm">
                  {form.watch("name")?.slice(0, 2)?.toUpperCase() || "KP"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs">Avatar Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://i.pravatar.cc/150?img=12 or /assets/..."
                          className="h-9 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Client Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Eddie Brock" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Job Title / Role *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CEO, Senior Designer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Company / Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Royal Kingscope, Creative Studios" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Rating (1 to 5 stars)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          className="p-1 hover:scale-110 transition-transform focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= currentRating
                                ? "fill-[#D0BB74] text-[#D0BB74]"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-semibold text-muted-foreground">
                        {currentRating} / 5 Stars
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Testimonial Quote / Review *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share the customer's experience with Kangpack..."
                      rows={4}
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Display Order</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Controls presentation order in the carousel/marquee
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3.5 bg-muted/20">
                  <div className="space-y-0.5">
                    <FormLabel className="font-semibold text-sm">Active on Website</FormLabel>
                    <FormDescription className="text-xs">
                      When enabled, this review displays in the public homepage marquee.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="btn-premium">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create Testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
