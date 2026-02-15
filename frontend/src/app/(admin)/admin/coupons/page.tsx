'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAdminCoupons, useDeleteCoupon } from '@/features/admin/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Tag, Edit, Trash2, Copy } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { CouponModal } from '@/features/admin/components/CouponModal';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export default function AdminCoupons() {
  const [search, setSearch] = useState('');
  const [isCouponModalOpen, setCouponModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  const { data, isLoading } = useAdminCoupons({ search });
  const { mutate: deleteCoupon, isPending: isDeleting } = useDeleteCoupon();

  const coupons = data?.data || [];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  const openAddModal = () => {
    setSelectedCoupon(null);
    setCouponModalOpen(true);
  };

  const openEditModal = (coupon: any) => {
    setSelectedCoupon(coupon);
    setCouponModalOpen(true);
  };

  const openDeleteModal = (coupon: any) => {
    setSelectedCoupon(coupon);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCoupon) {
      deleteCoupon(selectedCoupon._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedCoupon(null);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">Manage discount codes and promotions</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coupons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>All Coupons ({coupons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No coupons found</h3>
              <p className="text-muted-foreground">Create your first coupon to offer discounts.</p>
              <Button className="mt-4" onClick={openAddModal}>
                <Plus className="mr-2 h-4 w-4" />
                Create Coupon
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon: any) => (
                <div key={coupon._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Tag className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-mono font-bold text-lg">{coupon.code}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyCode(coupon.code)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                              {coupon.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {coupon.type === 'percentage' ? `${coupon.value}% off` : `$${coupon.value} off`}
                            {coupon.minOrderAmount && ` • Min order: $${coupon.minOrderAmount}`}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            {coupon.usageLimit && (
                              <span>
                                Used: {coupon.usageCount || 0} / {coupon.usageLimit}
                              </span>
                            )}
                            {coupon.expiresAt && (
                              <span>
                                Expires: {formatDate(coupon.expiresAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(coupon)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteModal(coupon)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        coupon={selectedCoupon}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Coupon"
        description={`Are you sure you want to delete coupon "${selectedCoupon?.code}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
