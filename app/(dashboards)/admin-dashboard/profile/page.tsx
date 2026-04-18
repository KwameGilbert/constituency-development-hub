"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  MapPin,
  Lock,
  Info,
  Save,
  Shield,
  Loader2,
  Camera,
  History,
  Mail,
  Phone,
  Briefcase,
  Activity,
  ArrowRight,
} from "lucide-react";
import {
  profileService,
  UserProfile,
  UserActivity,
} from "@/lib/services/profile-service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    department: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, activityRes] = await Promise.all([
          profileService.getProfile(),
          profileService.getActivity(1, 5),
        ]);

        if (profileRes.success) {
          setProfile(profileRes.data.user);
          setFormData({
            name: profileRes.data.user.name,
            phone: profileRes.data.user.phone || "",
            department: "Administration",
            bio: profileRes.data.user.bio || "",
          });
        }

        if (activityRes.success) {
          setActivities(activityRes.data.activities);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
        toast.error("Process Failure: Identity synchronization interrupted");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await profileService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
      });

      if (response.success) {
        setProfile(response.data.user);
        toast.success("Identity Registry updated");
      } else {
        toast.error(response.message || "Modification failure");
      }
    } catch (error) {
      toast.error("System process error");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast.error("Protocol Error: Credential mismatch");
      setSubmitting(false);
      return;
    }

    try {
      const response = await profileService.changePassword(passwordData);
      if (response.success) {
        toast.success("Security protocol updated: Password changed");
        setPasswordData({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        toast.error(response.message || "Security violation: Check permissions");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Security system failure";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await profileService.uploadAvatar(file);
      if (response.success && profile) {
        setProfile({ ...profile, avatar: response.data.avatar });
        toast.success("Visual signature updated");
      }
    } catch (error) {
      toast.error("Visual registry failure");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50/50 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validating Administrative Identity...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <AdminHeader
        title="Admin Identity"
        description="Strategic credentials, visual signature, and operational activity registry"
        roleAbbr="MP"
      />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
          {/* Left Column: Visual Signature & Stats */}
          <div className="lg:col-span-4 space-y-8">
            {/* Identity Perspective Card */}
            <Card className="border-none shadow-md shadow-slate-200/40 rounded-[32px] bg-white overflow-hidden group">
              <div className="h-24 bg-slate-950 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500 to-transparent" />
              </div>
              <CardContent className="pt-0 flex flex-col items-center text-center relative px-8 pb-8">
                <div className="relative -mt-12 mb-6 group/avatar">
                  <div className="p-1.5 bg-white rounded-full shadow-2xl relative z-10">
                    <Avatar className="h-24 w-24 border-4 border-slate-50">
                      <AvatarImage src={profile?.avatar} className="object-cover" />
                      <AvatarFallback className="bg-amber-100 text-amber-700 font-black text-2xl">
                        {profile?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-1 right-1 p-2 bg-slate-950 text-white rounded-xl shadow-xl cursor-pointer hover:bg-slate-800 transition-all z-20 opacity-0 group-hover/avatar:opacity-100 transform translate-y-2 group-hover/avatar:translate-y-0"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>

                <div className="space-y-1">
                   <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-none">
                    {profile?.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {profile?.role?.replace("_", " ")}
                    </span>
                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                      Constituency Admin
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Badge
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border shadow-xs ${profile?.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}
                  >
                    {profile?.status}
                  </Badge>
                </div>

                <div className="w-full mt-8 space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between group/meta">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Mail className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Registry Email</span>
                    </div>
                    <span className="text-xs font-black text-slate-950 truncate max-w-[150px] group-hover:text-amber-600 transition-colors">
                      {profile?.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between group/meta">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Phone className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Secure Link</span>
                    </div>
                    <span className="text-xs font-black text-slate-950">
                      {profile?.phone || "UNREGISTERED"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between group/meta">
                    <div className="flex items-center gap-2 text-slate-400">
                       <History className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Auth Pulse</span>
                    </div>
                    <span className="text-xs font-black text-slate-950">
                      {profile?.last_login
                        ? new Date(profile.last_login).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})
                        : "Never"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Evolution Registry (Activity) */}
            <Card className="border-none shadow-md shadow-slate-200/40 rounded-[32px] bg-white overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-lg font-black text-slate-950 flex items-center gap-3">
                  <History className="w-5 h-5 text-amber-500" /> Action Genesis
                </CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                   Last 5 cryptographic security events
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-100">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 relative z-10 group"
                      >
                        <div className="w-6 h-6 rounded-lg bg-white border-2 border-slate-100 flex items-center justify-center text-slate-300 mt-0.5 group-hover:border-amber-500 group-hover:text-amber-500 transition-all">
                          <Activity className="h-3 w-3" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-950 text-[11px] uppercase tracking-wider leading-none">
                            {activity.action.replace(/_/g, " ")}
                          </p>
                          <p className="text-[10px] font-medium text-slate-400 mt-1">
                            {new Date(activity.created_at).toLocaleString(undefined, {hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric'})}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-slate-300 gap-2">
                       <Shield className="w-10 h-10 opacity-20" />
                       <p className="text-[10px] font-black uppercase tracking-widest italic">Registry Empty</p>
                    </div>
                  )}
                </div>
                <Button variant="ghost" className="w-full h-11 rounded-2xl bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 group">
                   Audit Full Timeline <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Modification Matrix */}
          <div className="lg:col-span-8 space-y-8">
            {/* Identity Information Matrix */}
            <Card className="border-none shadow-md shadow-slate-200/40 rounded-[32px] bg-white overflow-hidden">
               <div className="h-1.5 bg-amber-500 w-full" />
              <CardHeader className="p-8">
                <div className="flex items-center gap-4 mb-2">
                   <div className="p-2.5 bg-amber-50 rounded-2xl">
                      <Briefcase className="w-5 h-5 text-amber-600" />
                   </div>
                   <div>
                      <CardTitle className="text-2xl font-black text-slate-950 tracking-tight">Modification Matrix</CardTitle>
                      <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Synthesize and update primary administrative identity parameters
                      </CardDescription>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 group">
                    <Label htmlFor="fullName" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Full Signature</Label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                       <Input
                          id="fullName"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className="h-12 pl-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-bold"
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Entry Email (Non-Modifiable)</Label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                       <Input
                         value={profile?.email}
                         disabled
                         className="h-12 pl-12 bg-slate-100 border-none rounded-xl text-slate-400 font-bold cursor-not-allowed"
                       />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Secure Contact</Label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                       <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="h-12 pl-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-bold"
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Functional Tier</Label>
                    <div className="relative">
                       <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                       <Input
                         value={formData.department}
                         disabled
                         className="h-12 pl-12 bg-slate-100 border-none rounded-xl text-slate-400 font-bold cursor-not-allowed"
                       />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2 group">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Strategic Bio / Mandate</label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-bold text-sm resize-none"
                      placeholder="Declare your operational mandate or administrative focus..."
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <Button
                      type="submit"
                      className="h-12 px-8 bg-slate-950 text-white hover:bg-slate-800 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 text-amber-500" />
                      )}
                      Sync Identity Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Security Protocol Calibration (Password) */}
            <Card className="border-none shadow-md shadow-slate-200/40 rounded-[32px] bg-white overflow-hidden">
              <CardHeader className="p-8">
                <div className="flex items-center gap-4 mb-2">
                   <div className="p-2.5 bg-red-50 rounded-2xl">
                      <Lock className="w-5 h-5 text-red-600" />
                   </div>
                   <div>
                      <CardTitle className="text-2xl font-black text-slate-950 tracking-tight">Security Protocol</CardTitle>
                      <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Calibrate cryptographic security parameters and password rotation
                      </CardDescription>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <form onSubmit={handlePasswordChange} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Root Password</Label>
                      <Input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            current_password: e.target.value,
                          })
                        }
                        required={passwordData.new_password.length > 0}
                        className="h-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-950/20 text-slate-900 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">New Hash</Label>
                      <Input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new_password: e.target.value,
                          })
                        }
                        className="h-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Confirm New Hash</Label>
                      <Input
                        type="password"
                        value={passwordData.new_password_confirmation}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new_password_confirmation: e.target.value,
                          })
                        }
                        className="h-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="outline"
                      className="h-11 px-6 rounded-xl border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-[0.15em] hover:bg-slate-50 hover:text-slate-950 transition-all"
                      disabled={submitting || !passwordData.new_password}
                    >
                      Authenticate & Rotate Hash
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
