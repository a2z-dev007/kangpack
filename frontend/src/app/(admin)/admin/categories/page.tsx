'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAdminCategories, useDeleteCategory } from '@/features/admin/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Trash2, Edit, FolderTree } from 'lucide-react';
import { CategoryModal } from '@/features/admin/components/CategoryModal';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export default function AdminCategories() {
  const [search, setSearch] = useState('');
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const { data, isLoading } = useAdminCategories({ search });
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const categories = data?.data || [];

  const openAddModal = () => {
    setSelectedCategory(null);
    setCategoryModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setSelectedCategory(category);
    setCategoryModalOpen(true);
  };

  const openDeleteModal = (category: any) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedCategory(null);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No categories found</h3>
              <p className="text-muted-foreground">Create your first category to organize products.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category: any) => (
                <div key={category._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <FolderTree className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteModal(category)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        category={selectedCategory}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
