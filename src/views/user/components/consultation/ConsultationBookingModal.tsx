"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { consultationApi } from "@/lib/api/consultation";
import { toast } from "sonner";
import { ConsultationSuccessView } from "./ConsultationSuccessView";
import { ConsultationFormView } from "./ConsultationFormView";

interface ConsultationBookingModalProps {
  children: React.ReactNode;
  serviceName?: string;
  source?: string;
}

export function ConsultationBookingModal({
  children,
  serviceName = "Advisory Consultation",
  source = "General",
}: ConsultationBookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const consultationMutation = useMutation({
    mutationFn: consultationApi.createConsultation,
    onSuccess: () => {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: "", business: "", email: "", phone: "", date: "", time: "", message: "" });
        }, 500);
      }, 3000);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit request.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    consultationMutation.mutate({
      ...formData,
      serviceName,
      source,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && isSubmitted) return;
        setIsOpen(open);
        if (!open) setTimeout(() => setIsSubmitted(false), 500);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border border-border shadow-lg [&>button]:hidden">
        {isSubmitted ? (
          <ConsultationSuccessView serviceName={serviceName} />
        ) : (
          <ConsultationFormView
            serviceName={serviceName}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isPending={consultationMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
