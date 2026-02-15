'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FileText, Edit, Trash2, Globe } from 'lucide-react';
import { useAdminPages, useDeletePage } from '@/features/admin/queries';
import { PageModal } from '@/features/admin/components/PageModal';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { formatDate } from '@/lib/utils';

export default function AdminCMS() {
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [isPageModalOpen, setPageModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data, isLoading } = useAdminPages();
  const { mutate: deletePage, isPending: isDeleting } = useDeletePage();

  const pages = data?.data || [];

  const openAddModal = () => {
    setSelectedPage(null);
    setPageModalOpen(true);
  };

  const openEditModal = (page: any) => {
    setSelectedPage(page);
    setPageModalOpen(true);
  };

  const openDeleteModal = (page: any) => {
    setSelectedPage(page);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPage) {
      deletePage(selectedPage._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedPage(null);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CMS Pages</h1>
          <p className="text-muted-foreground">Manage static content pages like About, Privacy, etc.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Page
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pages ({pages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No pages yet</h3>
              <p className="text-muted-foreground">Create your first CMS page to get started.</p>
              <Button className="mt-4" onClick={openAddModal}>
                <Plus className="mr-2 h-4 w-4" />
                Create Page
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {pages.map((page: any) => (
                <div key={page._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{page.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Globe className="h-3 w-3" />
                        <span>/{page.slug}</span>
                        <span>•</span>
                        <span>Updated {formatDate(page.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={page.isActive ? 'default' : 'secondary'}>
                      {page.isActive ? 'Published' : 'Draft'}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(page)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteModal(page)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PageModal
        isOpen={isPageModalOpen}
        onClose={() => setPageModalOpen(false)}
        pageData={selectedPage}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Page"
        description={`Are you sure you want to delete "${selectedPage?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
