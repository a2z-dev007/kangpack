"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Home, Building2, Phone, MapPin } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { AddressDialog } from "@/components/profile/AddressDialog";
import { Address } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";

export default function AddressesPage() {
  const { user, loading, fetchProfile, addAddress, updateAddress, deleteAddress } = useProfile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAddClick = () => {
    setEditingAddress(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: any) => {
    let success = false;
    if (editingAddress) {
      success = await updateAddress(editingAddress.id!, values);
    } else {
      success = await addAddress(values);
    }

    if (success) {
      setDialogOpen(false);
    }
  };

  const handleDelete = (addressId: string) => {
    setDeleteId(addressId);
    setConfirmDialogOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      await deleteAddress(deleteId);
    } finally {
      setIsDeleting(false);
      setConfirmDialogOpen(false);
      setDeleteId(null);
    }
  };


  if (loading && !user) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const addresses = user?.addresses || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Saved Addresses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your delivery locations.
          </p>
        </div>
        <Button 
          onClick={handleAddClick}
          className="w-full sm:w-auto rounded-full shadow-lg shadow-primary/20 h-11 text-xs sm:text-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card
            key={address.id || address._id}
            className="border-none shadow-md hover:shadow-xl transition-all group bg-white relative overflow-hidden"
          >
            {address.isDefault && (
              <div className="absolute top-0 right-0 p-0">
                <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                  Default
                </div>
              </div>
            )}

            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted/50 rounded-full text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                    {address.type?.toLowerCase() === "work" ? (
                      <Building2 className="h-5 w-5" />
                    ) : address.type?.toLowerCase() === "home" ? (
                      <Home className="h-5 w-5" />
                    ) : (
                      <MapPin className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base sm:text-lg capitalize">
                        {address.type || "Address"}
                      </h3>
                    </div>
                    <p className="font-medium text-gray-900 mt-1">
                      {address.fullName || `${address.firstName} ${address.lastName}`}
                    </p>
                  </div>
                </div>

                <div className="pl-[3.25rem] space-y-2 text-sm text-muted-foreground">
                  <p className="leading-relaxed">
                    {address.addressLine1}
                    {address.addressLine2 && <><br />{address.addressLine2}</>}
                    <br />
                    {address.city}, {address.state} {address.postalCode}
                    <br />
                    {address.country}
                  </p>
                  <div className="flex items-center gap-2 pt-1 font-medium text-gray-700">
                    <Phone className="h-3.5 w-3.5" />
                    {address.phone}
                  </div>
                </div>

                <div className="pt-4 flex gap-3 justify-end border-t border-dashed mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(address)}
                    className="hover:bg-primary/5 hover:text-primary rounded-lg"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(address.id || address._id!)}
                    className="hover:bg-red-50 hover:text-red-500 rounded-lg text-muted-foreground"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Address Placeholder Card */}
        <button 
          onClick={handleAddClick}
          className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all group h-full min-h-[250px]"
        >
          <div className="p-4 rounded-full bg-muted group-hover:bg-white mb-4 shadow-sm transition-colors">
            <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          </div>
          <h3 className="font-semibold text-lg text-muted-foreground group-hover:text-primary">
            Add Address
          </h3>
        </button>
      </div>

      <AddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <ConfirmModal
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={onConfirmDelete}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
