'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  useAdminReviews,
  useApproveReview,
  useRespondToReview,
  useDeleteReview,
} from '@/features/admin/queries';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { formatDate } from '@/lib/utils';
import { Star, MessageSquare, Trash2, Check, Search, Filter } from 'lucide-react';

export default function AdminReviews() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  
  // Modals state
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isRespondOpen, setRespondOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  // Fetch reviews using queries
  const filters: any = {
    page,
    limit: 10,
  };

  if (statusFilter !== 'all') {
    filters.approved = statusFilter === 'approved';
  }

  const { data, isLoading } = useAdminReviews(filters);
  const { mutate: approveReview, isPending: isApproving } = useApproveReview();
  const { mutate: respondReview, isPending: isResponding } = useRespondToReview();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();

  const reviews = data?.data || [];
  const pagination = data?.pagination;

  // Local filtering for search and rating since some query combinations are client-side helper-friendly
  const filteredReviews = reviews.filter((review: any) => {
    // Rating filter
    if (ratingFilter !== 'all' && review.rating !== parseInt(ratingFilter)) {
      return false;
    }
    // Search filter (searches comments, product names, or user names)
    if (search) {
      const query = search.toLowerCase();
      const product = review.product?.name?.toLowerCase() || '';
      const author = `${review.user?.firstName || ''} ${review.user?.lastName || ''}`.toLowerCase();
      const comment = (review.comment || '').toLowerCase();
      const title = (review.title || '').toLowerCase();
      
      return product.includes(query) || author.includes(query) || comment.includes(query) || title.includes(query);
    }
    return true;
  });

  const handleApprove = (reviewId: string) => {
    approveReview(reviewId);
  };

  const openRespondModal = (review: any) => {
    setSelectedReview(review);
    setResponseMsg(review.response?.message || '');
    setRespondOpen(true);
  };

  const handleRespondSubmit = () => {
    if (!responseMsg.trim()) return;
    respondReview(
      { id: selectedReview.id || selectedReview._id, message: responseMsg },
      {
        onSuccess: () => {
          setRespondOpen(false);
          setSelectedReview(null);
          setResponseMsg('');
        },
      }
    );
  };

  const openDeleteModal = (review: any) => {
    setSelectedReview(review);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteReview(selectedReview.id || selectedReview._id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedReview(null);
      },
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Product Reviews</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage customer feedback and respond to reviews
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product, user or comment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            
            <div>
              <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Approval Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={ratingFilter} onValueChange={(val) => { setRatingFilter(val); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No reviews found</h3>
              <p className="text-muted-foreground">There are no reviews matching your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review: any) => (
                <div
                  key={review.id || review._id}
                  className="p-4 sm:p-5 border rounded-lg hover:bg-muted/50 transition-colors flex flex-col gap-4 bg-card"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {review.user?.firstName} {review.user?.lastName}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Product: {review.product?.name || 'Unknown Product'}
                        </Badge>
                        {review.isVerifiedPurchase && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600 bg-green-50 dark:bg-green-950/20">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {renderStars(review.rating)}
                        <span>•</span>
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={review.isApproved ? 'default' : 'secondary'}>
                        {review.isApproved ? 'Approved' : 'Pending Approval'}
                      </Badge>
                      {!review.isApproved && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(review.id || review._id)}
                          disabled={isApproving}
                          className="h-8 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="mr-1 h-3.5 w-3.5" />
                          Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRespondModal(review)}
                        className="h-8"
                      >
                        <MessageSquare className="mr-1 h-3.5 w-3.5" />
                        {review.response?.message ? 'Edit Reply' : 'Reply'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDeleteModal(review)}
                        className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {review.title && (
                      <h4 className="font-semibold text-slate-900 dark:text-white">{review.title}</h4>
                    )}
                    {review.comment && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>

                  {/* Admin Response Section */}
                  {review.response?.message && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg p-3 sm:p-4 ml-2 sm:ml-6 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary">
                          Response from Store Manager
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {formatDate(review.response.respondedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                        "{review.response.message}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
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

      {/* Response Modal Dialog */}
      <Dialog open={isRespondOpen} onOpenChange={setRespondOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
            <DialogDescription>
              Write an official response as the store manager. This reply will be visible to all customers on the product details page.
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4 my-2">
              <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                <p className="font-semibold">Review by {selectedReview.user?.firstName}:</p>
                <p className="italic">"{selectedReview.comment}"</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Message</label>
                <Textarea
                  placeholder="Thank you for your feedback! We are glad you enjoyed the product..."
                  rows={4}
                  value={responseMsg}
                  onChange={(e) => setResponseMsg(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setRespondOpen(false)} disabled={isResponding}>
              Cancel
            </Button>
            <Button onClick={handleRespondSubmit} disabled={isResponding || !responseMsg.trim()}>
              Send Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deletion confirmation */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
