"use client";

import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
}: LogoutConfirmModalProps) {
  const { logout } = useAuth();
  const router = useRouter(); // Although useAuth's logout might handle redirects, manual redirect ensures safety
  // If useAuth logout is async, we can add loading state here.
  // Assuming it's a simple sync or fast async for now based on previous grep.
  // But let's check use-auth.ts to be sure.

  const handleConfirm = () => {
    logout();
    // Router push might be handled in useAuth or individual components,
    // but usually centralized or per-component.
    // The existing Navbar code did: logout(); router.push('/'); router.refresh();
    // So we should replicate that if we want consistent behavior,
    // OR we just call logout() and let the caller handle redirect?
    // No, the requirement is "bottom tab and nav logout ... all uses the same functionality".
    // So putting uniformity here is good.
    router.push("/");
    router.refresh();
    onClose();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Sign Out"
      description="Are you sure you want to sign out of your account?"
      variant="destructive"
    />
  );
}
