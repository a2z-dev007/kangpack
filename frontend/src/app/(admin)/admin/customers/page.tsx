'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAdminUsers, useDeleteUser, useUpdateUser } from '@/features/admin/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Users, Edit, Trash2, MoreVertical, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserModal } from '@/features/admin/components/UserModal';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export default function AdminCustomers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data, isLoading } = useAdminUsers({ page, limit: 10, search });
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: updateUser } = useUpdateUser();

  const users = data?.data || [];
  const pagination = data?.pagination;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'staff':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const openDeleteModal = (user: any) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id || selectedUser._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage customer accounts and roles</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers ({pagination?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No customers found</h3>
              <p className="text-muted-foreground">Customer accounts will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground px-2">
                <div className="col-span-2">Customer</div>
                <div>Role</div>
                <div>Joined</div>
                <div className="text-right">Actions</div>
              </div>

              {users.map((user: any) => (
                <div key={user.id || user._id} className="grid grid-cols-5 gap-4 items-center py-3 border-b last:border-0 hover:bg-muted/50 transition-colors px-2 rounded-lg group">
                  <div className="col-span-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <Badge variant={getRoleBadgeVariant(user.role) as any}>
                      {user.role}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </div>
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateUser({ id: user.id || user._id, data: { role: user.role === 'user' ? 'staff' : 'user' } })}
                        >
                          {user.role === 'user' ? 'Promote to Staff' : 'Demote to User'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => openDeleteModal(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total} customers
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setUserModalOpen(false)}
        user={selectedUser}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete user "${selectedUser?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
