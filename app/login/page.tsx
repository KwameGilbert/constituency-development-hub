"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Shield,
  MapPin,
  Users,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/services/auth-service";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);

    try {
      const response = await authService.login(data);

      if (response.success) {
        const user = response.data.user;
        const token = response.data.access_token;
        const dashboardUrl = authService.getDashboardForRole(user.role);

        // Sync auth state with Zustand store
        const { useAuthStore } = await import("@/lib/stores/auth-store");
        useAuthStore.getState().login(
          {
            id: String(user.id),
            name: user.name || "",
            email: user.email,
            role: user.role,
          },
          token,
        );

        // Check for returnUrl
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get("returnUrl");

        toast.success(`Welcome back, ${user.name || user.email}!`);

        // Use window.location.href to force a full page reload
        // This ensures middleware sees the new cookies immediately
        // Prioritize returnUrl if it exists, otherwise use role-based dashboard
        window.location.href = returnUrl
          ? decodeURIComponent(returnUrl)
          : dashboardUrl;
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during login";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left Panel: Branding ── */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%] bg-linear-to-br from-red-800 via-red-900 to-slate-900 text-white flex-col justify-between overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-300/5 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-14">
          {/* Top: Logo & Title */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-16">
              <Image
                src="/logo.png"
                alt="Constituency Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
              <div>
                <p className="font-bold text-lg leading-tight">
                  Hon. Kofi Benteh Afful
                </p>
                <p className="text-white/60 text-xs">
                  Office of the MP &middot; Sefwi Wiawso
                </p>
              </div>
            </Link>

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Constituency Development
              <br />
              <span className="text-amber-400">Hub</span>
            </h1>
            <p className="text-white/60 text-base max-w-md leading-relaxed">
              Empowering transparent governance and accelerating community
              development across Sefwi Wiawso.
            </p>
          </div>

          {/* Middle: Feature highlights */}
          <div className="grid grid-cols-1 gap-4 my-10">
            {[
              {
                icon: Users,
                title: "Community-Driven",
                desc: "Connecting citizens directly with constituency services",
              },
              {
                icon: Landmark,
                title: "Transparent Governance",
                desc: "Track projects, budgets, and development in real-time",
              },
              {
                icon: MapPin,
                title: "Sefwi Wiawso",
                desc: "Serving every community in the constituency",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 bg-white/5 rounded-xl p-4 backdrop-blur-xs border border-white/10"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-400/15 shrink-0">
                  <item.icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-white/50 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom: Footer */}
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Office of the MP, Sefwi Wiawso
            Constituency. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex flex-col w-full lg:w-1/2 xl:w-[45%] min-h-screen bg-white">
        {/* Mobile header (shown only on small screens) */}
        <div className="lg:hidden bg-red-700 px-6 py-4 flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
          />
          <div className="text-white">
            <p className="font-semibold text-sm leading-tight">
              Hon. Kofi Benteh Afful
            </p>
            <p className="text-white/70 text-[11px]">
              Office of the MP &middot; Sefwi Wiawso
            </p>
          </div>
        </div>

        {/* Form container */}
        <div className="flex flex-1 items-center justify-center px-6 sm:px-10 py-12">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome back
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-slate-700 text-sm font-medium"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20 rounded-xl"
                  {...form.register("email")}
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-slate-700 text-sm font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20 pr-10 rounded-xl"
                    {...form.register("password")}
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
                {form.formState.errors.password && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-400">
                  Authorized personnel only
                </span>
              </div>
            </div>

            {/* Help Text */}
            <p className="text-center text-sm text-slate-500">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Contact Support
              </Link>
            </p>

            {/* Back to Home */}
            <div className="text-center mt-8">
              <Link
                href="/"
                className="text-slate-400 hover:text-slate-600 text-sm transition-colors"
              >
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal open={forgotOpen} onOpenChange={setForgotOpen} />
    </div>
  );
}
