'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  useAdminPayments,
  useUpdatePaymentTransactionStatus,
  useProcessRefund,
} from '@/features/admin/queries';
import { formatDate, formatDateTime, formatPrice } from '@/lib/utils';
import {
  Search,
  CreditCard,
  Info,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { toast } from '@/lib/toast';

export default function AdminPayments() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isRefundOpen, setRefundOpen] = useState(false);
  const [isStatusOpen, setStatusOpen] = useState(false);

  // Form states
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const filters: any = {
    page,
    limit: 10,
    search: search || undefined,
  };

  if (statusFilter !== 'all') {
    filters.status = statusFilter;
  }

  const { data, isLoading } = useAdminPayments(filters);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdatePaymentTransactionStatus();
  const { mutate: processRefund, isPending: isRefunding } = useProcessRefund();

  const payments = data?.data || [];
  const pagination = data?.pagination;

  const handleUpdateStatus = () => {
    if (!newStatus) return;
    updateStatus(
      { id: selectedPayment.id || selectedPayment._id, status: newStatus },
      {
        onSuccess: () => {
          setStatusOpen(false);
          if (isDetailsOpen) {
            // Update the selected payment state to reflect the status change in details modal
            setSelectedPayment((prev: any) => ({ ...prev, status: newStatus }));
          }
        },
      }
    );
  };

  const handleRefundSubmit = () => {
    const amountNum = parseFloat(refundAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid refund amount');
      return;
    }

    const totalRefunded = selectedPayment.refunds?.reduce((sum: number, r: any) => sum + r.amount, 0) || 0;
    const maxRefundable = selectedPayment.amount - totalRefunded;

    if (amountNum > maxRefundable) {
      toast.error(`Refund amount cannot exceed remaining refundable balance of ${formatPrice(maxRefundable)}`);
      return;
    }

    processRefund(
      {
        id: selectedPayment.id || selectedPayment._id,
        amount: amountNum,
        reason: refundReason,
      },
      {
        onSuccess: () => {
          setRefundOpen(false);
          setRefundAmount('');
          setRefundReason('');
          setDetailsOpen(false);
          setSelectedPayment(null);
        },
      }
    );
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'completed':
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200">
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200">
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200">
            Failed
          </Badge>
        );
      case 'refunded':
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200">
            Refunded
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200">
            Processing
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const openDetailsModal = (payment: any) => {
    setSelectedPayment(payment);
    setDetailsOpen(true);
  };

  const openRefundModal = (payment: any) => {
    setSelectedPayment(payment);
    const totalRefunded = payment.refunds?.reduce((sum: number, r: any) => sum + r.amount, 0) || 0;
    const maxRefundable = payment.amount - totalRefunded;
    setRefundAmount(maxRefundable.toString());
    setRefundReason('');
    setRefundOpen(true);
  };

  const openStatusModal = (payment: any) => {
    setSelectedPayment(payment);
    setNewStatus(payment.status);
    setStatusOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Payments & Transactions</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Monitor transaction records, process refunds, and view gateway logs
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Payment Intent ID / Charge ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed / Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions Log ({payments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No transactions found</h3>
              <p className="text-muted-foreground">There are no payment transaction records matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-900 dark:text-slate-400 border-b">
                  <tr>
                    <th scope="col" className="px-4 py-3">Date</th>
                    <th scope="col" className="px-4 py-3">Transaction ID</th>
                    <th scope="col" className="px-4 py-3">Order Number</th>
                    <th scope="col" className="px-4 py-3">Method</th>
                    <th scope="col" className="px-4 py-3">Amount</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map((payment: any) => (
                    <tr
                      key={payment.id || payment._id}
                      className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    >
                      <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                        {formatDateTime(payment.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs max-w-[150px] truncate" title={payment.paymentIntentId}>
                        {payment.paymentIntentId}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-primary">
                        {payment.order?.orderNumber || 'N/A'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap capitalize">
                        {payment.method?.replace('_', ' ') || 'card'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                        {formatPrice(payment.amount)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetailsModal(payment)}
                          className="h-8"
                        >
                          <Info className="mr-1 h-3.5 w-3.5" />
                          Details
                        </Button>
                        {(payment.status === 'completed' || payment.status === 'paid') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openRefundModal(payment)}
                            className="h-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                          >
                            <RefreshCw className="mr-1 h-3.5 w-3.5" />
                            Refund
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t pt-4 mt-6">
              <span className="text-sm text-muted-foreground">
                Showing Page {pagination.page} of {pagination.pages}
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

      {/* Details Dialog Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed logs and metadata for this transaction
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6 my-2 text-sm">
              {/* Core info card */}
              <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div>
                  <span className="text-xs text-muted-foreground block">Transaction ID</span>
                  <span className="font-mono text-xs font-semibold">{selectedPayment.paymentIntentId}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Order Number</span>
                  <span className="font-semibold text-primary">{selectedPayment.order?.orderNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Amount</span>
                  <span className="font-bold text-base">{formatPrice(selectedPayment.amount)} {selectedPayment.currency}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(selectedPayment.status)}
                    <Button variant="ghost" size="sm" className="h-6 text-xs px-2 py-0" onClick={() => openStatusModal(selectedPayment)}>
                      Change
                    </Button>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Payment Method</span>
                  <span className="capitalize">{selectedPayment.method?.replace('_', ' ') || 'card'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Date & Time</span>
                  <span>{formatDateTime(selectedPayment.createdAt)}</span>
                </div>
              </div>

              {/* Refund Info Section */}
              {selectedPayment.refunds && selectedPayment.refunds.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-1.5 text-purple-600">
                    <RefreshCw className="h-4 w-4" />
                    Refund Logs
                  </h4>
                  <div className="border rounded-lg divide-y">
                    {selectedPayment.refunds.map((refund: any) => (
                      <div key={refund.refundId || refund._id} className="p-3 bg-purple-50/20 dark:bg-purple-950/5 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold">ID: {refund.refundId}</p>
                          <p className="text-muted-foreground">Reason: {refund.reason || 'Not specified'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-700 dark:text-purple-400">-{formatPrice(refund.amount)}</p>
                          <p className="text-muted-foreground">{formatDate(refund.processedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gateway response log */}
              {selectedPayment.gatewayResponse && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Gateway Response JSON</h4>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono max-h-[180px] overflow-auto">
                    {JSON.stringify(selectedPayment.gatewayResponse, null, 2)}
                  </pre>
                </div>
              )}

              {/* Failure reason if failed */}
              {selectedPayment.failureReason && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg flex gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-xs">Failure Reason</p>
                    <p className="text-sm">{selectedPayment.failureReason}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Request Dialog */}
      <Dialog open={isRefundOpen} onOpenChange={setRefundOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Process Payment Refund</DialogTitle>
            <DialogDescription>
              Submit a refund request for this transaction. This amount will be returned to the customer's payment method.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4 my-2 text-sm">
              <div className="grid grid-cols-2 gap-2 border p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div>
                  <span className="text-xs text-muted-foreground block">Original Amount</span>
                  <span className="font-semibold">{formatPrice(selectedPayment.amount)}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Already Refunded</span>
                  <span className="font-semibold text-purple-600">
                    {formatPrice(selectedPayment.refunds?.reduce((sum: number, r: any) => sum + r.amount, 0) || 0)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Refund Amount (INR)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Refund</label>
                <Input
                  type="text"
                  placeholder="e.g. Customer return, cancellation..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setRefundOpen(false)} disabled={isRefunding}>
              Cancel
            </Button>
            <Button onClick={handleRefundSubmit} disabled={isRefunding || !refundAmount} className="bg-purple-600 hover:bg-purple-700 text-white">
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={isStatusOpen} onOpenChange={setStatusOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogDescription>
              Manually override the payment transaction status. Use caution as this affects the corresponding order.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2 text-sm">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed / Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setStatusOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isUpdating || !newStatus}>
              Save Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
