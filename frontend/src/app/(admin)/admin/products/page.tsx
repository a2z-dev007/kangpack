"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useAdminProducts,
  useDeleteProduct,
  useBulkDeleteProducts,
  useBulkUpdateProducts,
} from "@/features/admin/queries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  MoreVertical,
  Package,
  Filter,
  Download,
  Eye,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { useAdminCategories } from "@/features/admin/queries";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmModal } from "@/components/ui/confirm-modal";
export default function AdminProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Helper to initialize state from URL
  const getInitialParam = (key: string, defaultVal: string) => {
    return searchParams.get(key) || defaultVal;
  };

  const [page, setPage] = useState(Number(getInitialParam("page", "1")) || 1);
  const [search, setSearch] = useState(getInitialParam("search", ""));
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Modal states
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Advanced Filter States
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: getInitialParam("category", "all"),
    status: getInitialParam("status", "all"),
    stockStatus: getInitialParam("stockStatus", "all"),
    minPrice: getInitialParam("minPrice", ""),
    maxPrice: getInitialParam("maxPrice", ""),
  });

  const [pendingFilters, setPendingFilters] = useState(activeFilters);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync state to URL whenever filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (page > 1) params.set("page", page.toString());
    else params.delete("page");

    if (search) params.set("search", search);
    else params.delete("search");

    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [page, search, activeFilters, pathname, router]);

  // Sync pending filters when drawer opens
  useEffect(() => {
    if (isFilterOpen) {
      setPendingFilters(activeFilters);
    }
  }, [isFilterOpen, activeFilters]);

  const { data, isLoading } = useAdminProducts({
    page,
    limit: 10,
    search,
    category: activeFilters.category !== "all" ? activeFilters.category : undefined,
    status: activeFilters.status !== "all" ? activeFilters.status : undefined,
    stockStatus: activeFilters.stockStatus !== "all" ? activeFilters.stockStatus : undefined,
    minPrice: activeFilters.minPrice || undefined,
    maxPrice: activeFilters.maxPrice || undefined,
  });

  const { data: categoriesData } = useAdminCategories();
  const categories = categoriesData?.data || [];

  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { mutate: bulkDelete, isPending: isBulkDeleting } =
    useBulkDeleteProducts();
  const { mutate: bulkUpdate } = useBulkUpdateProducts();

  const products = data?.data || [];
  const pagination = data?.pagination;

  // Calculate stats safely
  const stats =
    isClient && products.length > 0
      ? {
          total: pagination?.total || 0,
          active: products.filter((p: any) => p.isActive).length,
          lowStock: products.filter((p: any) => p.stock <= 10 && p.stock > 0)
            .length,
          outOfStock: products.filter((p: any) => p.stock === 0).length,
        }
      : {
          total: pagination?.total || 0,
          active: 0,
          lowStock: 0,
          outOfStock: 0,
        };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p: any) => p._id || p.id));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = () => {
    bulkDelete(selectedProducts, {
      onSuccess: () => {
        setSelectedProducts([]);
      },
    });
  };

  const handleBulkActivate = () => {
    bulkUpdate({ ids: selectedProducts, updates: { isActive: true } });
    setSelectedProducts([]);
  };

  const handleBulkDeactivate = () => {
    bulkUpdate({ ids: selectedProducts, updates: { isActive: false } });
    setSelectedProducts([]);
  };

  const openAddModal = () => {
    router.push("/admin/products/new");
  };

  const openEditModal = (product: any) => {
    router.push(`/admin/products/${product._id || product.id}/edit`);
  };

  const openViewPage = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  const openDeleteModal = (product: any) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  console.log("selectedProduct", selectedProduct);

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct._id || selectedProduct.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedProduct(null);
        },
      });
    }
  };

  const applyFilters = () => {
    setActiveFilters(pendingFilters);
    setFilterOpen(false);
    setPage(1);
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: "all",
      status: "all",
      stockStatus: "all",
      minPrice: "",
      maxPrice: "",
    };
    setPendingFilters(defaultFilters);
    setActiveFilters(defaultFilters);
    setSearch("");
    setPage(1);
  };

  // Show loading skeleton on initial render to prevent hydration issues
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-10 w-full max-w-md" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="max-w-10xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground text-lg">
              Manage your product catalog with ease
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={openAddModal}
              className="bg-gradient-variant-2 text-primary-foreground hover:opacity-90 shadow-lg border-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border shadow-md bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Products
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {stats.total}
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 bg-gradient-variant-2 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-md bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Products
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {stats.active}
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 bg-gradient-variant-2 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-md bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Low Stock
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {stats.lowStock}
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 bg-gradient-variant-2 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-md bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Out of Stock
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {stats.outOfStock}
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 bg-gradient-variant-2 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border shadow-lg bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 border-border focus:border-primary focus:ring-primary/20"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "hidden sm:flex rounded-xl h-10 px-4",
                  Object.values(activeFilters).some(
                    (v) => v !== "all" && v !== "",
                  ) && "border-primary text-primary bg-primary/5",
                )}
                onClick={() => setFilterOpen(true)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>

              {(search ||
                Object.values(activeFilters).some(
                  (val) => val !== "all" && val !== "",
                )) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/5"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">
                    {selectedProducts.length} selected
                  </span>
                  <div className="h-4 w-px bg-border" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkActivate}
                    className="text-success hover:text-success/80"
                  >
                    Activate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDeactivate}
                    className="text-warning hover:text-warning/80"
                  >
                    Deactivate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={isBulkDeleting}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="border shadow-lg bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">
              Product Catalog
              {isLoading ? (
                <Skeleton className="ml-2 h-4 w-20 inline-block" />
              ) : (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({stats.total} total)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="mx-auto h-24 w-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {search
                    ? "Try adjusting your search terms or filters."
                    : "Get started by creating your first product."}
                </p>
                {!search && (
                  <Button
                    onClick={openAddModal}
                    className="bg-gradient-variant-2 text-primary-foreground hover:opacity-90 border-0"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Product
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {/* Table Header */}
                <div className="flex items-center gap-4 px-6 py-4 bg-muted/20 border-b border-border">
                  <Checkbox
                    checked={
                      selectedProducts.length === products.length &&
                      products.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                    className="border-input"
                  />
                  <div className="flex-1 grid grid-cols-5 gap-4 text-sm font-semibold text-muted-foreground">
                    <div className="col-span-2">Product Details</div>
                    <div>Pricing</div>
                    <div>Inventory</div>
                    <div>Status</div>
                  </div>
                  <div className="w-20 text-center text-sm font-semibold text-muted-foreground">
                    Actions
                  </div>
                </div>

                {/* Product Rows */}
                {products.map((product: any, index: number) => (
                  <div
                    key={product._id || product.id}
                    className={`flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-all duration-200 group ${
                      index % 2 === 0 ? "bg-card" : "bg-muted/10"
                    }`}
                  >
                    <Checkbox
                      checked={selectedProducts.includes(product._id || product.id)}
                      onCheckedChange={() => handleSelect(product._id || product.id)}
                      className="border-input"
                    />
                    <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                      {/* Product Info */}
                      <div className="col-span-2 flex items-center gap-4 cursor-pointer" onClick={() => openViewPage(product._id || product.id)}>
                        <div className="relative">
                          {product.images?.[0] ? (
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-border">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-muted/20 rounded-xl flex items-center justify-center border border-border">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground font-mono">
                            {product.sku}
                          </p>
                          {product.category && (
                            <p className="text-xs text-muted-foreground/80 mt-1">
                              {product.category.name || product.category}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div>
                        <p className="font-bold text-foreground text-lg">
                          {formatPrice(product.price)}
                        </p>
                        {product.comparePrice &&
                          product.comparePrice > product.price && (
                            <p className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.comparePrice)}
                            </p>
                          )}
                      </div>

                      {/* Stock */}
                      <div>
                        <Badge
                          variant={
                            product.stock > 10
                              ? "default"
                              : product.stock > 0
                                ? "secondary"
                                : "destructive"
                          }
                          className={`font-medium ${
                            product.stock > 10
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : product.stock > 0
                                ? "bg-warning/10 text-warning hover:bg-warning/20"
                                : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                          }`}
                        >
                          {product.stock}{" "}
                          {product.stock === 1 ? "unit" : "units"}
                        </Badge>
                      </div>

                      {/* Status */}
                      <div>
                        <Badge
                          variant={product.isActive ? "default" : "secondary"}
                          className={`font-medium ${
                            product.isActive
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="w-20 flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => openViewPage(product._id || product.id)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditModal(product)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              bulkUpdate({
                                ids: [product._id || product.id],
                                updates: { isActive: !product.isActive },
                              })
                            }
                            className="cursor-pointer"
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            {product.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => openDeleteModal(product)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-muted/20 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">{(page - 1) * 10 + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(page * 10, pagination.total)}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  products
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="border-input hover:bg-muted"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, pagination.pages) },
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className={`w-8 h-8 p-0 ${
                              page === pageNum
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "border-input hover:bg-muted"
                            }`}
                          >
                            {pageNum}
                          </Button>
                        );
                      },
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= pagination.pages}
                    className="border-input hover:bg-muted"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Product"
          description={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
          isLoading={isDeleting}
        />

        {/* Filters Side Drawer */}
        <SideDrawer
          isOpen={isFilterOpen}
          onClose={() => setFilterOpen(false)}
          title="Advanced Filters"
          description="Refine your product catalog with detailed criteria."
          icon={<Filter className="h-6 w-6" />}
          footer={
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={applyFilters}
                className="w-full h-12 rounded-xl bg-[#6B4A2D] hover:bg-[#5A3E25] font-bold"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full h-12 rounded-xl border-slate-200 text-slate-500 font-bold"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Everything
              </Button>
            </div>
          }
        >
          <div className="space-y-8">
            {/* Category Filter */}
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                Category
              </Label>
              <Select
                value={pendingFilters.category}
                onValueChange={(val) =>
                  setPendingFilters((prev) => ({ ...prev, category: val }))
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Status
              </Label>
              <Select
                value={pendingFilters.status}
                onValueChange={(val) =>
                  setPendingFilters((prev) => ({ ...prev, status: val }))
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stock Status Filter */}
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Stock Status
              </Label>
              <Select
                value={pendingFilters.stockStatus}
                onValueChange={(val) =>
                  setPendingFilters((prev) => ({ ...prev, stockStatus: val }))
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium">
                  <SelectValue placeholder="All Stock Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white shadow-xl">
                  <SelectItem value="all">All Stock Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Price Range (₹)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Min"
                  value={pendingFilters.minPrice}
                  onChange={(e) =>
                    setPendingFilters((prev) => ({
                      ...prev,
                      minPrice: e.target.value,
                    }))
                  }
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={pendingFilters.maxPrice}
                  onChange={(e) =>
                    setPendingFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value,
                    }))
                  }
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium"
                />
              </div>
            </div>
          </div>
        </SideDrawer>
      </div>
    </div>
  );
}
