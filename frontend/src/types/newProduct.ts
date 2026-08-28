export type FeatureIcon =
  | "repeat"
  | "package"
  | "layers"
  | "zap"
  | "grip"
  | "backpack"
  | "plane"
  | "briefcase"
  | "bookOpen"
  | "shield"
  | "leaf"
  | "star"
  | "mountain";

export interface ProductFeature {
  label: string;
  icon: FeatureIcon;
}

export interface ProductVariant {
  name: string;
  colors: string[];
  featured?: boolean;
}

export interface TrustBadge {
  title: string;
  subtitle: string;
  icon: FeatureIcon;
}

export interface NewProductImages {
  poster: string;
  main?: string;
  front?: string;
  back?: string;
  model?: string;
  front1?: string;
  front2?: string;
  front3?: string;
}

export interface NewProduct {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  brandTagline?: string;
  tagline: string;
  highlight?: string;
  description: string;
  category: string;
  featuredVariant?: string;
  isNew: boolean;
  isFeatured: boolean;
  poster: string;
  images: NewProductImages;
  features: ProductFeature[];
  variants?: ProductVariant[];
  trustBadges?: TrustBadge[];
  accentColor: string;
}

export interface NewProductsData {
  products: NewProduct[];
}
