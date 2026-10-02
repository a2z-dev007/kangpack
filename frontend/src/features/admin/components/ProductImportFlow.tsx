"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useAdminCategories,
  useBulkImportProducts,
  useCreateProduct,
} from "../queries";
import {
  generateProductExcelTemplate,
  parseProductExcelFile,
  ParsedProductRow,
} from "../utils/excelTemplate";
import { toast } from "@/lib/toast";
import {
  Download,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  Package,
  Image as ImageIcon,
  X,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Info,
  Tag,
  Truck,
  ShieldCheck,
  LayoutGrid,
  Columns,
  Check,
  Percent,
  Star,
} from "lucide-react";
import Image from "next/image";

export function ProductImportFlow() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeImageInputRef = useRef<HTMLInputElement>(null);
  const { data: categoriesData, isLoading: isLoadingCategories } = useAdminCategories();
  const { mutateAsync: bulkImportAsync, isPending: isBulkImporting } = useBulkImportProducts();
  const { mutateAsync: createSingleProductAsync } = useCreateProduct();

  // Categories list
  const categories = useMemo(() => {
    const rawData = categoriesData?.data || [];
    const flatten = (items: any[], level = 0): any[] => {
      let flat: any[] = [];
      items.forEach((item) => {
        flat.push({
          id: item.id || item._id,
          name: item.name,
          slug: item.slug,
          label: level > 0 ? `${"  ".repeat(level * 2)}${item.name}` : item.name,
        });
        if (item.subcategories && item.subcategories.length > 0) {
          flat = [...flat, ...flatten(item.subcategories, level + 1)];
        }
      });
      return flat;
    };
    return flatten(rawData);
  }, [categoriesData]);

  // Steps: 1 = Upload, 2 = Preview & Edit Workspace, 3 = Summary
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [defaultCategoryId, setDefaultCategoryId] = useState<string>("");
  const [isParsing, setIsParsing] = useState(false);

  // Products array
  const [products, setProducts] = useState<ParsedProductRow[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<"all" | "valid" | "error" | "no_image">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"split" | "grid">("split");

  // Bulk action state
  const [bulkCategoryToApply, setBulkCategoryToApply] = useState<string>("");

  // Import execution stats
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState<{
    total: number;
    success: number;
    failed: number;
    errors: Array<{ sku?: string; name?: string; error: string }>;
  } | null>(null);

  // Active product being edited in the studio
  const activeProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0] || null;
  }, [products, selectedProductId]);

  // Ensure first product is selected when list loads
  useEffect(() => {
    if (products.length > 0 && !products.some((p) => p.id === selectedProductId)) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  // 1. Download Template handler
  const handleDownloadTemplate = () => {
    try {
      generateProductExcelTemplate(categories);
      toast.success("Excel template downloaded successfully!");
    } catch (err: any) {
      toast.error("Failed to generate Excel template: " + (err.message || ""));
    }
  };

  // 2. Parse uploaded file handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);

    try {
      const result = await parseProductExcelFile(file, categories, defaultCategoryId);
      setProducts(result.rows);
      if (result.rows.length > 0) {
        setSelectedProductId(result.rows[0].id);
      }
      setStep(2);
      toast.success(
        `Parsed ${result.totalRows} products (${result.validRows} ready, ${result.errorRows} need category/data check)`
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to parse Excel file");
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Re-validate a specific row or all rows when changed
  const revalidateRow = (row: ParsedProductRow, allRows: ParsedProductRow[]): ParsedProductRow => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!row.name || !row.name.trim()) {
      errors.push("Product Name is required");
    }

    if (!row.sku || !row.sku.trim()) {
      errors.push("SKU is required");
    } else {
      const dupSku = allRows.find(
        (r) => r.id !== row.id && r.sku.toLowerCase().trim() === row.sku.toLowerCase().trim()
      );
      if (dupSku) {
        errors.push(`Duplicate SKU "${row.sku}" in file`);
      }
    }

    if (row.price === undefined || isNaN(Number(row.price)) || Number(row.price) < 0) {
      errors.push("Valid positive Price is required");
    }

    if (row.stock === undefined || isNaN(Number(row.stock)) || Number(row.stock) < 0) {
      errors.push("Valid positive Stock is required");
    }

    if (!row.resolvedCategoryId) {
      errors.push("Category is required");
    }

    const hasImages = (row.localImageFiles && row.localImageFiles.length > 0) || (row.imageUrls && row.imageUrls.length > 0);
    if (!hasImages) {
      warnings.push("No images attached (recommended)");
    }

    return {
      ...row,
      isValid: errors.length === 0,
      errors,
      warnings,
      selectedForImport: errors.length === 0 ? row.selectedForImport : false,
    };
  };

  // Update active product field
  const updateProductField = (id: string, field: keyof ParsedProductRow, value: any) => {
    setProducts((prev) => {
      const updated = prev.map((row) => {
        if (row.id !== id) return row;
        let newRow = { ...row, [field]: value };

        if (field === "resolvedCategoryId") {
          const matched = categories.find((c) => c.id === value);
          newRow.resolvedCategoryId = value;
          newRow.resolvedCategoryName = matched?.name || "";
          newRow.category = matched?.name || value;
        }

        return newRow;
      });

      return updated.map((r) => revalidateRow(r, updated));
    });
  };

  // Row selection toggle
  const handleToggleSelect = (id: string) => {
    setProducts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selectedForImport: !r.selectedForImport } : r))
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setProducts((prev) =>
      prev.map((r) => ({
        ...r,
        selectedForImport: checked ? r.isValid : false,
      }))
    );
  };

  // Apply active product's category to all products
  const handleApplyCategoryToAll = (catId: string) => {
    if (!catId) return;
    const matched = categories.find((c) => c.id === catId);
    setProducts((prev) => {
      const updated = prev.map((row) => ({
        ...row,
        resolvedCategoryId: catId,
        resolvedCategoryName: matched?.name || "",
        category: matched?.name || catId,
      }));
      return updated.map((r) => revalidateRow(r, updated));
    });
    toast.success(`Assigned category "${matched?.name}" to all products`);
  };

  // Bulk category assign to selected products
  const handleApplyBulkCategory = () => {
    if (!bulkCategoryToApply) {
      toast.error("Please select a category first");
      return;
    }
    const selectedCount = products.filter((p) => p.selectedForImport).length;
    if (selectedCount === 0) {
      toast.error("No products selected. Please check products on the left.");
      return;
    }

    const matched = categories.find((c) => c.id === bulkCategoryToApply);
    setProducts((prev) => {
      const updated = prev.map((row) => {
        if (!row.selectedForImport) return row;
        return {
          ...row,
          resolvedCategoryId: bulkCategoryToApply,
          resolvedCategoryName: matched?.name || "",
          category: matched?.name || bulkCategoryToApply,
        };
      });
      return updated.map((r) => revalidateRow(r, updated));
    });

    toast.success(`Assigned "${matched?.name}" to ${selectedCount} selected products`);
  };

  // Local image upload for a product
  const handleAddLocalImages = (rowId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const newPreviews = fileArray.map((f) => URL.createObjectURL(f));

    setProducts((prev) => {
      const updated = prev.map((r) => {
        if (r.id !== rowId) return r;
        return {
          ...r,
          localImageFiles: [...(r.localImageFiles || []), ...fileArray],
          localImagePreviews: [...(r.localImagePreviews || []), ...newPreviews],
        };
      });
      return updated.map((r) => revalidateRow(r, updated));
    });
    toast.success(`Attached ${fileArray.length} image(s)`);
  };

  const handleRemoveLocalImage = (rowId: string, index: number) => {
    setProducts((prev) => {
      const updated = prev.map((r) => {
        if (r.id !== rowId) return r;
        const files = [...(r.localImageFiles || [])];
        const previews = [...(r.localImagePreviews || [])];
        files.splice(index, 1);
        previews.splice(index, 1);
        return { ...r, localImageFiles: files, localImagePreviews: previews };
      });
      return updated.map((r) => revalidateRow(r, updated));
    });
  };

  // Set image as cover photo (moves to index 0 so it displays first)
  const handleSetCoverImage = (rowId: string, index: number) => {
    if (index === 0) return;
    setProducts((prev) => {
      const updated = prev.map((r) => {
        if (r.id !== rowId) return r;
        const files = [...(r.localImageFiles || [])];
        const previews = [...(r.localImagePreviews || [])];

        if (files[index]) {
          const [f] = files.splice(index, 1);
          files.unshift(f);
        }
        if (previews[index]) {
          const [p] = previews.splice(index, 1);
          previews.unshift(p);
        }
        return { ...r, localImageFiles: files, localImagePreviews: previews };
      });
      return updated.map((r) => revalidateRow(r, updated));
    });
    toast.success("Cover photo set (will show first on store)");
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r) => revalidateRow(r, filtered));
    });
  };

  // Add manual product row
  const handleAddManualProduct = () => {
    const newId = `prod-manual-${Date.now()}`;
    const defaultCat = categories.length > 0 ? categories[0] : undefined;
    const newRow: ParsedProductRow = {
      id: newId,
      rowIndex: products.length + 1,
      name: "New Product",
      sku: `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      category: defaultCat?.name || "",
      resolvedCategoryId: defaultCat?.id,
      resolvedCategoryName: defaultCat?.name,
      price: 199,
      stock: 50,
      description: "Product description...",
      isActive: true,
      isFeatured: false,
      isNew: true,
      isBestseller: false,
      isDigital: false,
      requiresShipping: true,
      freeShipping: false,
      taxable: true,
      condition: "new",
      imageUrls: [],
      localImageFiles: [],
      localImagePreviews: [],
      isValid: true,
      errors: [],
      warnings: ["No images attached"],
      selectedForImport: true,
    };
    setProducts((prev) => [newRow, ...prev]);
    setSelectedProductId(newId);
    toast.success("Added new product to queue");
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((row) => {
      if (activeFilter === "valid" && !row.isValid) return false;
      if (activeFilter === "error" && row.isValid) return false;
      if (activeFilter === "no_image") {
        const hasImg = (row.localImageFiles && row.localImageFiles.length > 0) || (row.imageUrls && row.imageUrls.length > 0);
        if (hasImg) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = row.name.toLowerCase().includes(q);
        const matchesSku = row.sku.toLowerCase().includes(q);
        const matchesCat = (row.resolvedCategoryName || row.category || "").toLowerCase().includes(q);
        return matchesName || matchesSku || matchesCat;
      }
      return true;
    });
  }, [products, activeFilter, searchQuery]);

  // Counts
  const totalCount = products.length;
  const validCount = products.filter((p) => p.isValid).length;
  const errorCount = products.filter((p) => !p.isValid).length;
  const missingImageCount = products.filter(
    (p) => (!p.localImageFiles || p.localImageFiles.length === 0) && (!p.imageUrls || p.imageUrls.length === 0)
  ).length;
  const selectedCount = products.filter((p) => p.selectedForImport && p.isValid).length;

  // Active product index
  const activeProductIndex = products.findIndex((p) => p.id === (activeProduct?.id || ""));

  // Navigate next / prev product in Studio
  const handleNavProduct = (direction: "next" | "prev") => {
    if (products.length === 0) return;
    let nextIndex = direction === "next" ? activeProductIndex + 1 : activeProductIndex - 1;
    if (nextIndex < 0) nextIndex = products.length - 1;
    if (nextIndex >= products.length) nextIndex = 0;
    setSelectedProductId(products[nextIndex].id);
  };

  // 3. Execute Import
  const handleExecuteImport = async () => {
    const toImport = products.filter((p) => p.selectedForImport && p.isValid);
    if (toImport.length === 0) {
      toast.error("No valid products selected for import. Please ensure items have a Category and valid price.");
      return;
    }

    setImportProgress(0);
    setIsParsing(true);

    let successCount = 0;
    let failedCount = 0;
    const errorLogs: Array<{ sku?: string; name?: string; error: string }> = [];

    const itemsWithLocalImages = toImport.filter((p) => p.localImageFiles && p.localImageFiles.length > 0);
    const itemsWithoutLocalImages = toImport.filter((p) => !p.localImageFiles || p.localImageFiles.length === 0);

    try {
      // 1. Bulk import items without local image files via fast backend batch endpoint
      if (itemsWithoutLocalImages.length > 0) {
        const batchPayload = itemsWithoutLocalImages.map((p) => ({
          name: p.name,
          sku: p.sku,
          category: p.resolvedCategoryId || p.category,
          price: Number(p.price),
          compareAtPrice: p.compareAtPrice,
          cost: p.cost,
          stock: Number(p.stock),
          lowStockThreshold: p.lowStockThreshold || 5,
          brand: p.brand,
          condition: p.condition || "new",
          shortDescription: p.shortDescription,
          description: p.description || p.name,
          discountType: p.discountType,
          discountValue: p.discountValue,
          discountStartDate: p.discountStartDate,
          discountEndDate: p.discountEndDate,
          weight: p.weight,
          weightUnit: p.weightUnit,
          dimensionsLength: p.dimensionsLength,
          dimensionsWidth: p.dimensionsWidth,
          dimensionsHeight: p.dimensionsHeight,
          dimensionsUnit: p.dimensionsUnit,
          isActive: p.isActive,
          isFeatured: p.isFeatured,
          isNew: p.isNew,
          isBestseller: p.isBestseller,
          isDigital: p.isDigital,
          requiresShipping: p.requiresShipping,
          freeShipping: p.freeShipping,
          taxable: p.taxable,
          taxClass: p.taxClass,
          warranty: p.warranty,
          returnPolicy: p.returnPolicy,
          seoMetaTitle: p.seoMetaTitle,
          seoMetaDescription: p.seoMetaDescription,
          images: p.imageUrls || [],
        }));

        const result = await bulkImportAsync(batchPayload);
        const importedData = result?.data || result;
        successCount += importedData.importedCount || 0;
        failedCount += importedData.failedCount || 0;
        if (Array.isArray(importedData.errors)) {
          errorLogs.push(...importedData.errors);
        }
      }

      // 2. Upload items with local file attachments individually via multipart FormData
      if (itemsWithLocalImages.length > 0) {
        for (let i = 0; i < itemsWithLocalImages.length; i++) {
          const p = itemsWithLocalImages[i];
          try {
            const formData = new FormData();
            formData.append("name", p.name);
            formData.append("sku", p.sku);
            formData.append("category", p.resolvedCategoryId || p.category);
            formData.append("price", String(p.price));
            if (p.compareAtPrice) formData.append("compareAtPrice", String(p.compareAtPrice));
            if (p.cost) formData.append("cost", String(p.cost));
            formData.append("stock", String(p.stock));
            if (p.lowStockThreshold) formData.append("lowStockThreshold", String(p.lowStockThreshold));
            if (p.brand) formData.append("brand", p.brand);
            if (p.condition) formData.append("condition", p.condition);
            if (p.shortDescription) formData.append("shortDescription", p.shortDescription);
            formData.append("description", p.description || p.name);
            formData.append("isActive", String(p.isActive));
            formData.append("isFeatured", String(p.isFeatured));
            formData.append("isNew", String(p.isNew));
            formData.append("isBestseller", String(p.isBestseller));
            formData.append("isDigital", String(p.isDigital));
            formData.append("requiresShipping", String(p.requiresShipping));
            formData.append("freeShipping", String(p.freeShipping));
            formData.append("taxable", String(p.taxable));

            // Append local image files
            if (p.localImageFiles) {
              p.localImageFiles.forEach((file) => formData.append("files", file));
            }

            await createSingleProductAsync(formData);
            successCount += 1;
          } catch (err: any) {
            failedCount += 1;
            errorLogs.push({
              sku: p.sku,
              name: p.name,
              error: err.response?.data?.message || err.message || "Upload failed",
            });
          }

          setImportProgress(Math.round(((i + 1) / itemsWithLocalImages.length) * 100));
        }
      }

      setImportStats({
        total: toImport.length,
        success: successCount,
        failed: failedCount,
        errors: errorLogs,
      });

      setStep(3);
      if (successCount > 0) {
        toast.success(`Imported ${successCount} products successfully!`);
      }
    } catch (err: any) {
      toast.error("Import error: " + (err.message || "Failed to process products"));
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/products")}
              className="text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Products
            </Button>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Bulk Import Studio
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Excel Product Importer & Studio
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            Fill required fields in a simple Excel file, upload, then attach images and configure optional settings right here.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-xl border self-start md:self-auto">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
              step === 1 ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">1</span>
            Simple Excel
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
              step === 2 ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">2</span>
            Media & Options Studio
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
              step === 3 ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">3</span>
            Summary
          </div>
        </div>
      </div>

      {/* STEP 1: DOWNLOAD SIMPLE TEMPLATE & UPLOAD */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Download simple template */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card shadow-md">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold">1. Simple Excel Template</CardTitle>
                <CardDescription>
                  Clean template with only 5 required fields. No messy image URLs or complex columns needed in Excel.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleDownloadTemplate}
                  disabled={isLoadingCategories}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md h-12 text-sm font-bold"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Simple Template (.xlsx)
                </Button>

                <div className="rounded-xl bg-muted/40 border p-4 text-xs space-y-2 text-muted-foreground">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" /> Fields in the Excel Sheet:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                    <span className="font-medium text-foreground">• Product Name*</span>
                    <span className="font-medium text-foreground">• SKU Code*</span>
                    <span className="font-medium text-foreground">• Category*</span>
                    <span className="font-medium text-foreground">• Sale Price (₹)*</span>
                    <span className="font-medium text-foreground">• Stock Quantity*</span>
                    <span className="font-medium text-foreground">• Description*</span>
                    <span className="text-muted-foreground">• Compare Price</span>
                    <span className="text-muted-foreground">• Brand Name</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-2 border-t">
                    💡 Images, discounts, dimensions, and SEO tags can all be configured easily in the next visual studio screen!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Upload area */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold">2. Upload Your Filled Sheet</CardTitle>
                <CardDescription>
                  Select your completed spreadsheet to open the visual Media & Options studio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Fallback default category */}
                <div className="p-3.5 bg-muted/30 rounded-xl border space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Default Store Category (Optional)
                  </Label>
                  <Select value={defaultCategoryId} onValueChange={setDefaultCategoryId}>
                    <SelectTrigger className="h-10 bg-background text-xs">
                      <SelectValue placeholder="-- Pick a default category or select per item in studio --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Pick a default category or select per item in studio --</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label || c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">
                      Click to upload or drag & drop Excel file
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Supports .xlsx, .xls, and .csv files
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 text-xs">
                    Browse File
                  </Button>
                </div>

                {isParsing && (
                  <div className="flex items-center justify-center gap-3 p-3 bg-primary/10 text-primary rounded-xl font-medium text-xs animate-pulse">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Parsing sheet and preparing product studio...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* STEP 2: RICH MEDIA & OPTIONS STUDIO (NO HORIZONTAL TABLE JUNK) */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Top Metric & Control Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-card border rounded-2xl p-4 shadow-sm">
            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div
                onClick={() => setActiveFilter("all")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                  activeFilter === "all" ? "bg-primary text-primary-foreground font-bold shadow-sm" : "hover:bg-muted"
                }`}
              >
                <span>All Products</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {totalCount}
                </Badge>
              </div>

              <div
                onClick={() => setActiveFilter("valid")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                  activeFilter === "valid" ? "bg-emerald-600 text-white font-bold shadow-sm" : "hover:bg-emerald-50 text-emerald-700"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Ready ({validCount})</span>
              </div>

              {errorCount > 0 && (
                <div
                  onClick={() => setActiveFilter("error")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                    activeFilter === "error" ? "bg-rose-600 text-white font-bold shadow-sm" : "hover:bg-rose-50 text-rose-700"
                  }`}
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Needs Category/Fix ({errorCount})</span>
                </div>
              )}

              {missingImageCount > 0 && (
                <div
                  onClick={() => setActiveFilter("no_image")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                    activeFilter === "no_image" ? "bg-amber-600 text-white font-bold shadow-sm" : "hover:bg-amber-50 text-amber-700"
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>No Images ({missingImageCount})</span>
                </div>
              )}
            </div>

            {/* View Mode & Actions */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
              <div className="relative w-48 sm:w-60">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search imported items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs bg-background"
                />
              </div>

              <div className="flex items-center border rounded-lg p-0.5 bg-muted/40">
                <Button
                  variant={viewMode === "split" ? "default" : "ghost"}
                  size="icon"
                  className="h-7 w-7 rounded-md"
                  onClick={() => setViewMode("split")}
                  title="Studio Workspace (Recommended)"
                >
                  <Columns className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-7 w-7 rounded-md"
                  onClick={() => setViewMode("grid")}
                  title="Cards Grid"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleAddManualProduct}
                className="h-8 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
              </Button>
            </div>
          </div>

          {/* Bulk Category Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-muted/30 border rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-muted-foreground">Batch Assign Category:</span>
              <Select value={bulkCategoryToApply} onValueChange={setBulkCategoryToApply}>
                <SelectTrigger className="h-8 w-48 bg-background text-xs">
                  <SelectValue placeholder="Select Category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      {c.label || c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleApplyBulkCategory}
                className="h-8 text-xs font-semibold"
              >
                Apply to Checked Items
              </Button>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Checkbox
                  checked={selectedCount === validCount && validCount > 0}
                  onCheckedChange={(c) => handleSelectAll(!!c)}
                />
                <span>Select all ready items</span>
              </label>
              <span>•</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                className="h-7 text-xs text-muted-foreground"
              >
                Change File
              </Button>
            </div>
          </div>

          {/* MODE 1: SPLIT WORKSPACE STUDIO (LEFT QUEUE, RIGHT STUDIO) */}
          {viewMode === "split" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Product Queue Sidebar */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Import Queue ({filteredProducts.length})
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Click to edit in Studio →
                  </span>
                </div>

                <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
                  {filteredProducts.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground border rounded-2xl bg-card text-xs">
                      No products match your search or filter.
                    </div>
                  ) : (
                    filteredProducts.map((p, idx) => {
                      const isSelected = activeProduct?.id === p.id;
                      const hasImages = (p.localImageFiles && p.localImageFiles.length > 0) || (p.imageUrls && p.imageUrls.length > 0);
                      const displayImg = p.localImagePreviews?.[0] || p.imageUrls?.[0];

                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedProductId(p.id)}
                          className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? "bg-primary/5 border-primary shadow-md ring-1 ring-primary/30"
                              : !p.isValid
                              ? "bg-rose-50/30 border-rose-200 hover:bg-rose-50/60 dark:bg-rose-950/20"
                              : "bg-card hover:border-primary/40 hover:bg-muted/30"
                          }`}
                        >
                          {/* Checkbox for batch */}
                          <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={p.selectedForImport}
                              disabled={!p.isValid}
                              onCheckedChange={() => handleToggleSelect(p.id)}
                            />
                          </div>

                          {/* Image thumbnail */}
                          <div className="relative w-12 h-12 rounded-xl bg-muted/60 border overflow-hidden shrink-0 flex items-center justify-center">
                            {displayImg ? (
                              <Image src={displayImg} alt="" fill className="object-cover" />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-muted-foreground/60" />
                            )}
                            {p.localImagePreviews && p.localImagePreviews.length > 1 && (
                              <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 font-bold rounded-tl">
                                +{p.localImagePreviews.length - 1}
                              </span>
                            )}
                          </div>

                          {/* Product brief */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-bold text-foreground truncate">
                                {p.name || "Untitled Product"}
                              </h4>
                              <span className="text-xs font-extrabold text-foreground shrink-0">
                                ₹{p.price}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span className="font-mono">{p.sku}</span>
                              <span>•</span>
                              <span>Stock: {p.stock}</span>
                            </div>

                            <div className="flex items-center gap-1.5 pt-0.5">
                              {p.resolvedCategoryName ? (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-muted/40">
                                  {p.resolvedCategoryName}
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
                                  No Category
                                </Badge>
                              )}

                              {!hasImages && (
                                <span className="text-[10px] text-amber-600 font-medium">
                                  No image
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(p.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1 rounded transition-opacity"
                            title="Remove product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Active Product Live Studio */}
              <div className="lg:col-span-7">
                {activeProduct ? (
                  <Card className="border shadow-lg rounded-2xl overflow-hidden sticky top-6">
                    {/* Studio Header */}
                    <div className="p-4 bg-muted/30 border-b flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">
                          Product #{activeProductIndex + 1} of {products.length}
                        </span>
                        {activeProduct.isValid ? (
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] gap-1 px-2 py-0.5">
                            <CheckCircle2 className="h-3 w-3" /> Ready
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px] gap-1 px-2 py-0.5">
                            <AlertTriangle className="h-3 w-3" /> Fix: {activeProduct.errors[0]}
                          </Badge>
                        )}
                      </div>

                      {/* Previous / Next Product Buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleNavProduct("prev")}
                          title="Previous product"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleNavProduct("next")}
                          title="Next product"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-6 max-h-[700px] overflow-y-auto">
                      {/* 1. Core Info */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-foreground">
                            Product Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={activeProduct.name}
                            onChange={(e) => updateProductField(activeProduct.id, "name", e.target.value)}
                            placeholder="Product Title..."
                            className="h-10 text-sm font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-foreground">
                              SKU Code <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              value={activeProduct.sku}
                              onChange={(e) => updateProductField(activeProduct.id, "sku", e.target.value)}
                              placeholder="SKU..."
                              className="h-9 text-xs font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-bold text-foreground">
                                Category <span className="text-red-500">*</span>
                              </Label>
                              {activeProduct.resolvedCategoryId && (
                                <button
                                  type="button"
                                  onClick={() => handleApplyCategoryToAll(activeProduct.resolvedCategoryId!)}
                                  className="text-[10px] text-primary hover:underline font-semibold"
                                >
                                  Apply to all products
                                </button>
                              )}
                            </div>
                            <Select
                              value={activeProduct.resolvedCategoryId || ""}
                              onValueChange={(val) => updateProductField(activeProduct.id, "resolvedCategoryId", val)}
                            >
                              <SelectTrigger
                                className={`h-9 text-xs ${
                                  !activeProduct.resolvedCategoryId ? "border-red-500 bg-red-50/20" : ""
                                }`}
                              >
                                <SelectValue placeholder="Select Category..." />
                              </SelectTrigger>
                              <SelectContent className="max-h-60">
                                {categories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id} className="text-xs">
                                    {cat.label || cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Pricing & Stock Grid */}
                        <div className="grid grid-cols-3 gap-3 p-3.5 bg-muted/20 rounded-xl border">
                          <div className="space-y-1">
                            <Label className="text-[11px] font-semibold text-foreground">
                              Sale Price (₹) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={activeProduct.price}
                              onChange={(e) => updateProductField(activeProduct.id, "price", Number(e.target.value))}
                              className="h-9 text-xs font-bold text-foreground"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[11px] font-semibold text-muted-foreground">
                              Compare MRP (₹)
                            </Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={activeProduct.compareAtPrice ?? ""}
                              placeholder="Optional"
                              onChange={(e) =>
                                updateProductField(
                                  activeProduct.id,
                                  "compareAtPrice",
                                  e.target.value ? Number(e.target.value) : undefined
                                )
                              }
                              className="h-9 text-xs"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[11px] font-semibold text-foreground">
                              Stock Units <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              type="number"
                              value={activeProduct.stock}
                              onChange={(e) => updateProductField(activeProduct.id, "stock", Number(e.target.value))}
                              className="h-9 text-xs font-bold text-foreground"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2. Direct Local Image Upload Section */}
                      <div className="space-y-3 p-4 bg-muted/30 rounded-2xl border">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <ImageIcon className="h-4 w-4 text-primary" /> Product Images (Local Upload)
                            </Label>
                            <p className="text-[11px] text-muted-foreground">
                              Attach images from your computer for this product.
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => activeImageInputRef.current?.click()}
                            className="h-8 text-xs font-semibold"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" /> Add Images
                          </Button>
                        </div>

                        <input
                          ref={activeImageInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleAddLocalImages(activeProduct.id, e.target.files)}
                        />

                        {/* Image Tiles Grid */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-1">
                          {/* Attached local previews */}
                          {activeProduct.localImagePreviews?.map((previewUrl, idx) => (
                            <div
                              key={`loc-${idx}`}
                              className="relative aspect-square rounded-xl border bg-muted overflow-hidden group shadow-sm"
                            >
                              <Image src={previewUrl} alt="" fill className="object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveLocalImage(activeProduct.id, idx)}
                                className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              {idx === 0 ? (
                                <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-md font-bold shadow-md flex items-center gap-1 z-10">
                                  <Star className="h-2.5 w-2.5 fill-current text-yellow-300" /> Cover Photo
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverImage(activeProduct.id, idx)}
                                  className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/85 hover:bg-primary text-white text-[10px] py-1 rounded-md font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-1 shadow-lg z-10"
                                >
                                  <Star className="h-2.5 w-2.5 text-yellow-400" /> Make Cover
                                </button>
                              )}
                            </div>
                          ))}

                          {/* Add button tile */}
                          <label
                            onClick={() => activeImageInputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-all p-2 text-center"
                          >
                            <Plus className="h-5 w-5 mb-1" />
                            <span className="text-[10px] font-bold">Upload</span>
                          </label>
                        </div>
                      </div>

                      {/* 3. Description */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-foreground">
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          value={activeProduct.description}
                          onChange={(e) => updateProductField(activeProduct.id, "description", e.target.value)}
                          rows={3}
                          className="text-xs"
                          placeholder="Product description and specifications..."
                        />
                      </div>

                      {/* 4. Optional UI Tabs: Discounts, Shipping/Dimensions, SEO & Policies */}
                      <div className="border rounded-2xl overflow-hidden">
                        <Tabs defaultValue="status" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 h-10 bg-muted/40 rounded-none border-b text-xs">
                            <TabsTrigger value="status" className="text-xs">
                              <Tag className="h-3.5 w-3.5 mr-1" /> Status & Brand
                            </TabsTrigger>
                            <TabsTrigger value="shipping" className="text-xs">
                              <Truck className="h-3.5 w-3.5 mr-1" /> Dimensions
                            </TabsTrigger>
                            <TabsTrigger value="seo" className="text-xs">
                              <ShieldCheck className="h-3.5 w-3.5 mr-1" /> SEO & Policies
                            </TabsTrigger>
                          </TabsList>

                          {/* Tab 1: Status & Brand */}
                          <TabsContent value="status" className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs font-semibold">Brand</Label>
                                <Input
                                  value={activeProduct.brand || ""}
                                  placeholder="Brand..."
                                  onChange={(e) => updateProductField(activeProduct.id, "brand", e.target.value)}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs font-semibold">Condition</Label>
                                <Select
                                  value={activeProduct.condition || "new"}
                                  onValueChange={(val: any) => updateProductField(activeProduct.id, "condition", val)}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new" className="text-xs">New</SelectItem>
                                    <SelectItem value="refurbished" className="text-xs">Refurbished</SelectItem>
                                    <SelectItem value="used" className="text-xs">Used</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                              <div className="flex items-center justify-between p-2.5 bg-muted/20 border rounded-xl">
                                <span className="text-xs font-semibold">Active</span>
                                <Switch
                                  checked={activeProduct.isActive}
                                  onCheckedChange={(c) => updateProductField(activeProduct.id, "isActive", c)}
                                />
                              </div>
                              <div className="flex items-center justify-between p-2.5 bg-muted/20 border rounded-xl">
                                <span className="text-xs font-semibold">Featured</span>
                                <Switch
                                  checked={activeProduct.isFeatured}
                                  onCheckedChange={(c) => updateProductField(activeProduct.id, "isFeatured", c)}
                                />
                              </div>
                              <div className="flex items-center justify-between p-2.5 bg-muted/20 border rounded-xl">
                                <span className="text-xs font-semibold">New Arrival</span>
                                <Switch
                                  checked={activeProduct.isNew}
                                  onCheckedChange={(c) => updateProductField(activeProduct.id, "isNew", c)}
                                />
                              </div>
                              <div className="flex items-center justify-between p-2.5 bg-muted/20 border rounded-xl">
                                <span className="text-xs font-semibold">Bestseller</span>
                                <Switch
                                  checked={activeProduct.isBestseller}
                                  onCheckedChange={(c) => updateProductField(activeProduct.id, "isBestseller", c)}
                                />
                              </div>
                            </div>
                          </TabsContent>

                          {/* Tab 2: Dimensions & Shipping */}
                          <TabsContent value="shipping" className="p-4 space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Weight ({activeProduct.weightUnit || "kg"})</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={activeProduct.weight ?? ""}
                                  placeholder="0.5"
                                  onChange={(e) =>
                                    updateProductField(
                                      activeProduct.id,
                                      "weight",
                                      e.target.value ? Number(e.target.value) : undefined
                                    )
                                  }
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Length (cm)</Label>
                                <Input
                                  type="number"
                                  value={activeProduct.dimensionsLength ?? ""}
                                  placeholder="L"
                                  onChange={(e) =>
                                    updateProductField(
                                      activeProduct.id,
                                      "dimensionsLength",
                                      e.target.value ? Number(e.target.value) : undefined
                                    )
                                  }
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Width (cm)</Label>
                                <Input
                                  type="number"
                                  value={activeProduct.dimensionsWidth ?? ""}
                                  placeholder="W"
                                  onChange={(e) =>
                                    updateProductField(
                                      activeProduct.id,
                                      "dimensionsWidth",
                                      e.target.value ? Number(e.target.value) : undefined
                                    )
                                  }
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Height (cm)</Label>
                                <Input
                                  type="number"
                                  value={activeProduct.dimensionsHeight ?? ""}
                                  placeholder="H"
                                  onChange={(e) =>
                                    updateProductField(
                                      activeProduct.id,
                                      "dimensionsHeight",
                                      e.target.value ? Number(e.target.value) : undefined
                                    )
                                  }
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-6 pt-2">
                              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                <Switch
                                  checked={activeProduct.freeShipping}
                                  onCheckedChange={(c) => updateProductField(activeProduct.id, "freeShipping", c)}
                                />
                                <span>Free Shipping</span>
                              </label>
                              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                <Switch
                                  checked={activeProduct.taxable}
                                  onCheckedChange={(c) => updateProductField(activeProduct.id, "taxable", c)}
                                />
                                <span>Taxable</span>
                              </label>
                            </div>
                          </TabsContent>

                          {/* Tab 3: SEO & Policies */}
                          <TabsContent value="seo" className="p-4 space-y-3">
                            <div className="space-y-1">
                              <Label className="text-xs font-semibold">SEO Meta Title</Label>
                              <Input
                                value={activeProduct.seoMetaTitle || ""}
                                placeholder="Search title..."
                                onChange={(e) => updateProductField(activeProduct.id, "seoMetaTitle", e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-semibold">SEO Meta Description</Label>
                              <Input
                                value={activeProduct.seoMetaDescription || ""}
                                placeholder="Search description..."
                                onChange={(e) => updateProductField(activeProduct.id, "seoMetaDescription", e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <div className="space-y-1">
                                <Label className="text-xs font-semibold">Warranty</Label>
                                <Input
                                  value={activeProduct.warranty || ""}
                                  placeholder="e.g. 6 Months"
                                  onChange={(e) => updateProductField(activeProduct.id, "warranty", e.target.value)}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs font-semibold">Return Policy</Label>
                                <Input
                                  value={activeProduct.returnPolicy || ""}
                                  placeholder="e.g. 7 Days Replacement"
                                  onChange={(e) => updateProductField(activeProduct.id, "returnPolicy", e.target.value)}
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="p-12 text-center text-muted-foreground border rounded-2xl bg-card">
                    Select a product from the queue on the left to edit its details.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODE 2: MODERN CARDS GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => {
                const displayImg = p.localImagePreviews?.[0] || p.imageUrls?.[0];

                return (
                  <Card
                    key={p.id}
                    className={`border rounded-2xl shadow-sm transition-all overflow-hidden ${
                      !p.isValid
                        ? "border-rose-300 bg-rose-50/20"
                        : p.selectedForImport
                        ? "border-primary/50 shadow-md bg-card"
                        : "bg-card"
                    }`}
                  >
                    <div className="p-4 space-y-3">
                      {/* Top Bar with Checkbox & Image */}
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={p.selectedForImport}
                          disabled={!p.isValid}
                          onCheckedChange={() => handleToggleSelect(p.id)}
                          className="mt-1"
                        />

                        {/* Image tile with upload click */}
                        <div className="relative w-16 h-16 rounded-xl bg-muted border overflow-hidden shrink-0 group">
                          {displayImg ? (
                            <Image src={displayImg} alt="" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                              <ImageIcon className="h-6 w-6" />
                            </div>
                          )}
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity text-[10px] font-bold">
                            + Photo
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleAddLocalImages(p.id, e.target.files)}
                            />
                          </label>
                        </div>

                        {/* Title & SKU */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <Input
                            value={p.name}
                            onChange={(e) => updateProductField(p.id, "name", e.target.value)}
                            placeholder="Product title..."
                            className="h-8 text-xs font-bold"
                          />
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {p.sku}
                            </span>
                            {!p.isValid && (
                              <Badge variant="destructive" className="text-[9px] px-1 py-0 h-3.5">
                                Fix Category
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Category Dropdown */}
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase">
                          Category
                        </Label>
                        <Select
                          value={p.resolvedCategoryId || ""}
                          onValueChange={(val) => updateProductField(p.id, "resolvedCategoryId", val)}
                        >
                          <SelectTrigger
                            className={`h-8 text-xs ${!p.resolvedCategoryId ? "border-red-500 bg-red-50/30" : ""}`}
                          >
                            <SelectValue placeholder="Select Category..." />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id} className="text-xs">
                                {cat.label || cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price & Stock Inputs */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-semibold text-muted-foreground">
                            Price (₹)
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={p.price}
                            onChange={(e) => updateProductField(p.id, "price", Number(e.target.value))}
                            className="h-8 text-xs font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-semibold text-muted-foreground">
                            Stock
                          </Label>
                          <Input
                            type="number"
                            value={p.stock}
                            onChange={(e) => updateProductField(p.id, "stock", Number(e.target.value))}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      {/* Switch to split view to configure more */}
                      <div className="pt-2 border-t flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProductId(p.id);
                            setViewMode("split");
                          }}
                          className="h-7 text-xs text-primary font-semibold p-0 hover:bg-transparent"
                        >
                          Open in Full Studio →
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Bottom Sticky Final Action Bar */}
          <div className="sticky bottom-4 z-30 bg-card/95 backdrop-blur border shadow-2xl rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setStep(1)} disabled={isParsing}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Re-upload File
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                <strong className="text-foreground font-bold">{selectedCount}</strong> of {validCount} ready products selected
              </span>
            </div>

            <div className="flex items-center gap-3">
              {errorCount > 0 && (
                <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errorCount} items missing category/data
                </span>
              )}

              <Button
                onClick={handleExecuteImport}
                disabled={selectedCount === 0 || isParsing || isBulkImporting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 h-11 text-base font-bold"
              >
                {isParsing || isBulkImporting ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Publishing {selectedCount} Products...
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Publish {selectedCount} Products to Store
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SUMMARY */}
      {step === 3 && importStats && (
        <Card className="border shadow-xl max-w-3xl mx-auto overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-emerald-500/10 via-primary/10 to-transparent p-8 text-center border-b">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-foreground">Import Completed Successfully!</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Your products have been processed and published to the catalog.
            </p>
          </div>

          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/40 rounded-xl border">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Total Processed</p>
                <p className="text-3xl font-black text-foreground mt-1">{importStats.total}</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200">
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold uppercase">Published to Store</p>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{importStats.success}</p>
              </div>
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200">
                <p className="text-xs text-rose-700 dark:text-rose-300 font-semibold uppercase">Failed</p>
                <p className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">{importStats.failed}</p>
              </div>
            </div>

            {importStats.errors.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-bold text-destructive">Failed Items Breakdown:</Label>
                <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-muted/30 rounded-xl border text-xs">
                  {importStats.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 text-rose-600">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <strong>{err.sku || err.name || `Item #${i + 1}`}:</strong> {err.error}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 pt-4 border-t">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setProducts([]);
                  setStep(1);
                }}
              >
                Import Another Excel File
              </Button>
              <Button
                size="lg"
                onClick={() => router.push("/admin/products")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg px-8"
              >
                Go to Products Catalog
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
