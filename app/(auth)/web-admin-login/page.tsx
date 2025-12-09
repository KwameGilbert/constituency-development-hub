import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WebAdminLoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-violet-950 p-12 text-white lg:flex">
        {/* SVG Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full text-violet-900/20"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="webAdminGrid"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 8 0 L 0 0 0 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <circle
                  cx="4"
                  cy="4"
                  r="0.5"
                  fill="currentColor"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#webAdminGrid)" />
          </svg>
        </div>

        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-900/50 border border-violet-800">
          <Globe className="h-6 w-6 text-violet-300" />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="mb-6 text-4xl font-bold leading-tight">
            Constituency Issue Report Management
          </h1>
          <p className="mb-8 text-lg text-violet-200">
            Manage blog posts, events, carousels, and more to keep the constituency informed and engaged.
          </p>

          <div className="space-y-4">
            {[
              "Manage website content",
              "Update blog posts and events",
              "Configure system settings",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-violet-900/30 p-4 rounded-xl border border-violet-800/50 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-violet-400" />
                <span className="text-violet-100 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-violet-300">
          © 2024 Constituency Hub. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col justify-center bg-white p-8 lg:w-1/2 lg:p-24">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500">
              Please sign in to your web admin account
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3 top-3 text-slate-400">
                  <span className="text-lg">@</span>
                </div>
                <Input
                  id="email"
                  placeholder="admin@kofibenteh.com"
                  type="email"
                  className="pl-10 bg-slate-50 border-slate-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-3 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  className="pl-10 bg-slate-50 border-slate-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
            </div>

            <Button
              className="w-full bg-violet-950 hover:bg-violet-900 text-white h-12 text-base"
              type="submit"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Sign in to your account
            </Button>
          </form>

          <div className="text-center text-sm text-slate-500">
            Need help?{" "}
            <Link
              href="#"
              className="font-medium text-violet-700 hover:text-violet-600"
            >
              Contact your system administrator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
