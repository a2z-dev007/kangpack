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
import { Switch } from "@/components/ui/switch";
import { useCreateCoupon, useUpdateCoupon } from "../queries";
import { Loader2 } from "lucide-react";
import SelectInput from "@/components/ui/select-input";

const couponSchema = z.object({
  code: z.string().min(1, "Code is required").toUpperCase(),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().min(1, "Value must be at least 1"),
  minOrderAmount: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().min(0).optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon?: any;
}

export function CouponModal({ isOpen, onClose, coupon }: CouponModalProps) {
  const isEditing = !!coupon;

  const { mutate: createCoupon, isPending: isCreating } = useCreateCoupon();
  const { mutate: updateCoupon, isPending: isUpdating } = useUpdateCoupon();

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      type: "percentage",
      value: 0,
      minOrderAmount: 0,
      usageLimit: 0,
      expiresAt: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (coupon) {
      form.reset({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount || 0,
        usageLimit: coupon.usageLimit || 0,
        expiresAt: coupon.expiresAt
          ? new Date(coupon.expiresAt).toISOString().split("T")[0]
          : "",
        isActive: coupon.isActive,
      });
    } else {
      form.reset({
        code: "",
        type: "percentage",
        value: 0,
        minOrderAmount: 0,
        usageLimit: 0,
        expiresAt: "",
        isActive: true,
      });
    }
  }, [coupon, form]);

  const onSubmit = (values: CouponFormValues) => {
    if (isEditing) {
      updateCoupon(
        { id: coupon.id || coupon._id, data: values },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      createCoupon(values, {
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
            {isEditing ? "Edit Coupon" : "Create New Coupon"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input placeholder="SUMMER20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <SelectInput
                        options={[
                          { value: "percentage", label: "Percentage" },
                          { value: "fixed", label: "Fixed Amount" },
                        ]}
                        value={[
                          { value: "percentage", label: "Percentage" },
                          { value: "fixed", label: "Fixed Amount" },
                        ].find((opt) => opt.value === field.value)}
                        onChange={(option: any) =>
                          field.onChange(option?.value)
                        }
                        placeholder="Select type"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minOrderAmount"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Min Order Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Usage Limit</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                {isEditing ? "Save Changes" : "Create Coupon"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
