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
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Account Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your security and preferences.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" /> Security
          </h3>
          <div className="bg-slate-50/50 rounded-xl p-4 border border-border flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Password</p>
                <p className="text-xs text-muted-foreground">Change your login password</p>
              </div>
              <Button
                type="button"
                onClick={() => (showPasswordForm ? closeForm() : setShowPasswordForm(true))}
                variant="outline"
                className="h-9 rounded-lg text-xs"
              >
                {showPasswordForm ? "Cancel" : "Change"}
              </Button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="pt-4 border-t border-border grid gap-4 animate-fade-in">
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
                    className="bg-brand-action hover:bg-brand-action-hover text-white rounded-lg h-9 px-6 text-xs"
                  >
                    {isChangingPassword ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                    Update Password
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" /> Notifications
          </h3>
          <div className="grid gap-2">
            {notificationOptions.map((pref) => {
              const isActive = notifications[pref.id as keyof typeof notifications];
              return (
                <div
                  key={pref.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-slate-50/50 cursor-pointer transition-colors"
                  onClick={() => onToggleNotification(pref.id, !isActive)}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{pref.title}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                  <div className={cn("w-9 h-5 rounded-full p-0.5 transition-colors duration-200", isActive ? "bg-brand-action" : "bg-muted-foreground/30")}>
                    <div className={cn("h-4 w-4 bg-white rounded-full shadow-sm transition-transform duration-200", isActive ? "translate-x-4" : "translate-x-0")} />
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
