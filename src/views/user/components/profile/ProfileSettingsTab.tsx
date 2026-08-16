"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Bell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSettingsTabProps {
  notifications: { email: boolean; whatsapp: boolean; promo: boolean };
  onToggleNotification: (id: string, value: boolean) => void;
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => void;
  isChangingPassword: boolean;
}

export function ProfileSettingsTab({
  notifications,
  onToggleNotification,
  onChangePassword,
  isChangingPassword,
}: ProfileSettingsTabProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });

  const handlePasswordSubmit = () => {
    onChangePassword(passwordData);
    setPasswordData({ currentPassword: "", newPassword: "" });
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
                <p className="text-xs text-muted-foreground">Manage your login credentials</p>
              </div>
              <Button onClick={() => setShowPasswordForm(!showPasswordForm)} variant="outline" className="h-9 rounded-lg text-xs">
                {showPasswordForm ? "Cancel" : "Change"}
              </Button>
            </div>

            {showPasswordForm && (
              <div className="pt-4 border-t border-border grid gap-4 animate-fade-in">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Current Password</Label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                    className="h-10 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">New Password</Label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                    className="h-10 rounded-lg"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                    onClick={handlePasswordSubmit}
                    className="bg-brand-action hover:bg-brand-action-hover text-white rounded-lg h-9 px-6 text-xs"
                  >
                    {isChangingPassword ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                    Update Password
                  </Button>
                </div>
              </div>
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
