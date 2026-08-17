"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Bell, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSettingsTabProps {
  notifications: { email: boolean; whatsapp: boolean; promo: boolean };
  onToggleNotification: (id: string, value: boolean) => void;
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void> | void;
  isChangingPassword: boolean;
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  error,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={cn("h-10 rounded-lg pr-10", error && "border-destructive focus-visible:ring-destructive")}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function ProfileSettingsTab({
  notifications,
  onToggleNotification,
  onChangePassword,
  isChangingPassword,
}: ProfileSettingsTabProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetForm = () => {
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setSubmitted(false);
  };

  const closeForm = () => {
    setShowPasswordForm(false);
    resetForm();
  };

  const tooShort = passwordData.newPassword.length > 0 && passwordData.newPassword.length < 6;
  const sameAsCurrent =
    passwordData.newPassword.length > 0 &&
    passwordData.currentPassword.length > 0 &&
    passwordData.newPassword === passwordData.currentPassword;
  const mismatch =
    passwordData.confirmPassword.length > 0 && passwordData.newPassword !== passwordData.confirmPassword;

  const canSubmit =
    passwordData.currentPassword.length > 0 &&
    passwordData.newPassword.length >= 6 &&
    passwordData.newPassword !== passwordData.currentPassword &&
    passwordData.newPassword === passwordData.confirmPassword &&
    !isChangingPassword;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!canSubmit) return;
    try {
      await onChangePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      closeForm();
    } catch {
      // Parent toast already shows "Incorrect current password". Keep values so the user can retry.
    }
  };

  const notificationOptions = [
    { id: "email", title: "Email Notifications", desc: "Receive updates via email" },
    { id: "whatsapp", title: "WhatsApp Alerts", desc: "Instant messages for critical updates" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">Account Security & Preferences</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Manage your credentials, password security, and communication preferences.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-brand-action" /> Password & Authentication
          </h3>
          <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Account Password</p>
                <p className="text-xs text-muted-foreground">Change your password to keep your account secure</p>
              </div>
              <Button
                type="button"
                onClick={() => (showPasswordForm ? closeForm() : setShowPasswordForm(true))}
                variant="outline"
                className="h-9 rounded-xl text-xs font-semibold bg-white border-slate-200"
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </Button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="pt-4 border-t border-slate-200 grid gap-4 animate-fade-in">
                <PasswordField
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(currentPassword) => setPasswordData((p) => ({ ...p, currentPassword }))}
                  visible={showCurrent}
                  onToggle={() => setShowCurrent((v) => !v)}
                  autoComplete="current-password"
                  error={submitted && !passwordData.currentPassword ? "Enter your current password" : undefined}
                />
                <PasswordField
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={(newPassword) => setPasswordData((p) => ({ ...p, newPassword }))}
                  visible={showNew}
                  onToggle={() => setShowNew((v) => !v)}
                  autoComplete="new-password"
                  error={
                    tooShort
                      ? "Use at least 6 characters"
                      : sameAsCurrent
                        ? "New password must be different from the current password"
                        : undefined
                  }
                />
                <PasswordField
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(confirmPassword) => setPasswordData((p) => ({ ...p, confirmPassword }))}
                  visible={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                  autoComplete="new-password"
                  error={mismatch ? "Passwords do not match" : undefined}
                />
                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    disabled={isChangingPassword || !canSubmit}
                    className="bg-brand-action hover:bg-brand-action-hover text-white rounded-xl h-10 px-6 text-xs font-semibold shadow-xs"
                  >
                    {isChangingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : null}
                    Update Password
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-brand-action" /> Notifications & Alerts
          </h3>
          <div className="grid gap-2.5">
            {notificationOptions.map((pref) => {
              const isActive = notifications[pref.id as keyof typeof notifications];
              return (
                <div
                  key={pref.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs cursor-pointer transition-all"
                  onClick={() => onToggleNotification(pref.id, !isActive)}
                >
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{pref.title}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                  <div className={cn("w-10 h-6 rounded-full p-0.5 transition-colors duration-200", isActive ? "bg-brand-action" : "bg-slate-200")}>
                    <div className={cn("h-5 w-5 bg-white rounded-full shadow-sm transition-transform duration-200", isActive ? "translate-x-4" : "translate-x-0")} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
