import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Product } from '../database/models/Product';
import { Category } from '../database/models/Category';

// Load environment variables (.env.production or .env)
const envProdPath = path.resolve(__dirname, '../../.env.production');
const envDevPath = path.resolve(__dirname, '../../.env');

if (process.env.NODE_ENV === 'production' && fs.existsSync(envProdPath)) {
  dotenv.config({ path: envProdPath });
} else if (fs.existsSync(envDevPath)) {
  dotenv.config({ path: envDevPath });
} else if (fs.existsSync(envProdPath)) {
  dotenv.config({ path: envProdPath });
} else {
  dotenv.config();
}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://localhost:27017/ecommerce_db';

// Categories corresponding to the Explore Our Products section
const categoriesData = [
  {
    name: 'Flagship',
    slug: 'flagship',
    description: 'Flagship wearable workstation collection with integrated radiation shielding.',
    sortOrder: 1,
    isActive: true,
    seo: {
      metaTitle: 'Kangpack Flagship Collection',
      metaDescription: 'Explore the Flagship series of Kangpack wearable workstations.',
      metaKeywords: 'kangpack, flagship, wearable desk, radiation shield'
    }
  },
  {
    name: 'Original',
    slug: 'original',
    description: 'Original classic Kangpack series that started the mobile desk revolution.',
    sortOrder: 2,
    isActive: true,
    seo: {
      metaTitle: 'Kangpack Original Collection',
      metaDescription: 'Explore the Classic Original series of Kangpack mobile desks.',
      metaKeywords: 'kangpack, original, classic, mobile workstation'
    }
  },
  {
    name: 'Travel',
    slug: 'travel',
    description: 'Lightweight, ultra-compact gear designed for seamless travel and daily commute.',
    sortOrder: 3,
    isActive: true,
    seo: {
      metaTitle: 'Kangpack Travel Collection',
      metaDescription: 'Explore the lightweight Kangpack travel and commuter collection.',
      metaKeywords: 'kangpack, travel, lightweight, commuter desk'
    }
  },
  {
    name: 'Pro Series',
    slug: 'pro-series',
    description: 'Reinforced ballistic weave gear tailored for high-demand creators and power users.',
    sortOrder: 4,
    isActive: true,
    seo: {
      metaTitle: 'Kangpack Pro Series Collection',
      metaDescription: 'Explore the heavy-duty Kangpack Pro Series mobile workstations.',
      metaKeywords: 'kangpack, pro series, creator, ballistic weave'
    }
  }
];

// Products matching the Explore Our Products section on the frontend
const exploreProductsData = [
  {
    name: 'Kangpack Flagship Edition',
    slug: 'kangpack-flagship-edition',
    sku: 'KP-FLAGSHIP-001',
    categorySlug: 'flagship',
    price: 14999,
    compareAtPrice: 17999,
    cost: 9500,
    description:
      'The ultimate wearable workstation for the modern professional. Built-in radiation shield and ergonomic harness system.',
    shortDescription:
      'The ultimate wearable workstation for the modern professional.',
    images: [
      '/assets/tickers/main.jpeg',
      '/assets/tickers/side.jpeg',
      '/assets/tickers/second.jpeg'
    ],
    brand: 'Kangpack',
    stock: 25,
    lowStockThreshold: 5,
    trackQuantity: true,
    allowBackorder: false,
    weight: 1.8,
    weightUnit: 'kg',
    dimensions: {
      length: 42,
      width: 32,
      height: 12,
      unit: 'cm'
    },
    isNew: true,
    isBestseller: true,
    isFeatured: true,
    isActive: true,
    tags: ['New', 'Best Seller', 'Flagship', 'Wearable Workstation'],
    attributes: [
      { name: 'Color', values: ['Classic Brown', 'Stealth Black'] },
      { name: 'Laptop Compatibility', values: ['Up to 16-inch laptops'] }
    ],
    seo: {
      metaTitle: 'Kangpack Flagship Edition - Wearable Workstation',
      metaDescription:
        'The ultimate wearable workstation for the modern professional. Built-in radiation shield and ergonomic harness system.',
      metaKeywords: 'kangpack flagship, wearable workstation, mobile desk'
    },
    ratings: {
      average: 4.9,
      count: 28
    },
    salesCount: 156,
    viewCount: 1240
  },
  {
    name: 'Kangpack Classic Edition',
    slug: 'kangpack-classic',
    sku: 'KP-CLASSIC-001',
    categorySlug: 'original',
    price: 12999,
    compareAtPrice: 14999,
    cost: 8200,
    description:
      'The original design that started the mobile desk revolution. Lightweight, weather-resistant, and precision crafted.',
    shortDescription:
      'The original design that started the mobile desk revolution.',
    images: [
      '/assets/tickers/first.jpeg',
      '/assets/tickers/side.jpeg'
    ],
    brand: 'Kangpack',
    stock: 18,
    lowStockThreshold: 5,
    trackQuantity: true,
    allowBackorder: false,
    weight: 1.6,
    weightUnit: 'kg',
    dimensions: {
      length: 40,
      width: 30,
      height: 10,
      unit: 'cm'
    },
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    isActive: true,
    tags: ['Classic', 'Best Seller', 'Original', 'Mobile Desk'],
    attributes: [
      { name: 'Color', values: ['Vintage Brown', 'Matte Black'] },
      { name: 'Laptop Compatibility', values: ['Up to 15.6-inch laptops'] }
    ],
    seo: {
      metaTitle: 'Kangpack Classic Edition - Original Mobile Desk',
      metaDescription:
        'The original design that started the mobile desk revolution. Lightweight, weather-resistant, and precision crafted.',
      metaKeywords: 'kangpack classic, original mobile desk, laptop backpack'
    },
    ratings: {
      average: 4.8,
      count: 42
    },
    salesCount: 280,
    viewCount: 1890
  },
  {
    name: 'Kangpack Lite',
    slug: 'kangpack-lite',
    sku: 'KP-LITE-001',
    categorySlug: 'travel',
    price: 9999,
    compareAtPrice: 11999,
    cost: 6500,
    description:
      'Lightweight and ultra-compact for quick commute and effortless all-day mobile productivity.',
    shortDescription:
      'Lightweight and ultra-compact for quick commute and effortless all-day mobile productivity.',
    images: [
      '/assets/tickers/354A7762.jpg',
      '/assets/tickers/354A7767.jpg'
    ],
    brand: 'Kangpack',
    stock: 40,
    lowStockThreshold: 5,
    trackQuantity: true,
    allowBackorder: false,
    weight: 1.1,
    weightUnit: 'kg',
    dimensions: {
      length: 38,
      width: 28,
      height: 8,
      unit: 'cm'
    },
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    isActive: true,
    tags: ['Lightweight', 'Travel', 'New', 'Commute'],
    attributes: [
      { name: 'Color', values: ['Desert Tan', 'Slate Grey'] },
      { name: 'Laptop Compatibility', values: ['Up to 14-inch laptops'] }
    ],
    seo: {
      metaTitle: 'Kangpack Lite - Compact Commuter Workstation',
      metaDescription:
        'Lightweight and ultra-compact for quick commute and effortless all-day mobile productivity.',
      metaKeywords: 'kangpack lite, lightweight laptop bag, travel desk'
    },
    ratings: {
      average: 4.7,
      count: 19
    },
    salesCount: 88,
    viewCount: 850
  },
  {
    name: 'Kangpack Pro Stealth',
    slug: 'kangpack-pro-stealth',
    sku: 'KP-PRO-STEALTH-001',
    categorySlug: 'pro-series',
    price: 16999,
    compareAtPrice: 19999,
    cost: 11000,
    description:
      'Reinforced ballistic weave and magnetic dock compartments tailored for high-demand creators.',
    shortDescription:
      'Reinforced ballistic weave and magnetic dock compartments tailored for high-demand creators.',
    images: [
      '/assets/tickers/main2.jpeg',
      '/assets/tickers/354A7751.jpg'
    ],
    brand: 'Kangpack',
    stock: 12,
    lowStockThreshold: 5,
    trackQuantity: true,
    allowBackorder: false,
    weight: 2.0,
    weightUnit: 'kg',
    dimensions: {
      length: 44,
      width: 34,
      height: 14,
      unit: 'cm'
    },
    isNew: false,
    isBestseller: false,
    isFeatured: true,
    isActive: true,
    tags: ['Pro', 'Pro Series', 'Creator', 'Ballistic'],
    attributes: [
      { name: 'Color', values: ['Stealth Black', 'Carbon Leather'] },
      { name: 'Laptop Compatibility', values: ['Up to 17-inch laptops'] }
    ],
    seo: {
      metaTitle: 'Kangpack Pro Stealth - Heavy-Duty Creator Desk',
      metaDescription:
        'Reinforced ballistic weave and magnetic dock compartments tailored for high-demand creators.',
      metaKeywords: 'kangpack pro, pro stealth, creator bag, mobile desk'
    },
    ratings: {
      average: 5.0,
      count: 35
    },
    salesCount: 112,
    viewCount: 980
  }
];

export const seedExploreProducts = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully.');

    // 1. Seed or find Categories
    console.log('📁 Setting up product categories...');
    const categoryMap = new Map<string, mongoose.Types.ObjectId>();

    for (const catData of categoriesData) {
      let category = await Category.findOne({ slug: catData.slug });
      if (!category) {
        category = await Category.create(catData);
        console.log(`  ➕ Created category: ${catData.name} (${catData.slug})`);
      } else {
        await Category.updateOne({ _id: category._id }, { $set: catData });
        console.log(`  🔄 Updated category: ${catData.name} (${catData.slug})`);
      }
      categoryMap.set(catData.slug, category._id);
    }

    // 2. Clear out any previous products so ONLY these products exist
    console.log('🧹 Clearing existing products to keep only Explore Our Products items...');
    await Product.deleteMany({});

    // 3. Insert the 4 Kangpack products
    console.log('🌱 Seeding products from Explore Our Products section...');
    const insertedProducts = [];

    for (const prodData of exploreProductsData) {
      const categoryId = categoryMap.get(prodData.categorySlug);
      if (!categoryId) {
        throw new Error(`Category not found for slug: ${prodData.categorySlug}`);
      }

      const { categorySlug, ...restProductData } = prodData;

      const product = await Product.create({
        ...restProductData,
        category: categoryId,
        subcategories: []
      });

      insertedProducts.push(product);
      console.log(`  ✅ Added product: "${product.name}" - ₹${product.price.toLocaleString('en-IN')} (SKU: ${product.sku})`);
    }

    console.log(`\n🎉 Successfully seeded ${insertedProducts.length} products!`);
    console.log('📦 Products in catalog:');
    insertedProducts.forEach((p, idx) => {
      console.log(`   ${idx + 1}. ${p.name} | ₹${p.price} | Stock: ${p.stock} | Slug: ${p.slug}`);
    });

    return insertedProducts;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
};

// Auto-run if executed directly
if (require.main === module) {
  seedExploreProducts()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}