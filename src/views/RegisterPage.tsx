"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FlaskConical, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";
import { RegisterBrandPanel } from "./register/RegisterBrandPanel";
import { RegisterBusinessInfoStep } from "./register/RegisterBusinessInfoStep";
import { RegisterFssaiStep } from "./register/RegisterFssaiStep";
import { RegisterPasswordStep } from "./register/RegisterPasswordStep";
import { RegisterOtpStep } from "./register/RegisterOtpStep";

const stepLabels = ["Business Info", "FSSAI & GST", "Set Password", "OTP Verification"];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    fssaiNumber: "",
    fssaiExpiry: "",
    gstNumber: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkAvailabilityMutation = useMutation({
    mutationFn: authApi.checkAvailability,
    onSuccess: () => {
      setStep(1);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Email or Mobile number is already registered");
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: authApi.sendOtp,
    onSuccess: () => {
      toast.success("OTP sent to your email!");
      setStep(3);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success("Registration successful! Please log in.");
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  const handleNext = () => {
    if (step === 0) {
      if (!formData.businessName || !formData.ownerName || !formData.phone || !formData.email) {
        toast.error("Please fill in all required fields");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        toast.error("Please enter a valid email address");
        return;
      }
      const phoneDigits = formData.phone.replace(/[^0-9]/g, "");
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }
      checkAvailabilityMutation.mutate({
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });
    } else if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!formData.password || formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match or are empty");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      sendOtpMutation.mutate({
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });
    }
  };

  const handleRegister = () => {
    if (!formData.otp || formData.otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    const nameParts = formData.ownerName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    registerMutation.mutate({
      firstName,
      lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: "USER" as any,
      otp: formData.otp,
    });
  };

  return (
    <div className="flex min-h-screen">
      <RegisterBrandPanel />

      <div className="flex flex-1 items-center justify-center bg-background px-6 py-8">
        <Card className="w-full max-w-lg shadow-lg border border-border">
          <CardHeader className="items-center pb-2">
            <Link href="/" className="flex items-center gap-2 mb-4 lg:hidden">
              <FlaskConical className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">LITMUS</span>
            </Link>
            <h2 className="text-xl font-bold text-foreground">Register Your Business</h2>
            <div className="flex w-full items-center justify-between mt-4">
              {stepLabels.map((label, i) => (
                <div key={i} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                        i < step
                          ? "bg-primary text-primary-foreground"
                          : i === step
                            ? "bg-brand-action text-white"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className="text-[11px] text-muted-foreground hidden sm:block">{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={cn("mx-2 h-0.5 flex-1 rounded-full", i < step ? "bg-primary" : "bg-muted")} />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {step === 0 && <RegisterBusinessInfoStep formData={formData} handleChange={handleChange} setFormData={setFormData} />}
            {step === 1 && <RegisterFssaiStep formData={formData} handleChange={handleChange} />}
            {step === 2 && (
              <RegisterPasswordStep
                formData={formData}
                handleChange={handleChange}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            )}
            {step === 3 && <RegisterOtpStep email={formData.email} otp={formData.otp} handleChange={handleChange} />}

            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  className="flex-1 bg-brand-action hover:bg-brand-action-hover text-white"
                  onClick={handleNext}
                  disabled={checkAvailabilityMutation.isPending || sendOtpMutation.isPending}
                >
                  {checkAvailabilityMutation.isPending
                    ? "Checking details..."
                    : step === 2 && sendOtpMutation.isPending
                    ? "Sending OTP..."
                    : "Continue"}
                </Button>
              ) : (
                <Button
                  className="flex-1 bg-brand-action hover:bg-brand-action-hover text-white"
                  onClick={handleRegister}
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Verifying..." : "Complete Registration"}
                </Button>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
