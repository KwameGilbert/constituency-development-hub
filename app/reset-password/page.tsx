"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  CheckCircle,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/services/auth-service";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      setInvalidLink(true);
    }
  }, [token, email]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");

  // Password strength indicators
  const passwordChecks = [
    { label: "At least 8 characters", met: password?.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password || "") },
    { label: "One lowercase letter", met: /[a-z]/.test(password || "") },
    { label: "One number", met: /[0-9]/.test(password || "") },
  ];

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token || !email) {
      toast.error("Invalid reset link");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        email: decodeURIComponent(email),
        otp: token,
        password: data.password,
      });

      if (response.success) {
        setResetSuccess(true);
        toast.success("Password reset successful!");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error: unknown) {
      console.error("Reset password error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reset password";

      if (
        errorMessage.toLowerCase().includes("expired") ||
        errorMessage.toLowerCase().includes("invalid")
      ) {
        setInvalidLink(true);
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // Invalid/expired link state
  if (invalidLink) {
    return (
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            Invalid or Expired Link
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            This password reset link is invalid or has expired. Reset links are
            valid for 1 hour. Please request a new one.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/forgot-password" className="w-full">
            <Button
              type="button"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Request New Link
            </Button>
          </Link>

          <Link href="/login" className="w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mx-auto">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            Password Reset Successful!
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Your password has been updated. You can now sign in with your new
            password.
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
    );
  }

  // Form state
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Email display */}
      <div className="bg-white/5 rounded-lg px-4 py-3 border border-white/10">
        <p className="text-white/50 text-xs">Resetting password for</p>
        <p className="text-amber-400 text-sm font-medium">
          {email ? decodeURIComponent(email) : ""}
        </p>
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
            {...form.register("password")}
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
        {form.formState.errors.password && (
          <p className="text-red-400 text-sm">
            {form.formState.errors.password.message}
          </p>
        )}

        {/* Password strength indicators */}
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
                  className={check.met ? "text-green-400" : "text-white/40"}
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
            {...form.register("confirmPassword")}
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
        {form.formState.errors.confirmPassword && (
          <p className="text-red-400 text-sm">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
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

      {/* Back to Login */}
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
  );
}

// Loading fallback for suspense
function ResetPasswordLoading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
    </div>
  );
}

export default function ResetPasswordPage() {
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
            Create New Password
          </h1>
          <p className="text-amber-300/70">
            Choose a strong password for your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8">
          <Suspense fallback={<ResetPasswordLoading />}>
            <ResetPasswordForm />
          </Suspense>
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
