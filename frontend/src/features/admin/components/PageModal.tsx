'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCreatePage, useUpdatePage } from '../queries';
import { Loader2 } from 'lucide-react';

const pageSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    content: z.string().min(1, 'Content is required'),
    isActive: z.boolean().default(true),
});

type PageFormValues = z.infer<typeof pageSchema>;

interface PageModalProps {
    isOpen: boolean;
    onClose: () => void;
    pageData?: any;
}

export function PageModal({ isOpen, onClose, pageData }: PageModalProps) {
    const isEditing = !!pageData;

    const { mutate: createPage, isPending: isCreating } = useCreatePage();
    const { mutate: updatePage, isPending: isUpdating } = useUpdatePage();

    const form = useForm<PageFormValues>({
        resolver: zodResolver(pageSchema),
        defaultValues: {
            title: '',
            slug: '',
            content: '',
            isActive: true,
        },
    });

    useEffect(() => {
        if (pageData) {
            form.reset({
                title: pageData.title,
                slug: pageData.slug,
                content: pageData.content,
                isActive: pageData.isActive,
            });
        } else {
            form.reset({
                title: '',
                slug: '',
                content: '',
                isActive: true,
            });
        }
    }, [pageData, form]);

    const onSubmit = (values: PageFormValues) => {
        if (isEditing) {
            updatePage(
                { id: pageData._id, data: values },
                {
                    onSuccess: () => {
                        onClose();
                    },
                }
            );
        } else {
            createPage(values, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Page' : 'Create New Page'}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="About Us" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="about-us" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Content (Markdown/HTML supported)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter page content here..."
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }: { field: any }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormLabel className="mt-0">Published</FormLabel>
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
                                {isEditing ? 'Save Changes' : 'Create Page'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
