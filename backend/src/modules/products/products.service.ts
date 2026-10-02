import { Product, IProduct, Category } from '../../database';
import { AppError } from '../../common/middlewares/error.middleware';
import { HTTP_STATUS, MESSAGES } from '../../common/constants';
import { PaginationUtils, SlugUtils } from '../../common/utils';
import { PaginationQuery, FilterQuery } from '../../common/types';
import { S3Service } from '../../common/services/s3.service';
export interface CreateProductData {
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategories?: string[];
  tags?: string[];
  brand?: string;
  sku: string;
  
  // Pricing & Discounts
  price: number;
  compareAtPrice?: number;
  cost?: number;
  discountType?: 'percentage' | 'fixed' | 'none';
  discountValue?: number;
  discountStartDate?: Date;
  discountEndDate?: Date;
  
  // Inventory
  stock: number;
  lowStockThreshold?: number;
  trackQuantity?: boolean;
  allowBackorder?: boolean;
  backorderLimit?: number;
  inventoryPolicy?: 'deny' | 'continue';
  
  // Physical Properties
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit?: 'cm' | 'm' | 'in' | 'ft';
  };
  
  // Media
  images?: string[];
  videos?: string[];
  
  // Variants & Attributes
  variants?: any[];
  attributes?: any[];
  
  // Status & Visibility
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  isDigital?: boolean;
  requiresShipping?: boolean;
  taxable?: boolean;
  taxClass?: string;
  
  // Product Condition
  condition?: 'new' | 'refurbished' | 'used';
  
  // Shipping
  freeShipping?: boolean;
  shippingClass?: string;
  
  // SEO
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    canonicalUrl?: string;
  };
  
  // Reviews
  reviewsEnabled?: boolean;
  
  // Additional Info
  specifications?: {
    name: string;
    value: string;
  }[];
  warranty?: string;
  returnPolicy?: string;
  
  // Availability
  availableFrom?: Date;
  availableUntil?: Date;
  
  // Related Products
  relatedProducts?: string[];
  crossSellProducts?: string[];
  upSellProducts?: string[];
}

export class ProductsService {
  public static async getProducts(
    pagination: PaginationQuery,
    filters: FilterQuery
  ): Promise<{
    products: any[];
    pagination: any;
  }> {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = pagination;
    const { search, category, minPrice, maxPrice, status, stockStatus, isAdmin } = filters;

    // Build query
    const query: any = {};

    // Status filtering
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    } else if (status === 'all' || isAdmin) {
      // Admin / All view shows both active and inactive
    } else {
      // Default for storefront
      query.isActive = true;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    if (stockStatus && stockStatus !== 'all') {
      if (stockStatus === 'in_stock') {
        query.stock = { $gt: 10 };
      } else if (stockStatus === 'low_stock') {
        query.stock = { $gt: 0, $lte: 10 };
      } else if (stockStatus === 'out_of_stock') {
        query.stock = { $lte: 0 };
      }
    }

    // Execute query with pagination
    const skip = PaginationUtils.getSkip(page, limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('subcategories', 'name slug')
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    const paginationInfo = PaginationUtils.calculatePagination(page, limit, total);

    return {
      products,
      pagination: paginationInfo,
    };
  }

  public static async getProductById(productId: string): Promise<IProduct> {
    const product = await Product.findById(productId)
      .populate('category', 'name slug')
      .populate('subcategories', 'name slug');

    if (!product) {
      throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    return product;
  }

  public static async getProductBySlug(slug: string): Promise<IProduct> {
    const product = await Product.findOne({ slug, isActive: true })
      .populate('category', 'name slug')
      .populate('subcategories', 'name slug');

    if (!product) {
      throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    return product;
  }

  public static async createProduct(data: CreateProductData, files: any): Promise<IProduct> {
    // Verify category exists
    const category = await Category.findById(data.category);
    if (!category) {
      throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check if SKU already exists anywhere (root or variants)
    const existingProduct = await Product.findOne({
      $or: [
        { sku: data.sku },
        { 'variants.sku': data.sku }
      ]
    });

    if (existingProduct) {
      throw new AppError('Product with this SKU already exists', HTTP_STATUS.CONFLICT);
    }

    // Generate slug
    const existingSlugs = await Product.find({}, 'slug').lean();
    const slugs = existingSlugs.map(p => p.slug);
    const slug = SlugUtils.generateUnique(data.name, slugs);

    // Create product
    const product = new Product({
      ...data,
      slug,
    });

    // Upload images to S3
    if (files && Array.isArray(files) && files.length > 0) {
      const imageUrls = await S3Service.uploadMultiple(files, 'products');
      console.log('✓ Uploaded', imageUrls.length, 'images to S3');
      product.images = imageUrls;
    }

    await product.save();
    return product;
  }

  public static async updateProduct(productId: string, data: Partial<CreateProductData>, files?: any): Promise<IProduct> {
    // If updating name, regenerate slug
    if (data.name) {
      const existingSlugs = await Product.find({ _id: { $ne: productId } }, 'slug').lean();
      const slugs = existingSlugs.map(p => p.slug);
      data.slug = SlugUtils.generateUnique(data.name, slugs);
    }

    // If updating category, verify it exists
    if (data.category) {
      const category = await Category.findById(data.category);
      if (!category) {
        throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      }
    }


    // Handle images (existing images preservation, reordering, and new uploads)
    let finalImages: string[] | undefined = undefined;
    if ((data as any).existingImages !== undefined && (data as any).existingImages !== null) {
      try {
        const parsed = typeof (data as any).existingImages === 'string'
          ? JSON.parse((data as any).existingImages)
          : (data as any).existingImages;
        if (Array.isArray(parsed)) {
          finalImages = parsed;
        }
      } catch {
        finalImages = Array.isArray((data as any).existingImages) ? (data as any).existingImages : undefined;
      }
    } else if (data.images) {
      if (Array.isArray(data.images)) {
        finalImages = data.images;
      }
    }

    // Upload new image files if any
    if (files && Array.isArray(files) && files.length > 0) {
      const newImageUrls = await S3Service.uploadMultiple(files, 'products');
      console.log('✓ Uploaded', newImageUrls.length, 'new images to S3');
      
      const currentList = finalImages || [];
      const coverIsNew = (data as any).coverIsNew === 'true' || (data as any).coverIsNew === true;
      if (coverIsNew) {
        finalImages = [...newImageUrls, ...currentList];
      } else {
        finalImages = [...currentList, ...newImageUrls];
      }
    }

    if (finalImages !== undefined) {
      (data as any).images = finalImages;
    }

    delete (data as any).existingImages;
    delete (data as any).coverIsNew;

    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: data },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return product;
  }

  public static async deleteProduct(productId: string): Promise<void> {
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Clean up images from storage when product is deleted
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          await S3Service.deleteFile(imageUrl);
        } catch (err) {
          console.warn('Failed to delete image during product removal:', err);
        }
      }
    }

    await Product.findByIdAndDelete(productId);
  }

  public static async getFeaturedProducts(limit: number = 10): Promise<any[]> {
    const products = await Product.find({
      isActive: true,
      isFeatured: true
    })
      .populate('category', 'name slug')
      .sort({ salesCount: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return products;
  }

  public static async getRelatedProducts(productId: string, limit: number = 6): Promise<any[]> {
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      category: product.category,
      isActive: true,
    })
      .populate('category', 'name slug')
      .sort({ salesCount: -1 })
      .limit(limit)
      .lean();

    return relatedProducts;
  }

  public static async updateStock(productId: string, quantity: number, variantId?: string): Promise<void> {
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (variantId) {
      const variant = (product.variants as any).id(variantId);
      if (!variant) {
        throw new AppError('Product variant not found', HTTP_STATUS.NOT_FOUND);
      }
      variant.stock = Math.max(0, variant.stock + quantity);
    } else {
      product.stock = Math.max(0, product.stock + quantity);
    }

    await product.save();
  }

  public static async bulkUpdateProducts(
    productIds: string[],
    updateData: Partial<CreateProductData>
  ): Promise<number> {
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: updateData }
    );

    return result.matchedCount || result.modifiedCount || 0;
  }

  public static async bulkImportProducts(productsData: CreateProductData[]): Promise<{
    importedCount: number;
    failedCount: number;
    createdProducts: any[];
    errors: { index: number; sku?: string; name?: string; error: string }[];
  }> {
    if (!Array.isArray(productsData) || productsData.length === 0) {
      throw new AppError('Products array is required and cannot be empty', HTTP_STATUS.BAD_REQUEST);
    }

    // Pre-fetch all categories for quick resolution by ID, name, or slug
    const allCategories = await Category.find({}).lean();
    const categoryMap = new Map<string, any>();
    allCategories.forEach(cat => {
      categoryMap.set(cat._id.toString(), cat);
      categoryMap.set(cat.name.toLowerCase().trim(), cat);
      categoryMap.set(cat.slug.toLowerCase().trim(), cat);
    });

    // Pre-fetch existing SKUs and Slugs to validate collisions
    const [existingSkusList, existingSlugsList] = await Promise.all([
      Product.find({}, 'sku variants.sku').lean(),
      Product.find({}, 'slug').lean(),
    ]);

    const existingSkus = new Set<string>();
    existingSkusList.forEach((p: any) => {
      if (p.sku) existingSkus.add(p.sku.toLowerCase().trim());
      if (Array.isArray(p.variants)) {
        p.variants.forEach((v: any) => {
          if (v.sku) existingSkus.add(v.sku.toLowerCase().trim());
        });
      }
    });

    const existingSlugs = existingSlugsList.map((p: any) => p.slug);

    const createdProducts: any[] = [];
    const errors: { index: number; sku?: string; name?: string; error: string }[] = [];
    const batchSkus = new Set<string>();

    for (let i = 0; i < productsData.length; i++) {
      const item = productsData[i];
      try {
        if (!item.name || !item.name.trim()) {
          throw new Error('Product name is required');
        }
        if (!item.sku || !item.sku.trim()) {
          throw new Error('SKU is required');
        }
        if (item.price === undefined || item.price === null || isNaN(Number(item.price)) || Number(item.price) < 0) {
          throw new Error('Valid positive price is required');
        }
        if (item.stock === undefined || item.stock === null || isNaN(Number(item.stock)) || Number(item.stock) < 0) {
          throw new Error('Valid positive stock quantity is required');
        }

        const skuNormalized = item.sku.toLowerCase().trim();
        if (existingSkus.has(skuNormalized)) {
          throw new Error(`SKU "${item.sku}" already exists in the catalog`);
        }
        if (batchSkus.has(skuNormalized)) {
          throw new Error(`Duplicate SKU "${item.sku}" found within the import file`);
        }

        // Resolve Category
        let categoryId: string | null = null;
        if (item.category) {
          const catKey = String(item.category).trim();
          const matchedCategory = categoryMap.get(catKey) || categoryMap.get(catKey.toLowerCase());
          if (matchedCategory) {
            categoryId = matchedCategory._id.toString();
          }
        }

        if (!categoryId) {
          throw new Error(`Category "${item.category || 'Empty'}" is invalid or not found`);
        }

        // Generate unique slug
        const slug = SlugUtils.generateUnique(item.name, existingSlugs);
        existingSlugs.push(slug);
        batchSkus.add(skuNormalized);

        // Normalize data
        const productDocData: any = {
          ...item,
          category: categoryId,
          slug,
          price: Number(item.price),
          compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : undefined,
          cost: item.cost ? Number(item.cost) : undefined,
          stock: Number(item.stock),
          lowStockThreshold: item.lowStockThreshold !== undefined ? Number(item.lowStockThreshold) : 5,
          weight: item.weight !== undefined ? Number(item.weight) : undefined,
          description: item.description || item.shortDescription || item.name,
          isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
          isFeatured: item.isFeatured !== undefined ? Boolean(item.isFeatured) : false,
          isNew: item.isNew !== undefined ? Boolean(item.isNew) : false,
          isBestseller: item.isBestseller !== undefined ? Boolean(item.isBestseller) : false,
          isDigital: item.isDigital !== undefined ? Boolean(item.isDigital) : false,
          requiresShipping: item.requiresShipping !== undefined ? Boolean(item.requiresShipping) : true,
          freeShipping: item.freeShipping !== undefined ? Boolean(item.freeShipping) : false,
          taxable: item.taxable !== undefined ? Boolean(item.taxable) : true,
        };

        if (item.images && Array.isArray(item.images)) {
          productDocData.images = item.images.filter(Boolean);
        }

        const newProduct = new Product(productDocData);
        await newProduct.save();
        existingSkus.add(skuNormalized);
        createdProducts.push(newProduct);
      } catch (err: any) {
        errors.push({
          index: i + 1,
          sku: item.sku,
          name: item.name,
          error: err.message || 'Validation or database error',
        });
      }
    }

    return {
      importedCount: createdProducts.length,
      failedCount: errors.length,
      createdProducts,
      errors,
    };
  }

  public static async bulkDeleteProducts(productIds: string[]): Promise<number> {
    const products = await Product.find({ _id: { $in: productIds } });
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          try {
            await S3Service.deleteFile(imageUrl);
          } catch (err) {
            console.warn('Failed to delete image during bulk product deletion:', err);
          }
        }
      }
    }

    const result = await Product.deleteMany({ _id: { $in: productIds } });
    return result.deletedCount || 0;
  }

  public static async getProductStats() {
    const [
      totalProducts,
      activeProducts,
      featuredProducts,
      outOfStockProducts,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isFeatured: true }),
      Product.countDocuments({ stock: 0, trackQuantity: true }),
      Product.countDocuments({
        $expr: { $lte: ['$stock', '$lowStockThreshold'] },
        trackQuantity: true,
        stock: { $gt: 0 },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      inactiveProducts: totalProducts - activeProducts,
      featuredProducts,
      outOfStockProducts,
      lowStockProducts,
    };
  }
}