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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCreateFaq, useUpdateFaq } from "../queries";
import { Loader2 } from "lucide-react";
import { AdminFaq } from "../api";

const faqFormSchema = z.object({
  question: z.string().trim().min(3, "Question must be at least 3 characters"),
  answer: z.string().trim().min(3, "Answer must be at least 3 characters"),
  category: z.string().trim().default("General"),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

type FaqFormValues = z.infer<typeof faqFormSchema>;

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq?: AdminFaq | null;
}

export function FaqModal({ isOpen, onClose, faq }: FaqModalProps) {
  const isEditing = !!faq;
  const { mutate: createFaq, isPending: isCreating } = useCreateFaq();
  const { mutate: updateFaq, isPending: isUpdating } = useUpdateFaq();
  const isLoading = isCreating || isUpdating;

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "General",
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (faq) {
      form.reset({
        question: faq.question || "",
        answer: faq.answer || "",
        category: faq.category || "General",
        order: faq.order ?? 0,
        isActive: faq.isActive ?? true,
      });
    } else {
      form.reset({
        question: "",
        answer: "",
        category: "General",
        order: 0,
        isActive: true,
      });
    }
  }, [faq, form]);

  const onSubmit = (values: FaqFormValues) => {
    if (isEditing && faq) {
      const faqId = faq.id || faq._id;
      if (!faqId) return;
      updateFaq(
        { id: faqId, data: values },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createFaq(values, {
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
            {isEditing ? "Edit FAQ" : "Create New FAQ"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Question *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. What makes Kangpack different?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Answer *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a thorough, informative answer..."
                      rows={4}
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Design, Usability, Travel"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Group similar questions together</FormDescription>
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
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Lower numbers appear first</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3.5 bg-muted/20">
                  <div className="space-y-0.5">
                    <FormLabel className="font-semibold text-sm">Active on Website</FormLabel>
                    <FormDescription className="text-xs">
                      When enabled, this FAQ is visible on the public website.
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
                {isEditing ? "Save Changes" : "Create FAQ"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
