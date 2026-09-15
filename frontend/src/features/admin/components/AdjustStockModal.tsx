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
import { useAdjustStock } from "../queries";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const stockSchema = z.object({
  quantity: z.coerce.number().min(0, "Quantity must be positive"),
  reason: z.string().min(1, "Reason is required"),
});

type StockFormValues = z.infer<typeof stockSchema>;

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export function AdjustStockModal({
  isOpen,
  onClose,
  product,
}: AdjustStockModalProps) {
  const { mutate: adjustStock, isPending } = useAdjustStock();

  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      quantity: 0,
      reason: "Restocking",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        quantity: product.stock,
        reason: "Restocking",
      });
    }
  }, [product, form]);

  const onSubmit = (values: StockFormValues) => {
    adjustStock(
      { productId: product.id || product._id, ...values },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock: {product?.name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>New Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Reason for adjustment</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "Restocking"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-[99999] bg-popover">
                      <SelectItem value="Restocking">Restocking</SelectItem>
                      <SelectItem value="Inventory Count">Inventory Count</SelectItem>
                      <SelectItem value="Damaged Goods">Damaged Goods</SelectItem>
                      <SelectItem value="Return">Return</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
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
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Stock
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
