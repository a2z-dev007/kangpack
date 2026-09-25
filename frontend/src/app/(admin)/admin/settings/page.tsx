'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminSettings, useUpdateSettings } from '@/features/admin/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminSettings() {
  const { data: settings, isLoading } = useAdminSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    email: '',
    phone: '',
    fromEmail: '',
    fromName: '',
    currency: 'INR',
    taxRate: '0',
    shippingFee: '0',
    freeShippingThreshold: '0',
    enableCod: true,
  });

  // Update form when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.businessName || settings.storeName || '',
        storeDescription: settings.businessDescription || settings.storeDescription || '',
        email: settings.contactInfo?.email || settings.email || '',
        phone: settings.contactInfo?.phone || settings.phone || '',
        fromEmail: (settings as any).fromEmail || (settings as any).email?.fromEmail || 'support@kangpack.in',
        fromName: (settings as any).fromName || (settings as any).email?.fromName || 'Kangpack',
        currency: settings.currency || 'INR',
        taxRate: String(Math.max(0, Math.min(100, settings.tax?.rate ?? settings.taxRate ?? 0))),
        shippingFee: String(Math.max(0, settings.shipping?.defaultRate ?? settings.shippingFee ?? 0)),
        freeShippingThreshold: String(Math.max(0, settings.shipping?.freeShippingThreshold ?? settings.freeShippingThreshold ?? 0)),
        enableCod: (settings as any).payments?.cashOnDelivery?.enabled ?? true,
      });
    }
  }, [settings]);

  const handleNumberChange = (
    field: 'taxRate' | 'shippingFee' | 'freeShippingThreshold',
    value: string,
    max?: number
  ) => {
    // Allow empty string so user can clear and type fresh value
    if (value === '') {
      setFormData((prev) => ({ ...prev, [field]: '' }));
      return;
    }

    // Strip all non-digit and non-decimal characters (disallows negative sign, text, etc.)
    const cleaned = value.replace(/[^0-9.]/g, '');

    // Allow at most one decimal point
    const parts = cleaned.split('.');
    const withSingleDot = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;

    // Limit to 2 decimal places
    const finalFormatted = parts.length >= 2
      ? `${parts[0]}.${parts.slice(1).join('').slice(0, 2)}`
      : withSingleDot;

    // Check optional max limit
    const num = parseFloat(finalFormatted);
    if (max !== undefined && !isNaN(num) && num > max) {
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: finalFormatted }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      currency: formData.currency || 'INR',
      currencySymbol: (formData.currency === 'INR' || !formData.currency) ? '₹' : '₹',
      taxRate: Math.max(0, Math.min(100, parseFloat(formData.taxRate) || 0)),
      shippingFee: Math.max(0, parseFloat(formData.shippingFee) || 0),
      freeShippingThreshold: Math.max(0, parseFloat(formData.freeShippingThreshold) || 0),
    };
    updateSettings(payload);
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
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your store configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Store Information</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Basic information about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-sm">Store Name</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                placeholder="My Store"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDescription" className="text-sm">Store Description</Label>
              <Input
                id="storeDescription"
                value={formData.storeDescription}
                onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                placeholder="Your one-stop shop for..."
                className="text-sm"
              />
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="support@kangpack.in"
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+911234567891"
                  className="text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outbound Email / Sender Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Outbound Email Sender Settings</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Sender details used for transactional emails, order confirmations, and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fromName" className="text-sm">From Name</Label>
                <Input
                  id="fromName"
                  value={formData.fromName}
                  onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                  placeholder="Kangpack"
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail" className="text-sm">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={formData.fromEmail}
                  onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                  placeholder="support@kangpack.in"
                  className="text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Currency & Pricing</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Configure pricing and tax settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm">Currency</Label>
                <Select
                  value={formData.currency || 'INR'}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, currency: val }))}
                >
                  <SelectTrigger id="currency" className="text-sm bg-background">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹ - Indian Rupee)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Store currency (default: INR)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate" className="text-sm">Tax Rate (%)</Label>
                <div className="relative">
                  <Input
                    id="taxRate"
                    type="text"
                    inputMode="decimal"
                    value={formData.taxRate}
                    onChange={(e) => handleNumberChange('taxRate', e.target.value, 100)}
                    placeholder="0.00"
                    className="text-sm pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold pointer-events-none">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Percentage added to eligible orders (0 - 100%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Shipping Settings</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Configure shipping fees and thresholds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shippingFee" className="text-sm">Shipping Fee (₹)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold pointer-events-none">
                    ₹
                  </span>
                  <Input
                    id="shippingFee"
                    type="text"
                    inputMode="decimal"
                    value={formData.shippingFee}
                    onChange={(e) => handleNumberChange('shippingFee', e.target.value)}
                    placeholder="0.00"
                    className="text-sm pl-7"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Standard flat shipping rate (min. ₹0)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold" className="text-sm">Free Shipping Threshold (₹)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold pointer-events-none">
                    ₹
                  </span>
                  <Input
                    id="freeShippingThreshold"
                    type="text"
                    inputMode="decimal"
                    value={formData.freeShippingThreshold}
                    onChange={(e) => handleNumberChange('freeShippingThreshold', e.target.value)}
                    placeholder="0.00"
                    className="text-sm pl-7"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Orders above this qualify for free shipping (0 to disable)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Payment Methods</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Enable or disable checkout payment options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-4 rounded-xl border bg-muted/20 hover:bg-muted/30 transition-colors">
              <Checkbox
                id="enableCod"
                checked={formData.enableCod}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, enableCod: Boolean(checked) })
                }
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label htmlFor="enableCod" className="text-sm font-semibold cursor-pointer">
                  Enable Cash on Delivery (COD)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow customers to place orders with Cash on Delivery. When disabled, customers must pay online via Razorpay / UPI / Cards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Features</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Enable or disable store features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="enableReviews" defaultChecked />
              <Label htmlFor="enableReviews" className="text-sm">Enable Product Reviews</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="enableWishlist" defaultChecked />
              <Label htmlFor="enableWishlist" className="text-sm">Enable Wishlist</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="enableCoupons" defaultChecked />
              <Label htmlFor="enableCoupons" className="text-sm">Enable Coupons</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
