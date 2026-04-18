"use client";

import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Save, Bell, Shield, Globe, Mail, Smartphone, Settings2, ShieldCheck, Zap, Activity } from "lucide-react";
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
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <AdminHeader
        title="System Protocol"
        description="Global configuration suite for system-wide operational parameters and security policies"
        roleAbbr="MP"
      />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto w-full space-y-8">
           {/* Strategic Title Section */}
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
              <div>
                <h2 className="text-3xl font-bold text-slate-950 tracking-tight">
                  Configuration Console
                </h2>
                <p className="text-slate-500 font-medium text-sm mt-0.5">
                  Calibrate core system behavior and high-level administrative boundaries
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="general" className="w-full space-y-8">
              <div className="flex justify-center">
                <TabsList className="h-14 p-1.5 bg-slate-100/50 backdrop-blur-md rounded-2xl border border-slate-100">
                  <TabsTrigger value="general" className="h-full px-8 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm transition-all">General Matrix</TabsTrigger>
                  <TabsTrigger value="notifications" className="h-full px-8 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm transition-all">Alert Stream</TabsTrigger>
                  <TabsTrigger value="security" className="h-full px-8 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm transition-all">Hardening Protocol</TabsTrigger>
                </TabsList>
              </div>

              {/* General Matrix Container */}
              <TabsContent value="general" className="space-y-6 focus-visible:outline-none">
                <Card className="border-none shadow-md shadow-slate-200/40 rounded-[32px] overflow-hidden bg-white">
                   <div className="h-1.5 bg-amber-500 w-full" />
                  <CardHeader className="p-8">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="p-2.5 bg-amber-50 rounded-2xl">
                          <Globe className="w-5 h-5 text-amber-600" />
                       </div>
                       <div>
                          <CardTitle className="text-2xl font-black text-slate-950 tracking-tight">Root Parameters</CardTitle>
                          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Synthesize and update primary system identification and status
                          </CardDescription>
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2 group">
                        <Label htmlFor="site-name" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Master Instance Identity</Label>
                        <Input
                          id="site-name"
                          defaultValue="Constituency Development Hub"
                          className="h-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-bold"
                        />
                      </div>
                      <div className="space-y-2 group">
                        <Label htmlFor="support-email" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Direct Oversight Contact</Label>
                        <Input id="support-email" defaultValue="support@cdh.gov" className="h-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-bold" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-3xl bg-slate-50/50 p-6 border border-slate-50 group hover:border-red-100 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-red-50 transition-colors">
                            <Activity className="w-5 h-5 text-red-500" />
                         </div>
                         <div className="space-y-0.5">
                            <Label className="text-base font-black text-slate-950 uppercase tracking-tight">Critical Maintenance Mode</Label>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              Temporarily suspend operational access for non-admin personnel
                            </p>
                         </div>
                      </div>
                      <Switch className="data-[state=checked]:bg-red-600" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 bg-slate-50/50 border-t border-slate-50 flex justify-end">
                    <Button className="h-12 px-8 bg-slate-950 text-white hover:bg-slate-800 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 group transition-all">
                      <div className="p-1.5 bg-amber-500 rounded-lg group-hover:rotate-12 transition-transform shadow-md shadow-amber-500/20">
                         <Save className="h-4 w-4 text-slate-950" />
                      </div>
                      Sync Parameters
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Alert Stream Container */}
              <TabsContent value="notifications" className="space-y-6 focus-visible:outline-none">
                <Card className="border-none shadow-md shadow-slate-200/40 rounded-[32px] overflow-hidden bg-white">
                   <div className="h-1.5 bg-amber-500 w-full" />
                  <CardHeader className="p-8">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="p-2.5 bg-amber-50 rounded-2xl">
                          <Bell className="w-5 h-5 text-amber-600" />
                       </div>
                       <div>
                          <CardTitle className="text-2xl font-black text-slate-950 tracking-tight">Alert Transmission Registry</CardTitle>
                          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                             Configure high-frequency alert stream protocols for system events
                          </CardDescription>
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                    <div className="flex items-center justify-between rounded-3xl bg-slate-50/50 p-6 border border-slate-50 group hover:border-amber-100 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50 transition-all">
                            <Mail className="w-6 h-6" />
                         </div>
                         <div className="space-y-0.5">
                            <Label className="text-base font-black text-slate-950 uppercase tracking-tight">Master Email Dispatch</Label>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              Receive summarized operational intel and critical alert pulses
                            </p>
                         </div>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-amber-500" />
                    </div>

                    <div className="flex items-center justify-between rounded-3xl bg-slate-50/50 p-6 border border-slate-50 group hover:border-amber-100 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50 transition-all">
                            <Smartphone className="w-6 h-6" />
                         </div>
                         <div className="space-y-0.5">
                            <Label className="text-base font-black text-slate-950 uppercase tracking-tight">Direct SMS Link</Label>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              Immediate transmission of high-level threat detections
                            </p>
                         </div>
                      </div>
                      <Switch className="data-[state=checked]:bg-amber-500" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 bg-slate-50/50 border-t border-slate-50 flex justify-end">
                    <Button className="h-12 px-8 bg-slate-950 text-white hover:bg-slate-800 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 group">
                       <div className="p-1.5 bg-amber-500 rounded-lg group-hover:rotate-12 transition-transform shadow-md shadow-amber-500/20">
                         <Save className="h-4 w-4 text-slate-950" />
                      </div>
                      Deploy Protocol
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Hardening Protocol Container */}
              <TabsContent value="security" className="space-y-6 focus-visible:outline-none">
                <Card className="border-none shadow-md shadow-slate-200/40 rounded-[32px] overflow-hidden bg-white">
                   <div className="h-1.5 bg-amber-500 w-full" />
                  <CardHeader className="p-8">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="p-2.5 bg-amber-50 rounded-2xl">
                          <ShieldCheck className="w-5 h-5 text-amber-600" />
                       </div>
                       <div>
                          <CardTitle className="text-2xl font-black text-slate-950 tracking-tight">Access Hardening Matrix</CardTitle>
                          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                             Initialize and enforce high-level authentication rules and policies
                          </CardDescription>
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-8">
                    <div className="space-y-4 group">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-1 h-4 bg-amber-500 rounded-full" />
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Credential Rotation Lifecycle</Label>
                      </div>
                      <Select defaultValue="90">
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-black text-slate-950 uppercase tracking-widest text-[10px]">
                          <SelectValue placeholder="Unified Cycle" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                          <SelectItem value="30" className="font-bold text-[10px] uppercase tracking-widest">30 Day Cycle</SelectItem>
                          <SelectItem value="60" className="font-bold text-[10px] uppercase tracking-widest">60 Day Cycle</SelectItem>
                          <SelectItem value="90" className="font-bold text-[10px] uppercase tracking-widest">90 Day Cycle</SelectItem>
                          <SelectItem value="never" className="font-bold text-[10px] uppercase tracking-widest text-red-600 italic">No Expiration</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] font-medium text-slate-400 italic px-2">Mandatory password reset frequency for administrative personnel.</p>
                    </div>

                    <div className="flex items-center justify-between rounded-3xl bg-slate-50/50 p-6 border border-slate-50 group hover:border-emerald-100 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-all">
                            <Zap className="w-6 h-6" />
                         </div>
                         <div className="space-y-0.5">
                            <Label className="text-base font-black text-slate-950 uppercase tracking-tight">Dual-Layer 2FA Enforced</Label>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              Mandatory multi-factor verification for all elevated access tiers
                            </p>
                         </div>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 bg-slate-50/50 border-t border-slate-50 flex justify-end">
                    <Button className="h-12 px-8 bg-slate-950 text-white hover:bg-slate-800 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 group">
                       <div className="p-1.5 bg-amber-500 rounded-lg group-hover:rotate-12 transition-transform shadow-md shadow-amber-500/20">
                         <ShieldCheck className="h-4 w-4 text-slate-950" />
                      </div>
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
