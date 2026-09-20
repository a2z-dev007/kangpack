"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminFaqs,
  useAdminFaqStats,
  useDeleteFaq,
  useToggleFaqStatus,
} from "@/features/admin/queries";
import {
  Plus,
  Search,
  HelpCircle,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
} from "lucide-react";
import { FaqModal } from "@/features/admin/components/FaqModal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { AdminFaq } from "@/features/admin/api";

export default function AdminFaqsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<AdminFaq | null>(null);

  const queryParams: any = {
    search: search.trim() || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    isActive: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
  };

  const { data, isLoading } = useAdminFaqs(queryParams);
  const { data: stats } = useAdminFaqStats();
  const { mutate: deleteFaq, isPending: isDeleting } = useDeleteFaq();
  const { mutate: toggleStatus } = useToggleFaqStatus();

  const faqs: AdminFaq[] = data?.data || [];
  const categories: string[] = stats?.categories || [];

  const handleOpenCreate = () => {
    setSelectedFaq(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: AdminFaq) => {
    setSelectedFaq(faq);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (faq: AdminFaq) => {
    setSelectedFaq(faq);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFaq) {
      const id = selectedFaq.id || selectedFaq._id;
      if (id) {
        deleteFaq(id, {
          onSuccess: () => {
            setIsDeleteModalOpen(false);
            setSelectedFaq(null);
          },
        });
      }
    }
  };

  const handleToggle = (faq: AdminFaq) => {
    const id = faq.id || faq._id;
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
            FAQ Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Add and manage frequently asked questions visible across the Kangpack website.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="btn-premium w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total ?? faqs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Stored in database</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active (Live)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats?.active ?? faqs.filter((f) => f.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Visible to customers</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Inactive / Drafts</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats?.inactive ?? faqs.filter((f) => !f.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Hidden from public</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Content topics</p>
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
                placeholder="Search questions or answers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
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

      {/* FAQ Items List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            All FAQs ({faqs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No FAQs Found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                {search || categoryFilter !== "all" || statusFilter !== "all"
                  ? "No questions match your current search or filter criteria."
                  : "Get started by adding your first FAQ question and answer."}
              </p>
              <Button onClick={handleOpenCreate} className="mt-4 btn-premium">
                <Plus className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const id = faq.id || faq._id;
                return (
                  <div
                    key={id || index}
                    className="border border-border/80 rounded-xl p-4 sm:p-5 hover:bg-muted/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#6B4A2D]/10 text-[#6B4A2D] flex items-center justify-center font-mono font-bold text-xs">
                        {String(faq.order ?? index + 1).padStart(2, "0")}
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-base text-foreground leading-snug">
                            {faq.question}
                          </h4>
                          {faq.category && (
                            <Badge variant="outline" className="text-xs bg-muted/60">
                              {faq.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-border/50">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={faq.isActive}
                          onCheckedChange={() => handleToggle(faq)}
                          aria-label="Toggle active status"
                        />
                        <span
                          className={`text-xs font-medium ${
                            faq.isActive ? "text-emerald-600" : "text-muted-foreground"
                          }`}
                        >
                          {faq.isActive ? "Active" : "Hidden"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(faq)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Edit FAQ"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(faq)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          title="Delete FAQ"
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
      <FaqModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        faq={selectedFaq}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete FAQ Question"
        description="Are you sure you want to delete this FAQ? This question will no longer appear on the website. This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
}
