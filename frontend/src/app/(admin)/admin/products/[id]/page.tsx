"use client";

import { useParams, useRouter } from "next/navigation";
import { useAdminProduct } from "@/features/admin/queries";
import { Loader2, AlertCircle, Edit, ChevronLeft, Package, ExternalLink, Activity, ShoppingCart, TrendingUp, Truck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: productResponse, isLoading, error } = useAdminProduct(id);

  const product = productResponse;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading product...</p>
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
        <Button asChild className="mt-4"><Link href="/admin/products">Return to Catalog</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/products")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-success/10 text-success hover:bg-success/20 border-0" : ""}>
                {product.isActive ? "Active" : "Hidden"}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Package className="h-4 w-4" /> SKU: {product.sku} • {product.category?.name || "Uncategorized"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" asChild className="flex-1 ">
            <Link href={`/product/${product._id || product.id}`} target="_blank" className="flex flex-row items-center justify-center">
              <ExternalLink className="mr-2 h-4 w-4" /> View Storefront
            </Link>
          </Button>
          <Button asChild className="flex-1 flex shadow-lg shadow-primary/20">
            <Link href={`/admin/products/${product._id || product.id}/edit`} className="flex flex-row items-center justify-center">
              <Edit className="mr-2 h-4 w-4" /> Edit Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p className="text-xl font-bold">{formatPrice(product.price)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock</p>
                <p className="text-xl font-bold">{product.stock} units</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-success/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sales</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Views</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <h4 className="text-foreground">Description</h4>
                <p>{product.description}</p>
              </div>

              {product.images?.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Gallery</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {product.images.map((img: string, i: number) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Logistics & SEO</TabsTrigger>
              <TabsTrigger value="history">Stock History</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2"><Truck className="h-4 w-4" /> Shipping</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b"><span className="text-muted-foreground">Weight:</span> <span>{product.weight || 0} {product.weightUnit}</span></div>
                      <div className="flex justify-between py-1 border-b"><span className="text-muted-foreground">Dimensions:</span> <span>{product.dimensions?.length}x{product.dimensions?.width}x{product.dimensions?.height} {product.dimensions?.unit}</span></div>
                      <div className="flex justify-between py-1 border-b"><span className="text-muted-foreground">Requires Shipping:</span> <span>{product.requiresShipping ? "Yes" : "No"}</span></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2"><Search className="h-4 w-4" /> SEO</h3>
                    <div className="space-y-2 text-sm">
                      <div className="space-y-1"><p className="text-muted-foreground">Meta Title:</p><p className="font-medium">{product.seo?.metaTitle || "None set"}</p></div>
                      <div className="space-y-1 pt-2"><p className="text-muted-foreground">Meta Description:</p><p className="font-medium">{product.seo?.metaDescription || "None set"}</p></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card><CardContent className="py-10 text-center text-muted-foreground">No recent inventory movements</CardContent></Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Publishing Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
                  <span className="text-sm font-medium">Public Status</span>
                  <Badge variant={product.isActive ? "default" : "secondary"}>{product.isActive ? "Live" : "Draft"}</Badge>
                </div>
                <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
                  <span className="text-sm font-medium">Featured</span>
                  <Badge variant={product.isFeatured ? "default" : "secondary"}>{product.isFeatured ? "Yes" : "No"}</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Last updated: {new Date(product.updatedAt || Date.now()).toLocaleDateString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Inventory Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">Current Stock:</span>
                <span className="font-bold">{product.stock} Units</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">Alert Level:</span>
                <span className="text-warning">{product.lowStockThreshold} Units</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-success h-full" style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
