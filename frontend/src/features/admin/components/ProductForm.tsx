"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  IndianRupee,
  Truck,
  Search,
  Tag,
  Info,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

interface ProductFormProps {
  product?: any;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const isEditing = !!product;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const { data: categoriesData, isLoading: isLoadingCategories } = useAdminCategories();

  const categories = useMemo(() => {
    const rawData = categoriesData?.data || [];
    const flatten = (items: any[], level = 0): any[] => {
      let flat: any[] = [];
      items.forEach((item) => {
        flat.push({
          ...item,
          label: level > 0 ? `${"  ".repeat(level * 2)}${item.name}` : item.name,
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
    mode: "onChange",
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
        discountStartDate: product.discountStartDate ? product.discountStartDate.split("T")[0] : "",
        discountEndDate: product.discountEndDate ? product.discountEndDate.split("T")[0] : "",
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
        availableFrom: product.availableFrom ? product.availableFrom.split("T")[0] : "",
        availableUntil: product.availableUntil ? product.availableUntil.split("T")[0] : "",
      });
    }
  }, [product, form]);

  const onSubmit = (values: ProductFormValues) => {
    const formData = new FormData();

    // Basic fields
    formData.append("name", values.name);
    formData.append("description", values.description);
    if (values.shortDescription)
      formData.append("shortDescription", values.shortDescription);
    formData.append("sku", values.sku || "");
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
      formData.append("inventoryPolicy", values.inventoryPolicy || "deny");

    // Physical Properties
    if (values.weight) formData.append("weight", String(values.weight));
    if (values.weightUnit) formData.append("weightUnit", values.weightUnit);
    
    if (values.dimensionsLength) formData.append("dimensions[length]", String(values.dimensionsLength));
    if (values.dimensionsWidth) formData.append("dimensions[width]", String(values.dimensionsWidth));
    if (values.dimensionsHeight) formData.append("dimensions[height]", String(values.dimensionsHeight));
    if (values.dimensionsUnit) formData.append("dimensions[unit]", values.dimensionsUnit);

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
      updateProduct({ id: product._id || product.id, data: formData }, {
        onSuccess: () => {
          onSuccess?.() || router.push("/admin/products");
        },
      });
    } else {
      createProduct(formData, {
        onSuccess: () => {
          onSuccess?.() || router.push("/admin/products");
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

  const tabs = ["basic", "pricing", "inventory", "shipping", "seo", "additional"];
  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const isFormValid = form.formState.isValid;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? `Edit: ${product.name}` : "Create New Product"}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-card rounded-xl border shadow-sm p-6">
            <TabsList className="grid w-full grid-cols-6 mb-8 h-12">
              <TabsTrigger value="basic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Package className="h-4 w-4 mr-2" /> Basic
              </TabsTrigger>
              <TabsTrigger value="pricing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <IndianRupee className="h-4 w-4 mr-2" /> Pricing
              </TabsTrigger>
              <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Tag className="h-4 w-4 mr-2" /> Inventory
              </TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Truck className="h-4 w-4 mr-2" /> Shipping
              </TabsTrigger>
              <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Search className="h-4 w-4 mr-2" /> SEO
              </TabsTrigger>
              <TabsTrigger value="additional" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Info className="h-4 w-4 mr-2" /> More
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl><Input placeholder="E.g. Wireless Headphones" {...field} className="h-11" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="brand" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl><Input placeholder="E.g. Sony" {...field} className="h-11" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="sku" render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU <span className="text-red-500">*</span></FormLabel>
                    <FormControl><Input placeholder="PROD-001" {...field} className="h-11" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <select {...field} className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="">Select a category</option>
                        {categories.map((c: any) => (
                          <option key={c.id || c._id} value={c.id || c._id}>{c.label || c.name}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="condition" render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Select condition" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="shortDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl><Input placeholder="A brief summary..." {...field} className="h-11" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description <span className="text-red-500">*</span></FormLabel>
                  <FormControl><Textarea placeholder="Detailed product specifications..." className="min-h-[150px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="space-y-4">
                <FormLabel>Product Images</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {product?.images?.map((url: string, index: number) => (
                    <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden border bg-muted">
                      <Image src={url.startsWith("http") ? url : `http://localhost:8000/${url}`} alt="" fill className="object-cover" />
                    </div>
                  ))}
                  {previewUrls.map((url, index) => (
                    <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden border bg-muted shadow-sm group">
                      <Image src={url} alt="" fill className="object-cover" />
                      <button type="button" onClick={() => removeFile(index)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Add Image</span>
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 p-4 bg-muted/30 rounded-lg">
                <FormField control={form.control} name="isActive" render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel>Active</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isFeatured" render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel>Featured</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isNew" render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel>New Arrival</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isBestseller" render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel>Bestseller</FormLabel>
                  </FormItem>
                )} />
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price (₹) <span className="text-red-500">*</span></FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} className="h-11" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="compareAtPrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (₹)</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} className="h-11" /></FormControl>
                    <FormDescription>Shows as strikethrough</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cost" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost per Item (₹)</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} className="h-11" /></FormControl>
                    <FormDescription>Customers won't see this</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="p-6 border rounded-xl space-y-6">
                <h3 className="text-lg font-semibold">Promotion / Discounts</h3>
                <FormField control={form.control} name="discountType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="h-11"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Discount</SelectItem>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                {form.watch("discountType") !== "none" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
                    <FormField control={form.control} name="discountValue" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl><Input type="number" step="0.01" {...field} className="h-11" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="discountStartDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starts On</FormLabel>
                        <FormControl><Input type="date" {...field} className="h-11" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="discountEndDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expires On</FormLabel>
                        <FormControl><Input type="date" {...field} className="h-11" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="stock" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity <span className="text-red-500">*</span></FormLabel>
                    <FormControl><Input type="number" {...field} className="h-11" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lowStockThreshold" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Warning Level</FormLabel>
                    <FormControl><Input type="number" {...field} className="h-11" /></FormControl>
                    <FormDescription>Alert will trigger at this level</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="trackQuantity" render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-4 border rounded-xl">
                    <div className="space-y-0.5"><FormLabel className="text-base">Track Quantity</FormLabel><FormDescription>Automatic stock reduction on orders</FormDescription></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="allowBackorder" render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-4 border rounded-xl">
                    <div className="space-y-0.5"><FormLabel className="text-base">Allow Backorders</FormLabel><FormDescription>Customers can buy even if out of stock</FormDescription></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
              </div>

              {form.watch("allowBackorder") && (
                <FormField control={form.control} name="backorderLimit" render={({ field }) => (
                  <FormItem className="animate-in fade-in slide-in-from-top-2">
                    <FormLabel>Max Backorders Allowed</FormLabel>
                    <FormControl><Input type="number" placeholder="Leave empty for infinity" {...field} className="h-11" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </TabsContent>

            <TabsContent value="shipping" className="space-y-6">
              <FormField control={form.control} name="isDigital" render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border rounded-xl bg-blue-50/50 border-blue-100">
                  <div className="space-y-0.5"><FormLabel className="text-base">Digital Service / File</FormLabel><FormDescription>Product does not require physical logistics</FormDescription></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />

              {!form.watch("isDigital") && (
                <div className="space-y-8 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="requiresShipping" render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-4 border rounded-xl"><div className="space-y-0.5"><FormLabel>Requires Shipping</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="freeShipping" render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-4 border rounded-xl"><div className="space-y-0.5"><FormLabel>Free Delivery</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <FormField control={form.control} name="weight" render={({ field }) => (
                      <FormItem><FormLabel>Weight</FormLabel><FormControl><Input type="number" step="0.01" {...field} className="h-11" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="weightUnit" render={({ field }) => (
                      <FormItem><FormLabel>Unit</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-11"><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="g">g</SelectItem><SelectItem value="lb">lb</SelectItem></SelectContent></Select></FormItem>
                    )} />
                  </div>

                  <div className="space-y-4">
                    <FormLabel>Dimensions (L × W × H)</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <FormField control={form.control} name="dimensionsLength" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="L" {...field} className="h-11" /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="dimensionsWidth" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="W" {...field} className="h-11" /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="dimensionsHeight" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="H" {...field} className="h-11" /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="dimensionsUnit" render={({ field }) => (
                        <FormItem className="md:col-span-2"><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-11"><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="cm">cm</SelectItem><SelectItem value="in">in</SelectItem></SelectContent></Select></FormItem>
                      )} />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <FormField control={form.control} name="seoMetaTitle" render={({ field }) => (
                <FormItem><FormLabel>Meta Title</FormLabel><FormControl><Input placeholder="Page title in search results"  {...field} className="h-11" /></FormControl><FormDescription>{field.value?.length || 0}/200</FormDescription></FormItem>
              )} />
              <FormField control={form.control} name="seoMetaDescription" render={({ field }) => (
                <FormItem><FormLabel>Meta Description</FormLabel><FormControl><Textarea placeholder="Brief summary for Google"  className="min-h-[100px]" {...field} /></FormControl><FormDescription>{field.value?.length || 0}/1000</FormDescription></FormItem>
              )} />
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <FormField control={form.control} name="warranty" render={({ field }) => (
                <FormItem><FormLabel>Warranty Policy</FormLabel><FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="returnPolicy" render={({ field }) => (
                <FormItem><FormLabel>Return Policy</FormLabel><FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl></FormItem>
              )} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end items-center gap-4 py-6 border-t bg-background sticky bottom-0 z-10">
            <Button type="button" variant="outline" size="lg" onClick={() => router.back()} disabled={isLoading} className="px-10">
              Discard
            </Button>
            
            {activeTab !== "additional" ? (
              <Button 
                type="button" 
                size="lg" 
                onClick={handleNext}
                disabled={!isFormValid}
                className="px-10 shadow-lg shadow-primary/20"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                type="submit" 
                size="lg" 
                disabled={isLoading || !isFormValid} 
                className="px-10 shadow-lg shadow-primary/20"
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isEditing ? "Update Product" : "Publish Product"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
