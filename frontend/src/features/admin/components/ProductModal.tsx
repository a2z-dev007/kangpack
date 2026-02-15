"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminCategories,
  useCreateProduct,
  useUpdateProduct,
} from "../queries";
import {
  Loader2,
  Plus,
  X,
  Package,
  DollarSign,
  Truck,
  Search,
  Tag,
  Info,
} from "lucide-react";
import Image from "next/image";

const productSchema = z.object({
  // Basic Info
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  condition: z.enum(["new", "refurbished", "used"]).optional(),

  // Pricing
  price: z.coerce.number().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().min(0).optional(),
  cost: z.coerce.number().min(0).optional(),

  // Discounts
  discountType: z.enum(["percentage", "fixed", "none"]).optional(),
  discountValue: z.coerce.number().min(0).optional(),
  discountStartDate: z.string().optional(),
  discountEndDate: z.string().optional(),

  // Inventory
  stock: z.coerce.number().min(0, "Stock must be positive"),
  lowStockThreshold: z.coerce.number().min(0).optional(),
  trackQuantity: z.boolean().optional(),
  allowBackorder: z.boolean().optional(),
  backorderLimit: z.coerce.number().min(0).optional(),
  inventoryPolicy: z.enum(["deny", "continue"]).optional(),

  // Physical Properties
  weight: z.coerce.number().min(0).optional(),
  weightUnit: z.enum(["kg", "g", "lb", "oz"]).optional(),
  dimensionsLength: z.coerce.number().min(0).optional(),
  dimensionsWidth: z.coerce.number().min(0).optional(),
  dimensionsHeight: z.coerce.number().min(0).optional(),
  dimensionsUnit: z.enum(["cm", "m", "in", "ft"]).optional(),

  // Shipping & Tax
  requiresShipping: z.boolean().optional(),
  freeShipping: z.boolean().optional(),
  shippingClass: z.string().optional(),
  taxable: z.boolean().optional(),
  taxClass: z.string().optional(),

  // Status & Visibility
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isDigital: z.boolean().optional(),

  // SEO
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  seoMetaKeywords: z.string().optional(),
  seoCanonicalUrl: z.string().optional(),

  // Additional Info
  warranty: z.string().optional(),
  returnPolicy: z.string().optional(),
  reviewsEnabled: z.boolean().optional(),

  // Availability
  availableFrom: z.string().optional(),
  availableUntil: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const isEditing = !!product;
  const [activeTab, setActiveTab] = useState("basic");
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useAdminCategories();

  const categories = useMemo(() => {
    const rawData = categoriesData?.data || [];
    const flatten = (items: any[], level = 0): any[] => {
      let flat: any[] = [];
      items.forEach((item) => {
        flat.push({
          ...item,
          label:
            level > 0 ? `${"  ".repeat(level * 2)}${item.name}` : item.name,
          level,
        });
        if (item.subcategories && item.subcategories.length > 0) {
          flat = [...flat, ...flatten(item.subcategories, level + 1)];
        }
      });
      return flat;
    };

    const flatList = flatten(rawData);
    const seen = new Set();
    return flatList.filter((item) => {
      const id = item.id || item._id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [categoriesData]);

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      sku: "",
      category: "",
      brand: "",
      condition: "new",
      price: 0,
      compareAtPrice: 0,
      cost: 0,
      discountType: "none",
      discountValue: 0,
      stock: 0,
      lowStockThreshold: 5,
      trackQuantity: true,
      allowBackorder: false,
      inventoryPolicy: "deny",
      weight: 0,
      weightUnit: "kg",
      dimensionsUnit: "cm",
      requiresShipping: true,
      freeShipping: false,
      taxable: true,
      isActive: true,
      isFeatured: false,
      isNew: false,
      isBestseller: false,
      isDigital: false,
      reviewsEnabled: true,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription || "",
        sku: product.sku,
        category: product.category?._id || product.category,
        brand: product.brand || "",
        condition: product.condition || "new",
        price: product.price,
        compareAtPrice: product.compareAtPrice || 0,
        cost: product.cost || 0,
        discountType: product.discountType || "none",
        discountValue: product.discountValue || 0,
        discountStartDate: product.discountStartDate
          ? product.discountStartDate.split("T")[0]
          : "",
        discountEndDate: product.discountEndDate
          ? product.discountEndDate.split("T")[0]
          : "",
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold || 5,
        trackQuantity: product.trackQuantity ?? true,
        allowBackorder: product.allowBackorder || false,
        backorderLimit: product.backorderLimit || 0,
        inventoryPolicy: product.inventoryPolicy || "deny",
        weight: product.weight || 0,
        weightUnit: product.weightUnit || "kg",
        dimensionsLength: product.dimensions?.length || 0,
        dimensionsWidth: product.dimensions?.width || 0,
        dimensionsHeight: product.dimensions?.height || 0,
        dimensionsUnit: product.dimensions?.unit || "cm",
        requiresShipping: product.requiresShipping ?? true,
        freeShipping: product.freeShipping || false,
        shippingClass: product.shippingClass || "",
        taxable: product.taxable ?? true,
        taxClass: product.taxClass || "",
        isActive: product.isActive,
        isFeatured: product.isFeatured || false,
        isNew: product.isNew || false,
        isBestseller: product.isBestseller || false,
        isDigital: product.isDigital || false,
        seoMetaTitle: product.seo?.metaTitle || "",
        seoMetaDescription: product.seo?.metaDescription || "",
        seoMetaKeywords: product.seo?.metaKeywords || "",
        seoCanonicalUrl: product.seo?.canonicalUrl || "",
        warranty: product.warranty || "",
        returnPolicy: product.returnPolicy || "",
        reviewsEnabled: product.reviewsEnabled ?? true,
        availableFrom: product.availableFrom
          ? product.availableFrom.split("T")[0]
          : "",
        availableUntil: product.availableUntil
          ? product.availableUntil.split("T")[0]
          : "",
      });
    } else {
      form.reset();
    }
  }, [product, form]);

  const onSubmit = (values: ProductFormValues) => {
    const formData = new FormData();

    // Basic fields
    formData.append("name", values.name);
    formData.append("description", values.description);
    if (values.shortDescription)
      formData.append("shortDescription", values.shortDescription);
    formData.append("sku", values.sku);
    formData.append("category", values.category);
    if (values.brand) formData.append("brand", values.brand);
    if (values.condition) formData.append("condition", values.condition);

    // Pricing
    formData.append("price", String(values.price));
    if (values.compareAtPrice)
      formData.append("compareAtPrice", String(values.compareAtPrice));
    if (values.cost) formData.append("cost", String(values.cost));

    // Discounts
    if (values.discountType)
      formData.append("discountType", values.discountType);
    if (values.discountValue)
      formData.append("discountValue", String(values.discountValue));
    if (values.discountStartDate)
      formData.append("discountStartDate", values.discountStartDate);
    if (values.discountEndDate)
      formData.append("discountEndDate", values.discountEndDate);

    // Inventory
    formData.append("stock", String(values.stock));
    if (values.lowStockThreshold)
      formData.append("lowStockThreshold", String(values.lowStockThreshold));
    formData.append("trackQuantity", String(values.trackQuantity));
    formData.append("allowBackorder", String(values.allowBackorder));
    if (values.backorderLimit)
      formData.append("backorderLimit", String(values.backorderLimit));
    if (values.inventoryPolicy)
      formData.append("inventoryPolicy", values.inventoryPolicy);

    // Physical Properties
    if (values.weight) formData.append("weight", String(values.weight));
    if (values.weightUnit) formData.append("weightUnit", values.weightUnit);
    if (
      values.dimensionsLength ||
      values.dimensionsWidth ||
      values.dimensionsHeight
    ) {
      formData.append(
        "dimensions[length]",
        String(values.dimensionsLength || 0),
      );
      formData.append("dimensions[width]", String(values.dimensionsWidth || 0));
      formData.append(
        "dimensions[height]",
        String(values.dimensionsHeight || 0),
      );
      if (values.dimensionsUnit)
        formData.append("dimensions[unit]", values.dimensionsUnit);
    }

    // Shipping & Tax
    formData.append("requiresShipping", String(values.requiresShipping));
    formData.append("freeShipping", String(values.freeShipping));
    if (values.shippingClass)
      formData.append("shippingClass", values.shippingClass);
    formData.append("taxable", String(values.taxable));
    if (values.taxClass) formData.append("taxClass", values.taxClass);

    // Status & Visibility
    formData.append("isActive", String(values.isActive));
    formData.append("isFeatured", String(values.isFeatured));
    formData.append("isNew", String(values.isNew));
    formData.append("isBestseller", String(values.isBestseller));
    formData.append("isDigital", String(values.isDigital));

    // SEO
    if (values.seoMetaTitle)
      formData.append("seo[metaTitle]", values.seoMetaTitle);
    if (values.seoMetaDescription)
      formData.append("seo[metaDescription]", values.seoMetaDescription);
    if (values.seoMetaKeywords)
      formData.append("seo[metaKeywords]", values.seoMetaKeywords);
    if (values.seoCanonicalUrl)
      formData.append("seo[canonicalUrl]", values.seoCanonicalUrl);

    // Additional Info
    if (values.warranty) formData.append("warranty", values.warranty);
    if (values.returnPolicy)
      formData.append("returnPolicy", values.returnPolicy);
    formData.append("reviewsEnabled", String(values.reviewsEnabled));

    // Availability
    if (values.availableFrom)
      formData.append("availableFrom", values.availableFrom);
    if (values.availableUntil)
      formData.append("availableUntil", values.availableUntil);

    // Append files
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    if (isEditing) {
      const productId = product._id || product.id;
      console.log("Updating product with ID:", productId);
      console.log("Product object:", product);

      if (!productId) {
        console.error("No valid product ID found!", product);
        return;
      }

      updateProduct(
        { id: productId, data: formData },
        {
          onSuccess: () => {
            form.reset();
            onClose();
            setSelectedFiles([]);
            setPreviewUrls([]);
          },
        },
      );
    } else {
      createProduct(formData, {
        onSuccess: () => {
          form.reset();
          onClose();
          setSelectedFiles([]);
          setPreviewUrls([]);
        },
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...urls]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {isEditing ? "Edit Product" : "Add New Product"}
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="basic" className="text-xs">
                  <Package className="h-3 w-3 mr-1" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="pricing" className="text-xs">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Pricing
                </TabsTrigger>
                <TabsTrigger value="inventory" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  Inventory
                </TabsTrigger>
                <TabsTrigger value="shipping" className="text-xs">
                  <Truck className="h-3 w-3 mr-1" />
                  Shipping
                </TabsTrigger>
                <TabsTrigger value="seo" className="text-xs">
                  <Search className="h-3 w-3 mr-1" />
                  SEO
                </TabsTrigger>
                <TabsTrigger value="additional" className="text-xs">
                  <Info className="h-3 w-3 mr-1" />
                  More
                </TabsTrigger>
              </TabsList>

              {/* BASIC INFO TAB */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Product Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter brand name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          SKU <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="PROD-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Category <span className="text-red-500">*</span>
                        </FormLabel>
                        {isLoadingCategories ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border rounded-md">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading...
                          </div>
                        ) : categories.length === 0 ? (
                          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                            No categories found.{" "}
                            <a
                              href="/admin/categories"
                              className="underline font-semibold"
                            >
                              Create one
                            </a>{" "}
                            first.
                          </div>
                        ) : (
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="">Select a category</option>
                              {categories.map((c: any) => (
                                <option
                                  key={c.id || c._id}
                                  value={c.id || c._id}
                                >
                                  {c.label || c.name}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Condition</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="refurbished">
                            Refurbished
                          </SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief summary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Description <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed product description"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Product Images</FormLabel>
                  <div className="grid grid-cols-4 gap-4">
                    {product?.images?.map((url: string, index: number) => (
                      <div
                        key={`existing-${index}`}
                        className="relative aspect-square rounded-md overflow-hidden border"
                      >
                        <Image
                          src={
                            url.startsWith("http")
                              ? url
                              : `http://localhost:8000/${url}`
                          }
                          alt={`Existing ${index}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {previewUrls.map((url, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative aspect-square rounded-md overflow-hidden border"
                      >
                        <Image
                          src={url}
                          alt={`Preview ${index}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed cursor-pointer hover:border-primary/50">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">
                        Add
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
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
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel className="mt-0">Featured</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel className="mt-0">New</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isBestseller"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel className="mt-0">Bestseller</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* PRICING TAB */}
              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Sale Price <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="compareAtPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compare Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Original/MSRP price
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Your cost
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-4">Discount Settings</h3>

                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No Discount</SelectItem>
                            <SelectItem value="percentage">
                              Percentage Off
                            </SelectItem>
                            <SelectItem value="fixed">
                              Fixed Amount Off
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("discountType") !== "none" && (
                    <>
                      <FormField
                        control={form.control}
                        name="discountValue"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Discount Value</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder={
                                  form.watch("discountType") === "percentage"
                                    ? "e.g., 20"
                                    : "e.g., 50"
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              {form.watch("discountType") === "percentage"
                                ? "Percentage (e.g., 20 for 20%)"
                                : "Fixed amount in currency"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="discountStartDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="discountEndDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* INVENTORY TAB */}
              <TabsContent value="inventory" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Stock Quantity <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lowStockThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Low Stock Alert</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Alert when stock falls below this
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="trackQuantity"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Track Quantity
                        </FormLabel>
                        <FormDescription>
                          Monitor stock levels for this product
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

                <FormField
                  control={form.control}
                  name="allowBackorder"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Allow Backorder
                        </FormLabel>
                        <FormDescription>
                          Sell even when out of stock
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

                {form.watch("allowBackorder") && (
                  <FormField
                    control={form.control}
                    name="backorderLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Backorder Limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Leave empty for unlimited"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="inventoryPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>When Out of Stock</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="deny">Stop Selling</SelectItem>
                          <SelectItem value="continue">
                            Continue Selling
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* SHIPPING TAB */}
              <TabsContent value="shipping" className="space-y-4">
                <FormField
                  control={form.control}
                  name="isDigital"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Digital Product
                        </FormLabel>
                        <FormDescription>
                          No physical shipping required
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

                {!form.watch("isDigital") && (
                  <>
                    <FormField
                      control={form.control}
                      name="requiresShipping"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Requires Shipping
                            </FormLabel>
                            <FormDescription>
                              This product needs to be shipped
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

                    <FormField
                      control={form.control}
                      name="freeShipping"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Free Shipping
                            </FormLabel>
                            <FormDescription>
                              No shipping charges for this product
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

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-4">
                        Physical Properties
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="weightUnit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="kg">
                                    Kilograms (kg)
                                  </SelectItem>
                                  <SelectItem value="g">Grams (g)</SelectItem>
                                  <SelectItem value="lb">
                                    Pounds (lb)
                                  </SelectItem>
                                  <SelectItem value="oz">
                                    Ounces (oz)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="mt-4">
                        <FormLabel className="mb-2 block">Dimensions</FormLabel>
                        <div className="grid grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name="dimensionsLength"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Length"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dimensionsWidth"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Width"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dimensionsHeight"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Height"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dimensionsUnit"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="cm">cm</SelectItem>
                                    <SelectItem value="m">m</SelectItem>
                                    <SelectItem value="in">in</SelectItem>
                                    <SelectItem value="ft">ft</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="shippingClass"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Class</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Standard, Express, Fragile"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Tax Settings</h3>

                  <FormField
                    control={form.control}
                    name="taxable"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Taxable</FormLabel>
                          <FormDescription>
                            Charge tax on this product
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

                  {form.watch("taxable") && (
                    <FormField
                      control={form.control}
                      name="taxClass"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Tax Class</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Standard, Reduced, Zero"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </TabsContent>

              {/* SEO TAB */}
              <TabsContent value="seo" className="space-y-4">
                <FormField
                  control={form.control}
                  name="seoMetaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SEO title (max 60 characters)"
                          maxLength={60}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {field.value?.length || 0}/60 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seoMetaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="SEO description (max 160 characters)"
                          maxLength={160}
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {field.value?.length || 0}/160 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seoMetaKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="keyword1, keyword2, keyword3"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Comma-separated keywords
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seoCanonicalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/product"
                          type="url"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Preferred URL for search engines
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* ADDITIONAL TAB */}
              <TabsContent value="additional" className="space-y-4">
                <FormField
                  control={form.control}
                  name="warranty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 1 year manufacturer warranty"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="returnPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Policy</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 30-day money-back guarantee"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reviewsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Reviews
                        </FormLabel>
                        <FormDescription>
                          Allow customers to review this product
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

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Availability Schedule</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="availableFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available From</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Product becomes available on this date
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="availableUntil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Until</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Product stops being available on this date
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <SheetFooter className="pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create Product"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
