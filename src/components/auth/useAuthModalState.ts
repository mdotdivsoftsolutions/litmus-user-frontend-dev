"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";

export type AuthStep = "login" | "register" | "otp" | "forgot" | "forgot-otp" | "reset-password" | "reset-success";

export function useAuthModalState(isOpen: boolean, onClose: () => void) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<AuthStep>("login");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [regData, setRegData] = useState({ name: "", email: "", phone: "", pass: "" });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      toast.success("Welcome back!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid credentials");
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: authApi.sendOtp,
    onSuccess: () => {
      toast.success("OTP sent to your email!");
      setStep("otp");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success("Account created successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Password reset code sent to your email!");
      setStep("forgot-otp");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send reset code");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully!");
      setStep("reset-success");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });

  const handleOtpChange = (index: number, value: string, prefix = "otp") => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`${prefix}-${index + 1}`)?.focus();
    }
  };

  const handleLoginSubmit = (email: string, pass: string) => {
    loginMutation.mutate({ email, password: pass });
  };

  const handleRegisterSubmit = (data: { name: string; email: string; phone: string; pass: string }) => {
    setRegData(data);
    sendOtpMutation.mutate({ email: data.email.trim(), phone: data.phone.trim() });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) return;
    const nameParts = regData.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    registerMutation.mutate({
      firstName,
      lastName,
      email: regData.email,
      phone: regData.phone,
      password: regData.pass,
      role: "USER" as any,
      otp: otpCode,
    });
  };

  const handleForgotSend = (identifier: string) => {
    setForgotIdentifier(identifier);
    forgotPasswordMutation.mutate({ email: identifier });
  };

  const handleForgotOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length < 6) return;
    setStep("reset-password");
  };

  const handleResetPassword = (newPass: string) => {
    resetPasswordMutation.mutate({
      email: forgotIdentifier,
      otp: otp.join(""),
      newPassword: newPass,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setStep("login");
      setOtp(["", "", "", "", "", ""]);
      setForgotIdentifier("");
      setRegData({ name: "", email: "", phone: "", pass: "" });
    }
  }, [isOpen]);

  return {
    step,
    setStep,
    otp,
    regData,
    forgotIdentifier,
    handleOtpChange,
    handleLoginSubmit,
    handleRegisterSubmit,
    handleVerifyOtp,
    handleForgotSend,
    handleForgotOtpSubmit,
    handleResetPassword,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isSendOtpLoading: sendOtpMutation.isPending,
    isForgotLoading: forgotPasswordMutation.isPending,
    isResetLoading: resetPasswordMutation.isPending,
  };
}
