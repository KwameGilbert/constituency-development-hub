import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock, Mail } from "lucide-react";

export default function OfficerLoginPage() {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Panel - Branding */}
            <div className="relative hidden w-1/2 flex-col justify-center bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 p-12 text-white lg:flex">
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
                                <circle cx="4" cy="4" r="0.5" fill="currentColor" opacity="0.3" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#officerGrid)" />
                    </svg>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    <div className="mb-8 flex h-20 w-20 items-center shadow-md justify-center rounded-xl bg-indigo-800/50 backdrop-blur-sm border border-indigo-700">
                        <ShieldCheck className="h-12 w-12 text-white" />
                    </div>

                    <h1 className="mb-2 text-4xl font-bold tracking-tight">
                        Officer Access Portal
                    </h1>
                    <p className="mb-8 text-lg text-indigo-200">
                        Constituency Management System
                    </p>

                    <p className="mb-8 text-indigo-100 leading-relaxed">
                        Comprehensive oversight and management tools for reviewing,
                        approving, and coordinating constituency issues across all levels.
                    </p>

                    <ul className="space-y-4 text-indigo-200">
                        <li className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            Issue review & approval workflow
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            Advanced analytics & reporting
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            Multi-level escalation management
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            Agent oversight & coordination
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex w-full flex-col justify-center bg-gray-50 p-8 lg:w-1/2 lg:p-24">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold text-gray-900">Welcome Officer</h2>
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                                Officer Access
                            </span>
                        </div>
                        <p className="text-gray-500">
                            Please sign in to your officer account
                        </p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Officer Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="officer.rock@kofibenteh.com"
                                    className="pl-10 bg-indigo-50/50 border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Secure Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••"
                                    className="pl-10 bg-indigo-50/50 border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 text-base">
                            <ShieldCheck className="mr-2 h-5 w-5" />
                            Access Officer Dashboard
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <div className="h-4 w-4 rounded-full bg-amber-400 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                            </div>
                            <span className="font-medium text-gray-700">Secure Officer Access</span>
                        </div>
                        <p className="mt-2 text-xs text-gray-400 max-w-xs mx-auto">
                            For technical support or access issues, contact your system administrator
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
