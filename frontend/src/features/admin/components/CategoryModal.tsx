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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAdminCategories, useCreateCategory, useUpdateCategory } from "../queries";
import { Loader2 } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  parentCategory: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  seo: z.object({
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
    metaKeywords: z.string().max(255).optional(),
  }).optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: any;
}

export function CategoryModal({
  isOpen,
  onClose,
  category,
}: CategoryModalProps) {
  const isEditing = !!category;

  const { data: categoriesData } = useAdminCategories();
  const allCategories = categoriesData?.data || [];

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      parentCategory: null,
      isActive: true,
      seo: {
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
      },
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || "",
        parentCategory: category.parentCategory || null,
        isActive: category.isActive,
        seo: {
          metaTitle: category.seo?.metaTitle || "",
          metaDescription: category.seo?.metaDescription || "",
          metaKeywords: category.seo?.metaKeywords || "",
        },
      });
    } else {
      form.reset({
        name: "",
        description: "",
        parentCategory: null,
        isActive: true,
        seo: {
          metaTitle: "",
          metaDescription: "",
          metaKeywords: "",
        },
      });
    }
  }, [category, form]);

  const onSubmit = (values: CategoryFormValues) => {
    // Generate slug from name
    const slug = values.name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    
    // Handle null parentCategory for backend
    const data = { 
      ...values, 
      slug,
      parentCategory: values.parentCategory === "none" ? null : values.parentCategory
    };

    if (isEditing) {
      updateCategory(
        { id: category.id || category._id, data },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      createCategory(data, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isLoading = isCreating || isUpdating;

  // Filter out the current category from potential parents to avoid circular dependency
  const potentialParents = allCategories.filter((c: any) => 
    (c.id || c._id) !== (category?.id || category?._id) && !c.parentCategory
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Electronics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentCategory"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (Root Category)</SelectItem>
                      {potentialParents.map((c: any) => (
                        <SelectItem key={c.id || c._id} value={c.id || c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">SEO Settings (Optional)</h4>
              <FormField
                control={form.control}
                name="seo.metaTitle"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Web page title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seo.metaDescription"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief summary for search engines" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }: { field: any }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="mt-0">Active</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                {isEditing ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
