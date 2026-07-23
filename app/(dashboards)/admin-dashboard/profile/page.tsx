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
  Lock,
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
        toast.success("Profile updated successfully");
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
      toast.error("Protocol Error: Passwords do not match");
      setSubmitting(false);
      return;
    }

    try {
      const response = await profileService.changePassword(passwordData);
      if (response.success) {
        toast.success("Password changed successfully");
        setPasswordData({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        toast.error(response.message || "Failed to update password");
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
        toast.success("Avatar updated successfully");
      }
    } catch (error) {
      toast.error("Avatar upload failed");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50/50 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <span className="text-sm font-medium text-slate-500">
          Loading profile...
        </span>
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

      <div className="flex-1 p-6 sm:p-8 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
          {/* Left Column: Visual Signature & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-slate-200/80 shadow-xs rounded-2xl bg-white overflow-hidden group">
              <div className="h-20 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500 to-transparent" />
              </div>
              <CardContent className="pt-0 flex flex-col items-center text-center relative px-6 pb-6">
                <div className="relative -mt-10 mb-4 group/avatar">
                  <div className="p-1 bg-white rounded-full shadow-md relative z-10">
                    <Avatar className="h-20 w-20 border-2 border-slate-100">
                      <AvatarImage
                        src={profile?.avatar}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-amber-100 text-amber-700 font-bold text-xl">
                        {profile?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-1.5 bg-slate-900 text-white rounded-lg shadow-md cursor-pointer hover:bg-slate-800 transition-all z-20 opacity-0 group-hover/avatar:opacity-100"
                  >
                    <Camera className="w-3.5 h-3.5" />
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
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {profile?.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-medium text-slate-500 capitalize">
                      {profile?.role?.replace("_", " ")}
                    </span>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-xs font-semibold text-amber-600">
                      Constituency Admin
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <Badge
                    className={`text-xs font-medium px-2.5 py-0.5 border shadow-xs ${profile?.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}
                  >
                    {profile?.status}
                  </Badge>
                </div>

                <div className="w-full mt-6 space-y-3 pt-5 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </div>
                    <span className="font-semibold text-slate-900 truncate max-w-[160px]">
                      {profile?.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Phone</span>
                    </div>
                    <span className="font-semibold text-slate-900">
                      {profile?.phone || "Unregistered"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <History className="w-3.5 h-3.5" />
                      <span>Last Login</span>
                    </div>
                    <span className="font-semibold text-slate-900">
                      {profile?.last_login
                        ? new Date(profile.last_login).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" },
                          )
                        : "Never"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Evolution Registry (Activity) */}
            <Card className="border border-slate-200/80 shadow-xs rounded-2xl bg-white">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-500" /> Recent Activity
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Last 5 security and administrative events
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-3 space-y-4">
                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 relative z-10 group"
                      >
                        <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400 mt-0.5 group-hover:border-amber-500 group-hover:text-amber-600 transition-colors">
                          <Activity className="h-3 w-3" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 text-xs capitalize">
                            {activity.action.replace(/_/g, " ")}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(activity.created_at).toLocaleString(
                              undefined,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-slate-400 gap-1.5">
                      <Shield className="w-8 h-8 opacity-30" />
                      <p className="text-xs font-medium">No activity recorded</p>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full h-9 rounded-xl border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 group mt-2"
                >
                  Audit Full Timeline{" "}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Modification Matrix */}
          <div className="lg:col-span-8 space-y-6">
            {/* Identity Information Matrix */}
            <Card className="border border-slate-200/80 shadow-xs rounded-2xl bg-white overflow-hidden">
              <div className="h-1 bg-amber-500 w-full" />
              <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Update your primary administrative profile details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form
                  onSubmit={handleProfileUpdate}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-medium text-slate-700"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="fullName"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="h-11 pl-10 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        value={profile?.email}
                        disabled
                        className="h-11 pl-10 bg-slate-100/70 border border-slate-200 rounded-lg text-slate-500 text-sm font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-slate-700"
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="h-11 pl-10 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700">
                      Department
                    </Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        value={formData.department}
                        disabled
                        className="h-11 pl-10 bg-slate-100/70 border border-slate-200 rounded-lg text-slate-500 text-sm font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <Label
                      htmlFor="bio"
                      className="text-sm font-medium text-slate-700"
                    >
                      Bio / Operational Mandate
                    </Label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={3}
                      className="w-full p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:border-amber-500 focus:ring-amber-500 resize-none"
                      placeholder="Declare your operational mandate or administrative focus..."
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <Button
                      type="submit"
                      className="h-11 px-6 bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-xs font-semibold text-sm flex items-center gap-2 transition-all"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 text-amber-400" />
                      )}
                      Save Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Security Protocol Calibration (Password) */}
            <Card className="border border-slate-200/80 shadow-xs rounded-2xl bg-white overflow-hidden">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                      Security & Password
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Update your account security parameters and password
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">
                        Current Password
                      </Label>
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
                        className="h-11 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 font-medium text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">
                        New Password
                      </Label>
                      <Input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new_password: e.target.value,
                          })
                        }
                        className="h-11 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 font-medium text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">
                        Confirm New Password
                      </Label>
                      <Input
                        type="password"
                        value={passwordData.new_password_confirmation}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new_password_confirmation: e.target.value,
                          })
                        }
                        className="h-11 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 font-medium text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="outline"
                      className="h-10 px-5 rounded-xl border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all"
                      disabled={submitting || !passwordData.new_password}
                    >
                      Update Password
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
