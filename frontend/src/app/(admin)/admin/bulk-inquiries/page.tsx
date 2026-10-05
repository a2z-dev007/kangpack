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
  useAdminBulkInquiries,
  useAdminBulkInquiryStats,
  useUpdateBulkInquiryStatus,
  useDeleteBulkInquiry,
} from '@/features/admin/queries';
import { AdminBulkInquiry } from '@/features/admin/api';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { formatDate } from '@/lib/utils';
import {
  Building2,
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
  Package,
  Sparkles,
  MapPin,
  DollarSign,
  Briefcase,
  FileCheck,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export default function AdminBulkInquiriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [selectedInquiry, setSelectedInquiry] = useState<AdminBulkInquiry | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [estimatedBudget, setEstimatedBudget] = useState('');

  // Queries
  const { data: statsData } = useAdminBulkInquiryStats();
  const { data, isLoading } = useAdminBulkInquiries({
    page,
    limit: 10,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: search.trim() || undefined,
  });

  const { mutate: updateInquiry, isPending: isUpdating } = useUpdateBulkInquiryStatus();
  const { mutate: deleteInquiry, isPending: isDeleting } = useDeleteBulkInquiry();

  const inquiries: AdminBulkInquiry[] = data?.data || [];
  const pagination = data?.pagination;

  const openDetailsModal = (inquiry: AdminBulkInquiry) => {
    setSelectedInquiry(inquiry);
    setSelectedStatus(inquiry.status || 'pending');
    setAdminNotes(inquiry.adminNotes || '');
    setEstimatedBudget(inquiry.estimatedBudget || '');
    setIsDetailsOpen(true);

    // If currently pending, automatically transition to in_review when opened
    if (inquiry.status === 'pending') {
      updateInquiry({
        id: inquiry.id || (inquiry as any)._id,
        status: 'in_review',
      });
    }
  };

  const handleUpdateStatusSubmit = () => {
    if (!selectedInquiry) return;
    updateInquiry(
      {
        id: selectedInquiry.id || (selectedInquiry as any)._id,
        status: selectedStatus,
        adminNotes,
        estimatedBudget,
      },
      {
        onSuccess: () => {
          setIsDetailsOpen(false);
          setSelectedInquiry(null);
        },
      }
    );
  };

  const openDeleteModal = (inquiry: AdminBulkInquiry) => {
    setSelectedInquiry(inquiry);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedInquiry) return;
    deleteInquiry(selectedInquiry.id || (selectedInquiry as any)._id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedInquiry(null);
      },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 hover:bg-amber-500/25">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case 'in_review':
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-500/30 bg-blue-500/10">
            <Eye className="w-3 h-3 mr-1" /> In Review
          </Badge>
        );
      case 'contacted':
        return (
          <Badge className="bg-purple-500/15 text-purple-700 border-purple-500/30 hover:bg-purple-500/25">
            <Phone className="w-3 h-3 mr-1" /> Contacted
          </Badge>
        );
      case 'quoted':
        return (
          <Badge className="bg-indigo-500/15 text-indigo-700 border-indigo-500/30 hover:bg-indigo-500/25">
            <FileCheck className="w-3 h-3 mr-1" /> Quoted
          </Badge>
        );
      case 'closed':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/25">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Won / Closed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="text-slate-500 bg-slate-100">
            <XCircle className="w-3 h-3 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-[#6B4A2D]" />
            Bulk & Corporate Inquiries
          </h1>
          <p className="text-sm text-slate-500">
            Manage bulk quotation requests, B2B enterprise leads, and corporate gifting orders.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold uppercase text-slate-500">
              Total Inquiries
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-800">
              {statsData?.total ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-slate-400">
            All-time leads
          </CardContent>
        </Card>

        <Card className="shadow-sm border-amber-200 bg-amber-50/30">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold uppercase text-amber-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Pending
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-800">
              {statsData?.pending ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-amber-700">
            Awaiting initial review
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-200 bg-blue-50/30">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold uppercase text-blue-700 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> In Review
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-800">
              {statsData?.inReview ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-blue-700">
            Being analyzed
          </CardContent>
        </Card>

        <Card className="shadow-sm border-purple-200 bg-purple-50/30">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold uppercase text-purple-700 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Contacted
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-purple-800">
              {statsData?.contacted ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-purple-700">
            Sales pitch in progress
          </CardContent>
        </Card>

        <Card className="shadow-sm border-indigo-200 bg-indigo-50/30">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold uppercase text-indigo-700 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" /> Quoted
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-indigo-800">
              {statsData?.quoted ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-indigo-700">
            Commercial quote sent
          </CardContent>
        </Card>

        <Card className="shadow-sm border-emerald-200 bg-emerald-50/30">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold uppercase text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Closed
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-800">
              {statsData?.closed ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-emerald-700">
            Order confirmed
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search name, company, email, phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-10 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                <Select
                  value={statusFilter}
                  onValueChange={(val) => {
                    setStatusFilter(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-44 h-10 rounded-xl">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="quoted">Quoted</SelectItem>
                    <SelectItem value="closed">Won / Closed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(search || statusFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                    setPage(1);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 shrink-0"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="shadow-sm overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Contact & Company</th>
                <th className="py-3.5 px-4">Email & Phone</th>
                <th className="py-3.5 px-4">Product & Quantity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-36" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="py-4 px-4 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-slate-700">No bulk inquiries found</p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        {search || statusFilter !== 'all'
                          ? 'Try adjusting your search or filters to see more results.'
                          : 'New bulk order inquiries submitted from the website will appear here.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id || inquiry._id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => openDetailsModal(inquiry)}
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(inquiry.createdAt)}</span>
                      </div>
                    </td>

                    {/* Contact & Company */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 text-sm">
                          {inquiry.name}
                        </span>
                        {inquiry.companyName ? (
                          <span className="text-xs text-[#6B4A2D] font-medium flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 shrink-0" />
                            {inquiry.companyName}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Individual Purchaser</span>
                        )}
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-3.5 px-4 text-xs">
                      <div className="flex flex-col space-y-1">
                        <a
                          href={`mailto:${inquiry.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-600 hover:text-[#6B4A2D] flex items-center gap-1.5 font-medium truncate max-w-[200px]"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{inquiry.email}</span>
                        </a>
                        <a
                          href={`tel:${inquiry.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-500 hover:text-[#6B4A2D] flex items-center gap-1.5 truncate"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{inquiry.phone}</span>
                        </a>
                      </div>
                    </td>

                    {/* Product & Quantity */}
                    <td className="py-3.5 px-4 text-xs">
                      <div className="flex flex-col space-y-1">
                        <span className="font-semibold text-slate-700">
                          {inquiry.productInterest}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[11px]">
                            {inquiry.quantity}
                          </span>
                          {inquiry.customizationRequired && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                              <Sparkles className="w-2.5 h-2.5" /> Branding
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(inquiry.status)}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetailsModal(inquiry)}
                          className="h-8 px-2.5 text-xs text-slate-600 hover:text-[#6B4A2D] hover:bg-slate-100"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteModal(inquiry)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing page <span className="font-semibold text-slate-700">{pagination.page}</span> of{' '}
              <span className="font-semibold text-slate-700">{pagination.totalPages}</span> ({pagination.total} total items)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrev}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-3 text-xs"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 px-3 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Inquiry Detail & Status Update Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#6B4A2D]" />
                Bulk Inquiry Lead Details
              </DialogTitle>
              {selectedInquiry && getStatusBadge(selectedStatus)}
            </div>
            <DialogDescription>
              Submitted on {selectedInquiry ? formatDate(selectedInquiry.createdAt) : ''}
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-6 py-2">
              {/* Client & Organization Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Contact Person
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Company / Organization
                  </p>
                  <p className="text-sm font-semibold text-[#6B4A2D] mt-0.5">
                    {selectedInquiry.companyName || 'Not specified (Individual)'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Email Address
                  </p>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Phone / WhatsApp
                  </p>
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {selectedInquiry.phone}
                  </a>
                </div>
              </div>

              {/* Requirement Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Product</p>
                  <p className="text-xs font-bold text-slate-800 mt-1 truncate">
                    {selectedInquiry.productInterest}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Quantity</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {selectedInquiry.quantity}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Timeline</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {selectedInquiry.timeline || 'Flexible'}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Custom Logo</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {selectedInquiry.customizationRequired ? '✅ Yes' : 'No'}
                  </p>
                </div>
              </div>

              {/* Location details */}
              {(selectedInquiry.city || selectedInquiry.state || selectedInquiry.pincode) && (
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <MapPin className="w-4 h-4 text-[#6B4A2D] shrink-0" />
                  <span>
                    Delivery Location:{' '}
                    <strong>
                      {[selectedInquiry.city, selectedInquiry.state, selectedInquiry.pincode]
                        .filter(Boolean)
                        .join(', ')}
                    </strong>
                  </span>
                </div>
              )}

              {/* Client Message / Notes */}
              {selectedInquiry.message && (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Client's Special Requirements / Message
                  </p>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>
              )}

              {/* Status & Commercial Management */}
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#6B4A2D]" />
                  Sales Action & Follow-up Status
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Update Lead Status
                    </label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending (New)</SelectItem>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="contacted">Contacted (In Discussion)</SelectItem>
                        <SelectItem value="quoted">Quoted (Proposal Sent)</SelectItem>
                        <SelectItem value="closed">Won / Closed (Order Placed)</SelectItem>
                        <SelectItem value="cancelled">Cancelled / Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Quoted Amount / Budget (Optional)
                    </label>
                    <Input
                      placeholder="e.g. ₹1,25,000 + GST"
                      value={estimatedBudget}
                      onChange={(e) => setEstimatedBudget(e.target.value)}
                      className="h-10 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Internal Sales Notes (Not visible to client)
                  </label>
                  <Textarea
                    placeholder="Record call summary, pricing discounts offered, sample dispatch date, follow-up date..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between sm:justify-between border-t border-slate-100 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDetailsOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUpdateStatusSubmit}
              disabled={isUpdating}
              className="bg-[#6B4A2D] hover:bg-[#5A3E26] text-white rounded-xl text-xs font-semibold px-5"
            >
              {isUpdating ? 'Saving...' : 'Save Lead Updates'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Bulk Inquiry?"
        description={`Are you sure you want to delete the inquiry from ${selectedInquiry?.name} (${selectedInquiry?.companyName || 'Individual'})? This action cannot be undone.`}
        confirmText="Delete Inquiry"
        confirmVariant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
