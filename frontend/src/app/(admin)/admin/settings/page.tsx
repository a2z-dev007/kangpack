'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminSettings, useUpdateSettings } from '@/features/admin/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function AdminSettings() {
  const { data: settings, isLoading } = useAdminSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    email: '',
    phone: '',
    currency: 'USD',
    taxRate: 0,
    shippingFee: 0,
    freeShippingThreshold: 0,
  });

  // Update form when settings load
  useState(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || '',
        storeDescription: settings.storeDescription || '',
        email: settings.email || '',
        phone: settings.phone || '',
        currency: settings.currency || 'USD',
        taxRate: settings.taxRate || 0,
        shippingFee: settings.shippingFee || 0,
        freeShippingThreshold: settings.freeShippingThreshold || 0,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your store settings</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Basic information about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                placeholder="My Store"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Input
                id="storeDescription"
                value={formData.storeDescription}
                onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                placeholder="Your one-stop shop for..."
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="store@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Currency & Pricing</CardTitle>
            <CardDescription>Configure pricing and tax settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  placeholder="USD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Settings</CardTitle>
            <CardDescription>Configure shipping fees and thresholds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shippingFee">Shipping Fee ($)</Label>
                <Input
                  id="shippingFee"
                  type="number"
                  step="0.01"
                  value={formData.shippingFee}
                  onChange={(e) => setFormData({ ...formData, shippingFee: parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  step="0.01"
                  value={formData.freeShippingThreshold}
                  onChange={(e) => setFormData({ ...formData, freeShippingThreshold: parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Enable or disable store features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="enableReviews" />
              <Label htmlFor="enableReviews">Enable Product Reviews</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="enableWishlist" />
              <Label htmlFor="enableWishlist">Enable Wishlist</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="enableCoupons" />
              <Label htmlFor="enableCoupons">Enable Coupons</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
