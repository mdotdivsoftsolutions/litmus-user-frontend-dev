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

  const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => toast.success("Password changed successfully"),
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to change password"),
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
      const updatedDocs = [...(userResponse?.data?.documents || []), doc];
      await authApi.updateProfile({ documents: updatedDocs });
      return doc;
    },
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to upload document"),
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) uploadDocument(e.target.files[0]);
  };

  const handleToggleNotification = (id: string, value: boolean) => {
    const newNotifs = { ...notifications, [id]: value };
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const u = userResponse?.data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:pb-20 animate-fade-in flex flex-col md:flex-row gap-6">
      <ProfileSidebar user={u} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <div className="flex-1">
        {activeTab === "info" && (
          <ProfileInfoTab formData={formData} handleInputChange={handleInputChange} onSave={handleSave} isUpdating={isUpdating} />
        )}
        {activeTab === "documents" && (
          <ProfileDocumentsTab
            documents={u.documents}
            isUploading={isUploading}
            onUploadClick={() => fileInputRef.current?.click()}
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
