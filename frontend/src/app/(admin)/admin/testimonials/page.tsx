"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminTestimonials,
  useAdminTestimonialStats,
  useDeleteTestimonial,
  useToggleTestimonialStatus,
} from "@/features/admin/queries";
import {
  Plus,
  Search,
  Quote,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Star,
  MessageSquare,
} from "lucide-react";
import { TestimonialModal } from "@/features/admin/components/TestimonialModal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { AdminTestimonial } from "@/features/admin/api";

export default function AdminTestimonialsPage() {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<AdminTestimonial | null>(null);

  const queryParams: any = {
    search: search.trim() || undefined,
    rating: ratingFilter !== "all" ? Number(ratingFilter) : undefined,
    isActive: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
  };

  const { data, isLoading } = useAdminTestimonials(queryParams);
  const { data: stats } = useAdminTestimonialStats();
  const { mutate: deleteTestimonial, isPending: isDeleting } = useDeleteTestimonial();
  const { mutate: toggleStatus } = useToggleTestimonialStatus();

  const testimonials: AdminTestimonial[] = data?.data || [];

  const handleOpenCreate = () => {
    setSelectedTestimonial(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (testimonial: AdminTestimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (testimonial: AdminTestimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTestimonial) {
      const id = selectedTestimonial.id || selectedTestimonial._id;
      if (id) {
        deleteTestimonial(id, {
          onSuccess: () => {
            setIsDeleteModalOpen(false);
            setSelectedTestimonial(null);
          },
        });
      }
    }
  };

  const handleToggle = (testimonial: AdminTestimonial) => {
    const id = testimonial.id || testimonial._id;
    if (id) {
      toggleStatus(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Testimonials Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage customer reviews and feedback displayed on the homepage marquee.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="btn-premium w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total ?? testimonials.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Client testimonials</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active (Live)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats?.active ?? testimonials.filter((t) => t.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Rotating in marquee</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Inactive / Hidden</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats?.inactive ?? testimonials.filter((t) => !t.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Hidden from public</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 fill-[#D0BB74] text-[#D0BB74]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1.5">
              <span>{stats?.averageRating ? Number(stats.averageRating).toFixed(1) : "5.0"}</span>
              <span className="text-xs font-normal text-muted-foreground">/ 5.0</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client name, company, role, or review text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Rating" />
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            All Testimonials ({testimonials.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <Quote className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No Testimonials Found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                {search || ratingFilter !== "all" || statusFilter !== "all"
                  ? "No client stories match your current search or filter criteria."
                  : "Add your first client testimonial to display on the website."}
              </p>
              <Button onClick={handleOpenCreate} className="mt-4 btn-premium">
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t, index) => {
                const id = t.id || t._id;
                const avatarSrc = t.image || t.avatar;
                const reviewText = t.content || t.text;
                return (
                  <div
                    key={id || index}
                    className="border border-border/80 rounded-2xl p-5 hover:bg-muted/20 transition-all flex flex-col justify-between gap-4 group bg-card"
                  >
                    <div className="space-y-3">
                      {/* Card Header: Avatar, Name, Role, Rating */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 ring-2 ring-primary/10">
                            <AvatarImage src={avatarSrc} alt={t.name} />
                            <AvatarFallback className="font-semibold bg-[#6B4A2D]/10 text-[#6B4A2D]">
                              {t.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-bold text-foreground text-base leading-tight">
                              {t.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {t.role} {t.company ? `• ${t.company}` : ""}
                            </p>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5 bg-amber-500/10 px-2.5 py-1 rounded-full">
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3.5 h-3.5 fill-[#D0BB74] text-[#D0BB74]"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-sm text-muted-foreground leading-relaxed italic line-clamp-3">
                        "{reviewText}"
                      </p>
                    </div>

                    {/* Card Footer: Status & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/60">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={t.isActive}
                          onCheckedChange={() => handleToggle(t)}
                          aria-label="Toggle active status"
                        />
                        <span
                          className={`text-xs font-medium ${
                            t.isActive ? "text-emerald-600" : "text-muted-foreground"
                          }`}
                        >
                          {t.isActive ? "Live in Marquee" : "Hidden"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(t)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Edit Testimonial"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(t)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        testimonial={selectedTestimonial}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? It will immediately stop appearing in the website marquee. This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
}
