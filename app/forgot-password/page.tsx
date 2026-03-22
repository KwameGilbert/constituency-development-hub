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
  Shield,
  CheckCircle,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/services/auth-service";
import { toast } from "sonner";
import Link from "next/link";

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
    <div className="flex justify-center gap-2 sm:gap-3">
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
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold
            bg-white/10 border-2 border-white/20 rounded-lg text-white
            focus:border-red-500 focus:ring-2 focus:ring-red-500/30 focus:outline-none
            disabled:opacity-50 transition-all duration-200
            placeholder:text-white/20"
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
                    ? "bg-red-600 text-white ring-2 ring-red-400/50"
                    : "bg-white/10 text-white/40"
              }`}
            >
              {i < currentIndex ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs hidden sm:inline ${
                i <= currentIndex ? "text-white/80" : "text-white/30"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 rounded transition-all duration-300 ${
                i < currentIndex ? "bg-green-500" : "bg-white/10"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────
export default function ForgotPasswordPage() {
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

  // ── Resend cooldown timer ──
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // ── Step 1: Send OTP ──
  async function handleSendOTP(data: EmailFormValues) {
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(data.email);
      if (response.success) {
        setEmail(data.email);
        setStep("otp");
        setResendCooldown(60);
        toast.success("Verification code sent to your email");
      } else {
        // For security, still proceed (API returns success for non-existent emails)
        setEmail(data.email);
        setStep("otp");
        setResendCooldown(60);
      }
    } catch {
      // Still proceed for security
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
      title: "Password Reset!",
      subtitle: "Your password has been updated successfully",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-red-950 to-slate-900 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

      <div className="relative w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 border border-red-500/30 mb-4">
            <Shield className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {headerText[step].title}
          </h1>
          <p className="text-amber-300/70 text-sm">
            {headerText[step].subtitle}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8">
          {step !== "success" && <StepIndicator currentStep={step} />}

          {/* ── Step 1: Email ── */}
          {step === "email" && (
            <form
              onSubmit={emailForm.handleSubmit(handleSendOTP)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:ring-red-500"
                  {...emailForm.register("email")}
                  disabled={isLoading}
                />
                {emailForm.formState.errors.email && (
                  <p className="text-red-400 text-sm">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-red-600/25 hover:shadow-red-600/40"
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

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* ── Step 2: OTP Verification ── */}
          {step === "otp" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <OTPInput value={otp} onChange={setOtp} disabled={isLoading} />

                {isLoading && (
                  <div className="flex items-center justify-center gap-2 text-amber-400 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </div>
                )}
              </div>

              <Button
                type="button"
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-red-600/25 hover:shadow-red-600/40"
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

              {/* Resend & info */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-left">
                    <p className="text-white/80 text-sm font-medium">
                      Didn&apos;t receive the code?
                    </p>
                    <ul className="text-white/50 text-xs mt-1 space-y-1">
                      <li>• Check your spam/junk folder</li>
                      <li>• The code expires in 1 hour</li>
                    </ul>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || isLoading}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 text-sm"
                >
                  <Mail className="mr-2 h-3.5 w-3.5" />
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend Code"}
                </Button>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                  }}
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Change Email
                </button>
                <Link
                  href="/login"
                  className="text-sm text-white/40 hover:text-white/60 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </div>
          )}

          {/* ── Step 3: New Password ── */}
          {step === "password" && (
            <form
              onSubmit={passwordForm.handleSubmit(handleResetPassword)}
              className="space-y-6"
            >
              {/* Email display */}
              <div className="bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                <p className="text-white/50 text-xs">Resetting password for</p>
                <p className="text-amber-400 text-sm font-medium">{email}</p>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:ring-red-500 pr-10"
                    {...passwordForm.register("password")}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.password && (
                  <p className="text-red-400 text-sm">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}

                {/* Password strength */}
                {password && (
                  <div className="space-y-1.5 mt-2">
                    {passwordChecks.map((check) => (
                      <div
                        key={check.label}
                        className="flex items-center gap-2 text-xs"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${check.met ? "bg-green-400" : "bg-white/20"}`}
                        />
                        <span
                          className={
                            check.met ? "text-green-400" : "text-white/40"
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/90">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:ring-red-500 pr-10"
                    {...passwordForm.register("confirmPassword")}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-red-400 text-sm">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-red-600/25 hover:shadow-red-600/40"
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

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-white/40 hover:text-white/60 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}

          {/* ── Success ── */}
          {step === "success" && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mx-auto">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-white">
                  Password Updated!
                </h2>
                <p className="text-white/60 text-sm leading-relaxed">
                  Your password has been reset successfully. You can now sign in
                  with your new password.
                </p>
              </div>

              <Link href="/login" className="w-full block">
                <Button
                  type="button"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-red-600/25 hover:shadow-red-600/40"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go to Login
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
