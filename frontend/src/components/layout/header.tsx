'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User as UserIcon, Search, Menu, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/lib/constants';

export function Header() {
  const router = useRouter();
  const { getItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Only access client-side state after hydration
  useEffect(() => {
    setMounted(true);
    setCartCount(getItemCount());
  }, [getItemCount]);

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <Link href={ROUTES.HOME} className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Premium Store
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href={ROUTES.PRODUCTS} className="text-sm font-medium transition-colors hover:text-primary">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium transition-colors hover:text-primary">
              Categories
            </Link>
            <Link href="/deals" className="text-sm font-medium transition-colors hover:text-primary">
              Deals
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Search className="h-5 w-5" />
          </Button>

          <Link href={ROUTES.CART}>
            <Button variant="ghost" size="icon" className="relative group">
              <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {mounted ? (
            isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || user?.firstName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={user?.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.DASHBOARD} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.PROFILE} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={ROUTES.LOGIN}>
                <Button size="sm" className="rounded-full px-6">Sign In</Button>
              </Link>
            )
          ) : (
            <Button variant="ghost" size="icon">
              <UserIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
