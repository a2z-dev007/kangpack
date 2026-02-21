"use client";

import { useParams } from "next/navigation";
import { useAdminProduct } from "@/features/admin/queries";
import { ProductForm } from "@/features/admin/components/ProductForm";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: productResponse, isLoading, error } = useAdminProduct(id);

  const product = productResponse;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="text-muted-foreground">The product you're trying to edit doesn't exist or was deleted.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <ProductForm product={product} />
    </div>
  );
}
