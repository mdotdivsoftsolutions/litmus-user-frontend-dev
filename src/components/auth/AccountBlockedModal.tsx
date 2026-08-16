"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface AccountBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountBlockedModal({ isOpen, onClose }: AccountBlockedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-xl">Account Suspended</DialogTitle>
          <DialogDescription className="pt-2 text-base text-center">
            Your account is temporarily blocked. Please contact the administrator to resolve this issue and restore your access.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-6">
          <Button onClick={onClose} className="w-full sm:w-auto px-8">
            Understood
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
