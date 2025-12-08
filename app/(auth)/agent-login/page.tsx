import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AgentLoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
        {/* SVG Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full text-indigo-900/20"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="officerGrid"
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
            <rect width="100" height="100" fill="url(#officerGrid)" />
          </svg>
        </div>

        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800">
          <Users className="h-6 w-6 text-orange-500" />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="mb-6 text-4xl font-bold leading-tight">
            Constituency Issue Management System
          </h1>
          <p className="mb-8 text-lg text-slate-400">
            Empowering agents to efficiently track, manage, and resolve community
            issues for better constituent services.
          </p>

          <div className="space-y-4">
            {[
              "Real-time issue tracking",
              "Comprehensive reporting tools",
              "Streamlined workflow management",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
          © 2024 Constituency Hub. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col justify-center bg-white p-8 lg:w-1/2 lg:p-24">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500">
              Please sign in to your agent account
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
                  placeholder="agent.rock@kofibenteh.com"
                  type="email"
                  className="pl-10 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500"
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
                  className="pl-10 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <Button
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-base"
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
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              Contact your system administrator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
