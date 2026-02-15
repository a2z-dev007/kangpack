'use client';

import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/features/categories/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['all-categories'],
    queryFn: () => categoriesApi.getCategories(),
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/10 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Explore Our Collection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Shop by Category
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover amazing products across all our carefully curated categories
            </p>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
              ))}
            </div>
          ) : categories?.data.length === 0 ? (
            <div className="text-center py-16 md:py-20">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Categories Yet</h3>
              <p className="text-muted-foreground mb-8">Check back soon for new categories!</p>
              <Link href={ROUTES.HOME}>
                <Button>
                  Back to Home
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {categories?.data.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted transition-all hover:scale-[1.02] hover:shadow-xl"
                >
                  {/* Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${
                        category.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
                      })`,
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-white/80 line-clamp-2 mb-3">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Browse Collection</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>

                  {/* Hover Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-12 md:p-16 text-center text-white shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Browse all our products or use our search to find exactly what you need
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={ROUTES.PRODUCTS}>
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full shadow-lg">
                    View All Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={ROUTES.HOME}>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
