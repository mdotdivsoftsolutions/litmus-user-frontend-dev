"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, FileText, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { uploadApi } from "@/lib/api/uploadApi";
import { toast } from "sonner";
import { ProfileSidebar } from "./components/profile/ProfileSidebar";
import { ProfileInfoTab } from "./components/profile/ProfileInfoTab";
import { ProfileDocumentsTab } from "./components/profile/ProfileDocumentsTab";
import { ProfileSettingsTab } from "./components/profile/ProfileSettingsTab";

function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-3 pb-16 md:pb-20 flex flex-col md:flex-row gap-6 animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="w-full md:w-72 shrink-0 space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-full" />
          <div className="w-full space-y-2 pt-3 border-t border-slate-100">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 space-y-1.5">
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 min-w-0 space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 space-y-2">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-3.5 w-72 rounded-md" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 space-y-2">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-3.5 w-72 rounded-md" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConsumerProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("info");
  const [notifications, setNotifications] = useState({ email: true, whatsapp: true, promo: false });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceIndexRef = useRef<number | null>(null);

  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getMe,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    businessName: "",
    industryCategory: "General Food & Beverage",
    customerSegment: "INDIVIDUAL",
    fssaiNo: "",
    gstNumber: "",
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingPincode: "",
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
  });

  useEffect(() => {
    if (userResponse?.data) {
      const u = userResponse.data;
      setFormData({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phone: u.phone || "",
        alternatePhone: u.alternatePhone || "",
        businessName: u.companyName || u.metadata?.businessName || "",
        industryCategory: u.industryCategory || "General Food & Beverage",
        customerSegment: u.customerSegment || "INDIVIDUAL",
        fssaiNo: u.fssaiNumber || "",
        gstNumber: u.gstNumber || u.metadata?.gstNumber || "",
        billingStreet: u.billingAddress?.street || u.address?.street || "",
        billingCity: u.billingAddress?.city || u.address?.city || "",
        billingState: u.billingAddress?.state || u.address?.state || "",
        billingPincode: u.billingAddress?.pincode || u.address?.pincode || u.address?.pinCode || "",
        shippingStreet: u.shippingAddress?.street || "",
        shippingCity: u.shippingAddress?.city || "",
        shippingState: u.shippingAddress?.state || "",
        shippingPincode: u.shippingAddress?.pincode || "",
      });
      if (u.notifications) setNotifications(u.notifications);
      else if (u.metadata?.notifications) setNotifications(u.metadata.notifications);
    }
  }, [userResponse]);

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to update profile"),
  });

  const { mutateAsync: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => toast.success("Password changed successfully"),
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to change password"),
  });

  const toPlainDocs = (docs: any[] = []) =>
    docs.map((d) => ({
      name: d.name,
      url: d.url,
      docType: d.docType || "Document",
      status: d.status || "Pending",
      size: d.size,
    }));

  const { mutate: persistDocuments, isPending: isSavingDocs } = useMutation({
    mutationFn: (documents: any[]) => authApi.updateProfile({ documents }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to update documents"),
  });

  const { mutate: uploadDocument, isPending: isUploading } = useMutation({
    mutationFn: async (file: File) => {
      const res = await uploadApi.uploadFile(file);
      const doc = {
        name: file.name,
        url: res.data.url,
        docType: "Document",
        status: "Pending",
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      };
      const current = toPlainDocs(userResponse?.data?.documents || []);
      const replaceAt = replaceIndexRef.current;
      const updatedDocs =
        replaceAt !== null && replaceAt >= 0
          ? current.map((item, i) => (i === replaceAt ? { ...item, ...doc, status: item.status || "Pending" } : item))
          : [...current, doc];
      replaceIndexRef.current = null;
      await authApi.updateProfile({ documents: updatedDocs });
      return { replaced: replaceAt !== null && replaceAt >= 0 };
    },
    onSuccess: (result) => {
      toast.success(result.replaced ? "Document replaced" : "Document uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: any) => {
      replaceIndexRef.current = null;
      toast.error(err.response?.data?.message || "Failed to upload document");
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) uploadDocument(file);
  };

  const handleReplaceClick = (index: number) => {
    replaceIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleDeleteDocument = (index: number) => {
    const current = toPlainDocs(userResponse?.data?.documents || []);
    persistDocuments(current.filter((_, i) => i !== index), {
      onSuccess: () => {
        toast.success("Document removed");
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
    });
  };

  const handleRenameDocument = (index: number, name: string) => {
    const current = toPlainDocs(userResponse?.data?.documents || []);
    persistDocuments(
      current.map((item, i) => (i === index ? { ...item, name } : item)),
      {
        onSuccess: () => {
          toast.success("Document name updated");
          queryClient.invalidateQueries({ queryKey: ["user"] });
        },
      }
    );
  };

  const handleToggleNotification = (id: string, value: boolean) => {
    const newNotifs = { ...notifications, [id]: value, promo: false };
    setNotifications(newNotifs);
    updateProfile({ notifications: newNotifs } as any);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    const u = userResponse?.data || {};

    const payload: Record<string, any> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      companyName: formData.businessName,
      industryCategory: formData.industryCategory,
      customerSegment: formData.customerSegment,
      fssaiNumber: formData.fssaiNo,
      gstNumber: formData.gstNumber,
      billingAddress: {
        street: formData.billingStreet,
        city: formData.billingCity,
        state: formData.billingState,
        pincode: formData.billingPincode,
        country: "India",
      },
      shippingAddress: {
        street: formData.shippingStreet,
        city: formData.shippingCity,
        state: formData.shippingState,
        pincode: formData.shippingPincode,
        country: "India",
      },
      address: {
        street: formData.billingStreet,
        city: formData.billingCity,
        state: formData.billingState,
        pincode: formData.billingPincode,
      },
    };

    if (formData.phone && formData.phone !== (u.phone || "")) {
      payload.phone = formData.phone;
    }
    if (formData.alternatePhone !== (u.alternatePhone || "")) {
      payload.alternatePhone = formData.alternatePhone;
    }

    updateProfile(payload as any);
  };


  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  const u = userResponse?.data || {};

  const tabs = [
    { id: "info", label: "Profile Information", icon: User },
    { id: "documents", label: "Business Documents", icon: FileText, badge: (u.documents || []).length || undefined },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-3 pb-16 md:pb-20 animate-fade-in flex flex-col md:flex-row gap-6 items-start">
      <div className="w-full md:w-72 shrink-0 md:sticky md:top-24">
        <ProfileSidebar user={u} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      </div>

      <div className="flex-1 min-w-0">
        {activeTab === "info" && (
          <ProfileInfoTab formData={formData} handleInputChange={handleInputChange} onSave={handleSave} isUpdating={isUpdating} />
        )}
        {activeTab === "documents" && (
          <ProfileDocumentsTab
            documents={u.documents}
            isUploading={isUploading}
            isSaving={isSavingDocs}
            onUploadClick={() => {
              replaceIndexRef.current = null;
              fileInputRef.current?.click();
            }}
            onReplaceClick={handleReplaceClick}
            onDelete={handleDeleteDocument}
            onRename={handleRenameDocument}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
          />
        )}
        {activeTab === "settings" && (
          <ProfileSettingsTab
            notifications={notifications}
            onToggleNotification={handleToggleNotification}
            onChangePassword={changePassword}
            isChangingPassword={isChangingPassword}
          />
        )}
      </div>
    </div>
  );
}
