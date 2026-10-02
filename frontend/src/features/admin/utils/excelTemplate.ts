import * as XLSX from "xlsx";

export interface ExcelColumnDefinition {
  key: string;
  header: string;
  required?: boolean;
  type: "string" | "number";
  description: string;
  example: any;
}

// Clean, simplified Excel columns - only core essential fields
export const EXCEL_PRODUCT_COLUMNS: ExcelColumnDefinition[] = [
  {
    key: "name",
    header: "Product Name*",
    required: true,
    type: "string",
    description: "Full title or name of the product",
    example: "Stand Up Kraft Zipper Pouch 250g",
  },
  {
    key: "sku",
    header: "SKU*",
    required: true,
    type: "string",
    description: "Unique SKU / item code",
    example: "KP-POUCH-250G",
  },
  {
    key: "price",
    header: "Sale Price (₹)*",
    required: true,
    type: "number",
    description: "Selling price in INR (greater than 0)",
    example: 499,
  },
  {
    key: "stock",
    header: "Stock Quantity*",
    required: true,
    type: "number",
    description: "Current stock units available",
    example: 150,
  },
  {
    key: "description",
    header: "Full Description*",
    required: true,
    type: "string",
    description: "Detailed product description or specifications",
    example: "Multi-layer barrier kraft paper pouch with food-grade lining and airtight zip seal.",
  },
  {
    key: "category",
    header: "Category*",
    required: true,
    type: "string",
    description: "Category Name or Category ID (see Available Categories sheet)",
    example: "Pouches",
  },
  {
    key: "compareAtPrice",
    header: "Compare Price (₹)",
    required: false,
    type: "number",
    description: "Original MRP for strikethrough display",
    example: 699,
  },
  {
    key: "cost",
    header: "Cost Price (₹)",
    required: false,
    type: "number",
    description: "Cost price per item for profit analytics",
    example: 250,
  },
  {
    key: "brand",
    header: "Brand",
    required: false,
    type: "string",
    description: "Brand or manufacturer name",
    example: "KangPack",
  },
];

export interface ParsedProductRow {
  id: string; // Temporary unique ID for UI tracking
  rowIndex: number;
  name: string;
  sku: string;
  category: string; // Category Name or ID
  resolvedCategoryId?: string;
  resolvedCategoryName?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  stock: number;
  lowStockThreshold?: number;
  brand?: string;
  condition?: "new" | "refurbished" | "used";
  shortDescription?: string;
  description: string;
  // Promotion & Discounts
  discountType?: "none" | "percentage" | "fixed";
  discountValue?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  // Physical & Shipping
  weight?: number;
  weightUnit?: "kg" | "g" | "lb" | "oz";
  dimensionsLength?: number;
  dimensionsWidth?: number;
  dimensionsHeight?: number;
  dimensionsUnit?: "cm" | "m" | "in" | "ft";
  requiresShipping: boolean;
  freeShipping: boolean;
  taxable: boolean;
  taxClass?: string;
  // Status & Visibility
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  isDigital: boolean;
  // SEO & Policies
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoMetaKeywords?: string;
  warranty?: string;
  returnPolicy?: string;
  // Images (Uploaded from Local via UI)
  imageUrls?: string[];
  localImageFiles?: File[];
  localImagePreviews?: string[];
  // Validation state
  isValid: boolean;
  errors: string[];
  warnings: string[];
  selectedForImport: boolean;
}

/**
 * Generates and downloads the simplified clean Excel Product Import Template (.xlsx)
 */
export function generateProductExcelTemplate(
  categories: Array<{ id: string; name: string; slug?: string }>
) {
  const wb = XLSX.utils.book_new();

  // 1. Products Sheet (Header + 2 Sample Rows)
  const productHeaders = EXCEL_PRODUCT_COLUMNS.map((c) => c.header);

  const sampleRow1 = [
    "Stand Up Kraft Zipper Pouch 250g",
    "KP-POUCH-250G",
    499,
    150,
    "Multi-layer barrier kraft paper pouch with food-grade lining and airtight zip seal.",
    categories.length > 0 ? categories[0].name : "Pouches",
    699,
    250,
    "KangPack",
  ];

  const sampleRow2 = [
    "Heavy-Duty Corrugated Shipping Box (10x8x6 in)",
    "KP-BOX-1086",
    899,
    200,
    "3-ply high burst strength corrugated shipping carton box for ecommerce parcel deliveries.",
    categories.length > 1 ? categories[1].name : "Boxes",
    1199,
    450,
    "KangPack",
  ];

  const productsWs = XLSX.utils.aoa_to_sheet([productHeaders, sampleRow1, sampleRow2]);

  // Optimal column widths
  productsWs["!cols"] = [
    { wch: 36 }, // Name
    { wch: 18 }, // SKU
    { wch: 16 }, // Sale Price
    { wch: 16 }, // Stock
    { wch: 50 }, // Description
    { wch: 22 }, // Category
    { wch: 18 }, // Compare Price
    { wch: 16 }, // Cost Price
    { wch: 18 }, // Brand
  ];

  XLSX.utils.book_append_sheet(wb, productsWs, "Products");

  // 2. Available Categories Reference Sheet
  const categoryHeaders = ["Category Name", "Category ID", "Slug"];
  const categoryRows = categories.map((cat) => [cat.name, cat.id, cat.slug || "-"]);
  const categoriesWs = XLSX.utils.aoa_to_sheet([categoryHeaders, ...categoryRows]);
  categoriesWs["!cols"] = [{ wch: 30 }, { wch: 30 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, categoriesWs, "Available Categories");

  // 3. Simple Instructions Sheet
  const guideHeaders = ["Field", "Required?", "Details"];
  const guideRows = [
    ["Product Name*", "YES (Mandatory)", "Name of the product."],
    ["SKU*", "YES (Mandatory)", "Unique stock identifier. Must not duplicate existing products."],
    ["Category*", "YES (Mandatory)", "Category name or ID from Available Categories sheet (e.g. Pouches, Boxes)."],
    ["Sale Price (₹)*", "YES (Mandatory)", "Price customers pay in INR."],
    ["Stock Quantity*", "YES (Mandatory)", "Available stock units count."],
    ["Full Description*", "YES (Mandatory)", "Detailed product specifications."],
    ["Compare Price", "Optional", "Original MRP for strikethrough badge."],
    ["Cost Price", "Optional", "Your internal purchasing / production cost."],
    ["Brand", "Optional", "Brand or supplier name."],
    ["Images & Media", "UI Upload", "Upload product images directly from your computer in the preview studio."],
    ["Advanced Fields", "UI Options", "Discounts, dimensions, weight, SEO tags, and status switches can all be adjusted in the preview editor."],
  ];

  const guideWs = XLSX.utils.aoa_to_sheet([guideHeaders, ...guideRows]);
  guideWs["!cols"] = [{ wch: 24 }, { wch: 16 }, { wch: 65 }];
  XLSX.utils.book_append_sheet(wb, guideWs, "Instructions");

  // Save / Trigger Download
  XLSX.writeFile(wb, "kangpack_product_import_template.xlsx");
}

function normalizeHeader(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Parses an Excel or CSV file into validated ParsedProductRow items
 */
export async function parseProductExcelFile(
  file: File,
  categories: Array<{ id: string; name: string; slug?: string }>,
  defaultCategoryId?: string
): Promise<{ rows: ParsedProductRow[]; totalRows: number; validRows: number; errorRows: number }> {
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: "array", cellDates: true });

  const sheetName = wb.SheetNames.includes("Products") ? "Products" : wb.SheetNames[0];
  const worksheet = wb.Sheets[sheetName];

  if (!worksheet) {
    throw new Error("No readable sheet found in the uploaded Excel file.");
  }

  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  if (!rawRows || rawRows.length === 0) {
    throw new Error("The uploaded Excel sheet contains no data rows.");
  }

  const categoryMap = new Map<string, { id: string; name: string }>();
  categories.forEach((c) => {
    categoryMap.set(c.id.toLowerCase(), c);
    categoryMap.set(c.name.toLowerCase().trim(), c);
    if (c.slug) categoryMap.set(c.slug.toLowerCase().trim(), c);
  });

  const parsedRows: ParsedProductRow[] = [];
  const seenSkus = new Set<string>();

  rawRows.forEach((row, idx) => {
    const rowKeys = Object.keys(row);
    const getVal = (...possibleHeaders: string[]): any => {
      for (const ph of possibleHeaders) {
        const normalizedPh = normalizeHeader(ph);
        const matchedKey = rowKeys.find((k) => normalizeHeader(k) === normalizedPh);
        if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== "") {
          return row[matchedKey];
        }
      }
      return "";
    };

    const name = String(getVal("Product Name*", "Product Name", "name", "title", "item")).trim();
    const sku = String(getVal("SKU*", "SKU", "sku", "code", "item_code")).trim();
    let categoryInput = String(getVal("Category*", "Category", "category", "category_id", "category_name")).trim();
    const rawPrice = getVal("Sale Price (₹)*", "Sale Price", "Price*", "price", "sale_price", "rate");
    const rawComparePrice = getVal("Compare Price (₹)", "Compare At Price (₹)", "Compare At Price", "compareAtPrice", "compare_price", "mrp");
    const rawCost = getVal("Cost Price (₹)", "Cost per Item (₹)", "Cost", "cost", "purchase_price");
    const rawStock = getVal("Stock Quantity*", "Stock Quantity", "Stock*", "stock", "quantity", "qty");
    const brand = String(getVal("Brand", "brand", "manufacturer")).trim();
    const description = String(getVal("Full Description*", "Full Description", "Description*", "description", "details")).trim();

    // Validations & error tracking
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!name) {
      errors.push("Product Name is required");
    }

    if (!sku) {
      errors.push("SKU is required");
    } else {
      const skuLower = sku.toLowerCase();
      if (seenSkus.has(skuLower)) {
        errors.push(`Duplicate SKU "${sku}" found in file`);
      } else {
        seenSkus.add(skuLower);
      }
    }

    const price = Number(rawPrice);
    if (rawPrice === "" || isNaN(price) || price < 0) {
      errors.push("Valid positive Price is required");
    }

    const compareAtPrice = rawComparePrice !== "" && !isNaN(Number(rawComparePrice)) ? Number(rawComparePrice) : undefined;
    if (compareAtPrice !== undefined && compareAtPrice < price) {
      warnings.push("Compare price is lower than sale price");
    }

    const cost = rawCost !== "" && !isNaN(Number(rawCost)) ? Number(rawCost) : undefined;

    const stock = Number(rawStock);
    if (rawStock === "" || isNaN(stock) || stock < 0) {
      errors.push("Valid positive Stock is required");
    }

    if (!description) {
      errors.push("Full Description is required");
    }

    // Resolve Category (Mandatory)
    if (!categoryInput && defaultCategoryId) {
      categoryInput = defaultCategoryId;
    }

    let resolvedCat = categoryInput ? categoryMap.get(categoryInput.toLowerCase().trim()) : undefined;
    if (!resolvedCat && defaultCategoryId) {
      resolvedCat = categoryMap.get(defaultCategoryId.toLowerCase());
    }

    if (!resolvedCat) {
      if (!categoryInput) {
        errors.push("Category is required (select in file or studio)");
      } else {
        errors.push(`Category "${categoryInput}" not found in store`);
      }
    }

    const parsedRow: ParsedProductRow = {
      id: `row-${idx + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      rowIndex: idx + 2,
      name,
      sku,
      category: categoryInput,
      resolvedCategoryId: resolvedCat?.id,
      resolvedCategoryName: resolvedCat?.name,
      price: isNaN(price) ? 0 : price,
      compareAtPrice,
      cost,
      stock: isNaN(stock) ? 0 : stock,
      lowStockThreshold: 5,
      brand: brand || undefined,
      condition: "new",
      shortDescription: "",
      description: description || name,
      // Default initial states for optional UI fields
      discountType: "none",
      discountValue: undefined,
      weight: undefined,
      weightUnit: "kg",
      dimensionsUnit: "cm",
      isActive: true,
      isFeatured: false,
      isNew: false,
      isBestseller: false,
      isDigital: false,
      requiresShipping: true,
      freeShipping: false,
      taxable: true,
      taxClass: "",
      warranty: "",
      returnPolicy: "",
      seoMetaTitle: "",
      seoMetaDescription: "",
      imageUrls: [],
      localImageFiles: [],
      localImagePreviews: [],
      isValid: errors.length === 0,
      errors,
      warnings,
      selectedForImport: errors.length === 0,
    };

    parsedRows.push(parsedRow);
  });

  const validRows = parsedRows.filter((r) => r.isValid).length;
  const errorRows = parsedRows.filter((r) => !r.isValid).length;

  return {
    rows: parsedRows,
    totalRows: parsedRows.length,
    validRows,
    errorRows,
  };
}
