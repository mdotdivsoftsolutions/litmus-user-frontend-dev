"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthLoginForm } from "./AuthLoginForm";
import { AuthRegisterForm } from "./AuthRegisterForm";
import { AuthOtpForm } from "./AuthOtpForm";
import { AuthForgotPasswordForm } from "./AuthForgotPasswordForm";
import { AuthResetPasswordForm } from "./AuthResetPasswordForm";
import { AuthResetSuccess } from "./AuthResetSuccess";
import { useAuthModalState, AuthStep } from "./useAuthModalState";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSkippable?: boolean;
}

const subtitles: Record<AuthStep, string> = {
  login: "Welcome back! Sign in to continue.",
  register: "Create your account to get started.",
  otp: "Enter the 6-digit code sent to your email.",
  forgot: "Enter your registered email or phone number.",
  "forgot-otp": "Enter the 6-digit code sent to your account.",
  "reset-password": "Set a new strong password for your account.",
  "reset-success": "",
};

const backTarget: Partial<Record<AuthStep, AuthStep>> = {
  register: "login",
  otp: "login",
  forgot: "login",
  "forgot-otp": "forgot",
  "reset-password": "forgot",
};

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const state = useAuthModalState(isOpen, onClose);
  const showBack = state.step !== "login" && state.step !== "reset-success";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none rounded-2xl shadow-2xl bg-white [&>button:first-child]:hidden">
        <div className="p-8 relative">
          {showBack && (
            <button
              onClick={() => state.setStep(backTarget[state.step] ?? "login")}
              className="absolute top-5 left-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          {state.step !== "reset-success" && (
            <div className="flex flex-col items-center mb-7">
              <img src="/logo.png" alt="Litmus" className="h-10 object-contain mb-5" />
              <p className="text-slate-500 text-[14px] text-center">{subtitles[state.step]}</p>
            </div>
          )}

          {state.step === "login" && (
            <AuthLoginForm
              onSubmit={state.handleLoginSubmit}
              onGoToRegister={() => state.setStep("register")}
              onGoToForgot={() => state.setStep("forgot")}
              isLoading={state.isLoginLoading}
            />
          )}

          {state.step === "register" && (
            <AuthRegisterForm
              onSubmit={state.handleRegisterSubmit}
              onGoToLogin={() => state.setStep("login")}
              isLoading={state.isSendOtpLoading}
            />
          )}

          {state.step === "otp" && (
            <AuthOtpForm
              otp={state.otp}
              onChangeOtp={(i, v) => state.handleOtpChange(i, v, "otp")}
              onSubmit={state.handleVerifyOtp}
              onResend={() => state.handleRegisterSubmit(state.regData)}
              isLoading={state.isRegisterLoading}
            />
          )}

          {state.step === "forgot" && (
            <AuthForgotPasswordForm
              onSubmit={state.handleForgotSend}
              onGoToLogin={() => state.setStep("login")}
              isLoading={state.isForgotLoading}
            />
          )}

          {state.step === "forgot-otp" && (
            <AuthOtpForm
              otp={state.otp}
              prefix="fotp"
              submitLabel="Verify Code"
              onChangeOtp={(i, v) => state.handleOtpChange(i, v, "fotp")}
              onSubmit={state.handleForgotOtpSubmit}
              onResend={() => state.handleForgotSend(state.forgotIdentifier)}
              isLoading={false}
            />
          )}

          {state.step === "reset-password" && (
            <AuthResetPasswordForm
              onSubmit={state.handleResetPassword}
              isLoading={state.isResetLoading}
            />
          )}

          {state.step === "reset-success" && (
            <AuthResetSuccess onGoToLogin={() => state.setStep("login")} />
          )}

          {state.step !== "reset-success" && (
            <div className="mt-7 text-center px-4">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                By proceeding, you agree to our{" "}
                <Link href="/terms" onClick={onClose} className="underline hover:text-slate-600">
                  Terms of Service
                </Link>{" "}
                &amp;{" "}
                <Link href="/privacy" onClick={onClose} className="underline hover:text-slate-600">
                  Privacy Policy
                </Link>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
