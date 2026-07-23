"use client";

import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import {
  Save,
  Bell,
  Globe,
  Mail,
  Smartphone,
  ShieldCheck,
  Zap,
  Activity,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SystemSettingsPage() {
  return (
    <div className="flex flex-col h-full w-full bg-slate-50/50 overflow-hidden">
      <AdminHeader
        title="System Protocol"
        description="Global configuration suite for system-wide operational parameters and security policies"
        roleAbbr="MP"
        dropdownItems={[
          {
            label: "System Audit",
            href: "/admin-dashboard/audit",
            icon: ShieldAlert,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-500 font-bold",
          },
        ]}
      />

      <div className="flex-1 p-6 sm:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1600px] mx-auto w-full space-y-6">
          {/* Strategic Title Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-amber-500 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Configuration Console
                </h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  Calibrate core system behavior and high-level administrative boundaries
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="general" className="w-full space-y-6">
              <div className="flex justify-center">
                <TabsList className="h-12 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
                  <TabsTrigger
                    value="general"
                    className="h-full px-6 rounded-lg font-semibold text-xs sm:text-sm text-slate-600 data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-xs transition-all"
                  >
                    General Matrix
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="h-full px-6 rounded-lg font-semibold text-xs sm:text-sm text-slate-600 data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-xs transition-all"
                  >
                    Alert Stream
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="h-full px-6 rounded-lg font-semibold text-xs sm:text-sm text-slate-600 data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-xs transition-all"
                  >
                    Hardening Protocol
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* General Matrix Container */}
              <TabsContent
                value="general"
                className="space-y-6 focus-visible:outline-none"
              >
                <Card className="border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden bg-white">
                  <div className="h-1 bg-amber-500 w-full" />
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                          Root Parameters
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 mt-0.5">
                          Synthesize and update primary system identification and status
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="site-name"
                          className="text-sm font-medium text-slate-700"
                        >
                          Master Instance Identity
                        </Label>
                        <Input
                          id="site-name"
                          defaultValue="Constituency Development Hub"
                          className="h-11 bg-slate-50/50 border border-slate-200 rounded-lg focus:border-amber-500 focus:ring-amber-500 text-slate-900 text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="support-email"
                          className="text-sm font-medium text-slate-700"
                        >
                          Direct Oversight Contact
                        </Label>
                        <Input
                          id="support-email"
                          defaultValue="support@cdh.gov"
                          className="h-11 bg-slate-50/50 border border-slate-200 rounded-lg focus:border-amber-500 focus:ring-amber-500 text-slate-900 text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-50/60 p-4 sm:p-5 border border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-xl shadow-xs text-red-500">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-sm font-semibold text-slate-900">
                            Critical Maintenance Mode
                          </Label>
                          <p className="text-xs text-slate-500">
                            Temporarily suspend operational access for non-admin personnel
                          </p>
                        </div>
                      </div>
                      <Switch className="data-[state=checked]:bg-red-600" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 bg-slate-50/40 border-t border-slate-100 flex justify-end">
                    <Button className="h-11 px-6 bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-xs font-semibold text-sm flex items-center gap-2 transition-all">
                      <Save className="h-4 w-4 text-amber-400" />
                      Sync Parameters
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Alert Stream Container */}
              <TabsContent
                value="notifications"
                className="space-y-6 focus-visible:outline-none"
              >
                <Card className="border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden bg-white">
                  <div className="h-1 bg-amber-500 w-full" />
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                          Alert Transmission Registry
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 mt-0.5">
                          Configure high-frequency alert stream protocols for system events
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50/60 p-4 sm:p-5 border border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-xl shadow-xs text-slate-500">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-sm font-semibold text-slate-900">
                            Master Email Dispatch
                          </Label>
                          <p className="text-xs text-slate-500">
                            Receive summarized operational intel and critical alert pulses
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-amber-500" />
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-50/60 p-4 sm:p-5 border border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-xl shadow-xs text-slate-500">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-sm font-semibold text-slate-900">
                            Direct SMS Link
                          </Label>
                          <p className="text-xs text-slate-500">
                            Immediate transmission of high-level threat detections
                          </p>
                        </div>
                      </div>
                      <Switch className="data-[state=checked]:bg-amber-500" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 bg-slate-50/40 border-t border-slate-100 flex justify-end">
                    <Button className="h-11 px-6 bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-xs font-semibold text-sm flex items-center gap-2">
                      <Save className="h-4 w-4 text-amber-400" />
                      Deploy Protocol
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Hardening Protocol Container */}
              <TabsContent
                value="security"
                className="space-y-6 focus-visible:outline-none"
              >
                <Card className="border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden bg-white">
                  <div className="h-1 bg-amber-500 w-full" />
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                          Access Hardening Matrix
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 mt-0.5">
                          Initialize and enforce high-level authentication rules and policies
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        Credential Rotation Lifecycle
                      </Label>
                      <Select defaultValue="90">
                        <SelectTrigger className="h-11 rounded-lg bg-slate-50/50 border border-slate-200 font-medium text-slate-900 text-sm">
                          <SelectValue placeholder="Unified Cycle" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border-slate-200">
                          <SelectItem value="30" className="font-medium text-sm">
                            30 Day Cycle
                          </SelectItem>
                          <SelectItem value="60" className="font-medium text-sm">
                            60 Day Cycle
                          </SelectItem>
                          <SelectItem value="90" className="font-medium text-sm">
                            90 Day Cycle
                          </SelectItem>
                          <SelectItem
                            value="never"
                            className="font-medium text-sm text-red-600"
                          >
                            No Expiration
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 italic">
                        Mandatory password reset frequency for administrative personnel.
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-50/60 p-4 sm:p-5 border border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-xl shadow-xs text-emerald-600">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-sm font-semibold text-slate-900">
                            Dual-Layer 2FA Enforced
                          </Label>
                          <p className="text-xs text-slate-500">
                            Mandatory multi-factor verification for all elevated access tiers
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 bg-slate-50/40 border-t border-slate-100 flex justify-end">
                    <Button className="h-11 px-6 bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-xs font-semibold text-sm flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-amber-400" />
                      Update Security
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
