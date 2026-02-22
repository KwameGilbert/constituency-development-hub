"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  CheckCircle,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { authService } from "@/lib/services/auth-service";
import { toast } from "sonner";

// ─── Schemas ────────────────────────────────────────────────
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

type Step = "email" | "otp" | "password" | "success";

// ─── OTP Input Component ────────────────────────────────────
function OTPInput({
  length = 6,
  value,
  onChange,
  disabled,
}: {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, char: string) => {
    if (!/^\d*$/.test(char)) return;

    const newValue = value.split("");
    newValue[index] = char;
    const joined = newValue.join("").slice(0, length);
    onChange(joined);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    onChange(pastedData);
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-10 h-12 sm:w-11 sm:h-13 text-center text-xl font-bold
            border-2 border-slate-200 rounded-lg text-slate-900 bg-slate-50
            focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none
            disabled:opacity-50 transition-all duration-200"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ─── Step Indicator ─────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: Step }) {
  const steps = [
    { key: "email", label: "Email" },
    { key: "otp", label: "Verify" },
    { key: "password", label: "Reset" },
  ];

  const getStepIndex = (step: Step) => {
    if (step === "success") return 3;
    return steps.findIndex((s) => s.key === step);
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, i) => (
        <React.Fragment key={step.key}>
          <div className="flex items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                i < currentIndex
                  ? "bg-green-500 text-white"
                  : i === currentIndex
                    ? "bg-red-600 text-white ring-2 ring-red-400/30"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {i < currentIndex ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs hidden sm:inline ${
                i <= currentIndex ? "text-slate-700" : "text-slate-300"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 rounded transition-all duration-300 ${
                i < currentIndex ? "bg-green-500" : "bg-slate-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Modal Component ────────────────────────────────────────
interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ForgotPasswordModal({
  open,
  onOpenChange,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = passwordForm.watch("password");

  const passwordChecks = [
    { label: "At least 8 characters", met: password?.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password || "") },
    { label: "One lowercase letter", met: /[a-z]/.test(password || "") },
    { label: "One number", met: /[0-9]/.test(password || "") },
  ];

  // Reset state when modal closes
  function resetState() {
    setStep("email");
    setEmail("");
    setOtp("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setResendCooldown(0);
    setIsLoading(false);
    emailForm.reset();
    passwordForm.reset();
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  }

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // ── Step 1: Send OTP ──
  async function handleSendOTP(data: EmailFormValues) {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmail(data.email);
      setStep("otp");
      setResendCooldown(60);
      toast.success("Verification code sent to your email");
    } catch {
      // Still proceed for security (don't reveal if email exists)
      setEmail(data.email);
      setStep("otp");
      setResendCooldown(60);
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step 2: Verify OTP ──
  const handleVerifyOTP = useCallback(async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOTP(email, otp);
      if (response.success) {
        setStep("password");
        toast.success("Code verified! Enter your new password");
      } else {
        toast.error(response.message || "Invalid or expired code");
        setOtp("");
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Verification failed";
      toast.error(msg);
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  }, [otp, email]);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (otp.length === 6 && step === "otp" && !isLoading) {
      handleVerifyOTP();
    }
  }, [otp, step, isLoading, handleVerifyOTP]);

  // ── Step 3: Reset Password ──
  async function handleResetPassword(data: PasswordFormValues) {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword({
        email,
        otp,
        password: data.password,
      });
      if (response.success) {
        setStep("success");
        toast.success("Password reset successful!");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Failed to reset password";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  // ── Resend OTP ──
  async function handleResendOTP() {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setResendCooldown(60);
      setOtp("");
      toast.success("New code sent to your email");
    } catch {
      toast.error("Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Header text per step ──
  const headerText: Record<Step, { title: string; subtitle: string }> = {
    email: {
      title: "Reset Your Password",
      subtitle: "Enter your email to receive a verification code",
    },
    otp: {
      title: "Enter Verification Code",
      subtitle: `We sent a 6-digit code to ${email}`,
    },
    password: {
      title: "Create New Password",
      subtitle: "Choose a strong password for your account",
    },
    success: {
      title: "Password Updated!",
      subtitle: "Your password has been reset successfully",
    },
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md p-0 gap-0 overflow-hidden"
        showCloseButton={step !== "success"}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-red-600 to-red-700 px-6 py-5 text-white">
          <DialogTitle className="text-lg font-bold">
            {headerText[step].title}
          </DialogTitle>
          <p className="text-red-100 text-sm mt-1">
            {headerText[step].subtitle}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {step !== "success" && <StepIndicator currentStep={step} />}

          {/* ── Step 1: Email ── */}
          {step === "email" && (
            <form
              onSubmit={emailForm.handleSubmit(handleSendOTP)}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label
                  htmlFor="forgot-email"
                  className="text-slate-700 text-sm font-medium"
                >
                  Email Address
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20 rounded-xl"
                  {...emailForm.register("email")}
                  disabled={isLoading}
                />
                {emailForm.formState.errors.email && (
                  <p className="text-red-500 text-xs">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </form>
          )}

          {/* ── Step 2: OTP Verification ── */}
          {step === "otp" && (
            <div className="space-y-4">
              <OTPInput value={otp} onChange={setOtp} disabled={isLoading} />

              {isLoading && (
                <div className="flex items-center justify-center gap-2 text-red-600 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </div>
              )}

              <Button
                type="button"
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              {/* Resend info */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div className="text-left">
                    <p className="text-slate-600 text-sm font-medium">
                      Didn&apos;t receive the code?
                    </p>
                    <ul className="text-slate-400 text-xs mt-1 space-y-0.5">
                      <li>Check your spam/junk folder</li>
                      <li>The code expires in 1 hour</li>
                    </ul>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || isLoading}
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-200 text-slate-600 hover:bg-slate-100 text-xs rounded-lg"
                >
                  <Mail className="mr-1.5 h-3 w-3" />
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend Code"}
                </Button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                }}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1 mx-auto w-full justify-center"
              >
                <ArrowLeft className="w-3 h-3" />
                Change email address
              </button>
            </div>
          )}

          {/* ── Step 3: New Password ── */}
          {step === "password" && (
            <form
              onSubmit={passwordForm.handleSubmit(handleResetPassword)}
              className="space-y-4"
            >
              {/* Email tag */}
              <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                <p className="text-slate-400 text-[11px]">
                  Resetting password for
                </p>
                <p className="text-red-600 text-sm font-medium">{email}</p>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="new-password"
                  className="text-slate-700 text-sm font-medium"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="h-11 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20 pr-10 rounded-xl"
                    {...passwordForm.register("password")}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.password && (
                  <p className="text-red-500 text-xs">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}

                {/* Password strength */}
                {password && (
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {passwordChecks.map((check) => (
                      <div
                        key={check.label}
                        className="flex items-center gap-1.5 text-[11px]"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${check.met ? "bg-green-500" : "bg-slate-200"}`}
                        />
                        <span
                          className={
                            check.met ? "text-green-600" : "text-slate-400"
                          }
                        >
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirm-new-password"
                  className="text-slate-700 text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="h-11 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20 pr-10 rounded-xl"
                    {...passwordForm.register("confirmPassword")}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Reset Password
                  </>
                )}
              </Button>
            </form>
          )}

          {/* ── Success ── */}
          {step === "success" && (
            <div className="text-center space-y-4 py-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border border-green-100 mx-auto">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  All Done!
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Your password has been reset successfully. You can now sign in
                  with your new password.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200"
              >
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
