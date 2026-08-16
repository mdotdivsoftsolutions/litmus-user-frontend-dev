"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, FileText, Settings, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { uploadApi } from "@/lib/api/uploadApi";
import { toast } from "sonner";
import { ProfileSidebar } from "./components/profile/ProfileSidebar";
import { ProfileInfoTab } from "./components/profile/ProfileInfoTab";
import { ProfileDocumentsTab } from "./components/profile/ProfileDocumentsTab";
import { ProfileSettingsTab } from "./components/profile/ProfileSettingsTab";

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
    businessName: "",
    fssaiNo: "",
  });

  useEffect(() => {
    if (userResponse?.data) {
      const u = userResponse.data;
      setFormData({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phone: u.phone || "",
        businessName: u.companyName || "",
        fssaiNo: u.fssaiNumber || "",
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
    updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      companyName: formData.businessName,
      fssaiNumber: formData.fssaiNo,
    } as any);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  const tabs = [
    { id: "info", label: "Profile Information", icon: User },
    { id: "documents", label: "Business Documents", icon: FileText },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-action" />
      </div>
    );
  }

  const u = userResponse?.data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 pt-3 pb-16 md:pb-20 animate-fade-in flex flex-col md:flex-row gap-6">
      <ProfileSidebar user={u} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

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
