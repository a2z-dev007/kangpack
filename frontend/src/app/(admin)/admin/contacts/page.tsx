'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAdminContacts,
  useAdminContactStats,
  useUpdateContactStatus,
  useDeleteContact,
} from '@/features/admin/queries';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { formatDate } from '@/lib/utils';
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Archive,
  ExternalLink,
  Eye,
  Inbox,
  Filter,
  User,
} from 'lucide-react';

export default function AdminContacts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('unread');

  // Queries
  const { data: statsData } = useAdminContactStats();
  const { data, isLoading } = useAdminContacts({
    page,
    limit: 10,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: search.trim() || undefined,
  });

  const { mutate: updateContact, isPending: isUpdating } = useUpdateContactStatus();
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact();

  const contacts = data?.data || [];
  const pagination = data?.pagination;

  const openDetailsModal = (contact: any) => {
    setSelectedContact(contact);
    setSelectedStatus(contact.status || 'unread');
    setAdminNotes(contact.adminNotes || '');
    setIsDetailsOpen(true);

    // If currently unread, automatically mark as read upon viewing
    if (contact.status === 'unread') {
      updateContact({
        id: contact.id || contact._id,
        status: 'read',
      });
    }
  };

  const handleUpdateStatusSubmit = () => {
    if (!selectedContact) return;
    updateContact(
      {
        id: selectedContact.id || selectedContact._id,
        status: selectedStatus,
        adminNotes,
      },
      {
        onSuccess: () => {
          setIsDetailsOpen(false);
          setSelectedContact(null);
        },
      }
    );
  };

  const openDeleteModal = (contact: any) => {
    setSelectedContact(contact);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedContact) return;
    deleteContact(selectedContact.id || selectedContact._id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedContact(null);
      },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return (
          <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/25">
            <Clock className="w-3 h-3 mr-1" /> Unread
          </Badge>
        );
      case 'read':
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-500/30 bg-blue-500/10">
            <Eye className="w-3 h-3 mr-1" /> Read
          </Badge>
        );
      case 'replied':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/25">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Replied
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="secondary" className="text-slate-500">
            <Archive className="w-3 h-3 mr-1" /> Archived
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Contact Inquiries
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            View and manage customer messages submitted through the Contact Us form
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Inquiries</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                {statsData?.total ?? 0}
              </h3>
            </div>
            <div className="p-3 bg-[#6B4A2D]/10 rounded-xl text-[#6B4A2D]">
              <Inbox className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Unread Messages</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-amber-600">
                {statsData?.unread ?? 0}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Replied</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-emerald-600">
                {statsData?.replied ?? 0}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Archived</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-500">
                {statsData?.archived ?? 0}
              </h3>
            </div>
            <div className="p-3 bg-slate-500/10 rounded-xl text-slate-500">
              <Archive className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, email, phone, or message content..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 w-full"
              />
            </div>

            <div>
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter by Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries List */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Messages {pagination ? `(${pagination.total})` : ''}
          </CardTitle>
          <CardDescription>
            All submitted contact inquiries with customer details and message timestamps
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#6B4A2D]/10 rounded-full flex items-center justify-center mx-auto text-[#6B4A2D] mb-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                No contact requests found
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                {search || statusFilter !== 'all'
                  ? 'No inquiries match your search filters. Try clearing your filters.'
                  : 'New messages submitted through the Contact Us form will appear here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact: any) => {
                const isUnread = contact.status === 'unread';
                return (
                  <div
                    key={contact._id || contact.id}
                    className={`p-4 sm:p-5 border rounded-2xl transition-all duration-200 flex flex-col gap-4 bg-card ${
                      isUnread
                        ? 'border-amber-400/40 bg-amber-500/[0.02] shadow-sm'
                        : 'hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-base">
                            <User className="w-4 h-4 text-[#6B4A2D]" />
                            {contact.firstName} {contact.lastName}
                          </div>
                          {getStatusBadge(contact.status)}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-1 hover:text-[#6B4A2D] transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {contact.email}
                          </a>
                          {contact.phone && (
                            <a
                              href={`tel:${contact.phone}`}
                              className="flex items-center gap-1 hover:text-[#6B4A2D] transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              {contact.phone}
                            </a>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(contact.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetailsModal(contact)}
                          className="h-8 text-xs font-medium"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-[#6B4A2D]" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDeleteModal(contact)}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Message snippet */}
                    <div className="space-y-2">
                      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed whitespace-pre-line">
                        {contact.message}
                      </p>
                      {contact.adminNotes && (
                        <div className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-600 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Admin Note: </span>
                          {contact.adminNotes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t pt-4 mt-6">
              <span className="text-sm text-muted-foreground">
                Showing Page {pagination.page} of {pagination.pages} ({pagination.total} total)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inquiry Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#6B4A2D]" />
              Inquiry Details
            </DialogTitle>
            <DialogDescription>
              Received on {selectedContact ? formatDate(selectedContact.createdAt) : ''}
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-6 my-2">
              {/* Sender Details Card */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      Sender Name
                    </span>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                      {selectedContact.firstName} {selectedContact.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      Email Address
                    </span>
                    <p className="font-medium text-slate-900 dark:text-white mt-0.5">
                      {selectedContact.email}
                    </p>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        Phone Number
                      </span>
                      <p className="font-medium text-slate-900 dark:text-white mt-0.5">
                        {selectedContact.phone}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      Current Status
                    </span>
                    <div className="mt-1">{getStatusBadge(selectedContact.status)}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Regarding your inquiry to Kangpack&body=Hi ${selectedContact.firstName},%0D%0A%0D%0AThank you for reaching out to us.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6B4A2D] text-white rounded-lg text-xs font-semibold hover:bg-[#523822] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Reply via Email
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                  {selectedContact.phone && (
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Customer
                    </a>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Message Content
                </label>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
                  {selectedContact.message}
                </div>
              </div>

              {/* Status Updater */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Update Status
                </label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied (Resolved)</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Internal Staff / Admin Notes
                </label>
                <Textarea
                  placeholder="Add notes about phone conversation, resolution, or follow-up details..."
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDetailsOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatusSubmit}
              disabled={isUpdating}
              className="bg-[#6B4A2D] hover:bg-[#523822] text-white"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Contact Inquiry"
        description="Are you sure you want to delete this contact message? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
