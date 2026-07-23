"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Mail,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Shield,
  Key,
  Lock,
  BadgeCheck,
  Save,
  Clock,
  Calendar,
  FileText,
  Bell,
  ShieldAlert,
  Check,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { agentService, AgentProfile } from "@/lib/services/agent-service";

export function AgentSettings() {
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification toggles
  const [notifIssueUpdates, setNotifIssueUpdates] = useState(true);
  const [notifTaskReminders, setNotifTaskReminders] = useState(true);
  const [notifSystemAlerts, setNotifSystemAlerts] = useState(true);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await agentService.getProfile();

        if (response.success && response.data?.agent) {
          const agent = response.data.agent;
          setProfile(agent);
          setName(agent.user.name || "");
          setEmail(agent.user.email || "");
          setPhone(agent.user.phone || "");
          setAddress(agent.address || "");
        } else {
          setError(response.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await agentService.updateProfile({
        name,
        email,
        phone,
        address,
      });

      if (response.success) {
        toast.success("Profile updated successfully");
        if (response.data?.agent) {
          setProfile(response.data.agent);
        }
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await agentService.changePassword(
        currentPassword,
        newPassword
      );

      if (response.success) {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("profile_image", file);

      const response = await agentService.uploadProfileImage(formData);

      if (response.success) {
        toast.success("Profile image updated");
        if (response.data?.agent) {
          setProfile(response.data.agent);
        }
      } else {
        toast.error(response.message || "Failed to upload image");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "AG";
    const initials = nameStr
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return initials.slice(0, 2) || "AG";
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto rounded-2xl border border-red-200 bg-red-50/50 p-6 text-red-700 flex items-center gap-4 shadow-sm">
        <div className="rounded-full bg-red-100 p-2 text-red-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900">Error loading profile</h3>
          <p className="text-sm text-red-700 mt-0.5">{error}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="border-red-200 text-red-700 hover:bg-red-100"
        >
          Retry
        </Button>
      </div>
    );
  }

  const isPasswordLengthValid = newPassword.length >= 8;
  const isPasswordMatchValid =
    newPassword.length > 0 && newPassword === confirmPassword;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Profile Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your personal information, security, and account preferences
        </p>
      </div>

      {/* Hero Profile Banner Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {/* Top Decorative Banner */}
        <div className="h-24 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        {/* Profile Content Area */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12">
            {/* Avatar Container */}
            <div className="relative group shrink-0">
              <Avatar className="h-24 w-24 rounded-2xl ring-4 ring-white shadow-md bg-slate-100 border border-slate-200">
                <AvatarImage
                  src={profile?.profile_image || "/placeholder-user.jpg"}
                  alt={profile?.user.name || "Agent"}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-semibold bg-slate-100 text-slate-700">
                  {profile ? getInitials(profile.user.name) : "AG"}
                </AvatarFallback>
              </Avatar>

              {/* Upload Button */}
              <button
                type="button"
                className="absolute bottom-0 right-0 p-2 rounded-xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 hover:scale-105 transition-all duration-200 disabled:opacity-50"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                title="Change Profile Picture"
              >
                {uploadingImage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {/* Profile Information */}
            <div className="space-y-1 sm:mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {profile?.user.name || "Field Agent"}
                </h2>
                <Badge
                  variant="secondary"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    profile?.user.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      profile?.user.status === "active"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-slate-400"
                    }`}
                  />
                  {profile?.user.status === "active"
                    ? "Active"
                    : profile?.user.status || "Inactive"}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-slate-400" />
                  Field Agent
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                  {profile?.agent_code || "AGT-0005"}
                </span>
                {profile?.user.email && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {profile.user.email}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto">
            <div className="flex-1 md:flex-initial rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2 text-center md:text-right">
              <p className="text-xs text-slate-400 font-medium">Reports Submitted</p>
              <p className="text-base font-bold text-slate-900">
                {profile?.reports_submitted || 0}
              </p>
            </div>
            <div className="flex-1 md:flex-initial rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2 text-center md:text-right">
              <p className="text-xs text-slate-400 font-medium">Last Active</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                {profile?.last_active_at
                  ? new Date(profile.last_active_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  : "Today"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Area */}
      <Tabs defaultValue="profile" className="w-full space-y-6">
        {/* Tabs Bar */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-1.5 shadow-xs">
          <TabsList className="bg-transparent p-0 h-auto gap-1 w-full flex overflow-x-auto no-scrollbar">
            <TabsTrigger
              value="profile"
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xs hover:text-slate-900"
            >
              <User className="h-4 w-4" />
              <span>Profile Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xs hover:text-slate-900"
            >
              <Lock className="h-4 w-4" />
              <span>Change Password</span>
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xs hover:text-slate-900"
            >
              <Bell className="h-4 w-4" />
              <span>Account & Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Profile Information */}
        <TabsContent value="profile" className="space-y-6 focus-visible:outline-none">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500" />
                Personal Details
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your contact details and basic information
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="pl-9 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="pl-9 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/[^0-9+]/g, ""))
                    }
                    placeholder="e.g., +233 20 123 4567"
                    className="pl-9 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your residential address"
                    className="pl-9 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-slate-500" />
                System Identifiers
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Assigned system attributes and credentials (read-only)
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Role */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Role
                    </label>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                      Read-only
                    </span>
                  </div>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      defaultValue="Field Agent"
                      readOnly
                      className="pl-9 bg-slate-100/70 border-slate-200 text-slate-600 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Agent Code */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Agent Code
                    </label>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                      Read-only
                    </span>
                  </div>
                  <div className="relative">
                    <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      defaultValue={profile?.agent_code || "AGT-0005"}
                      readOnly
                      className="pl-9 bg-slate-100/70 border-slate-200 text-slate-600 font-mono font-medium cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2 rounded-xl shadow-xs transition-all flex items-center gap-2"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Password */}
        <TabsContent value="password" className="space-y-6 focus-visible:outline-none">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Key className="h-4 w-4 text-slate-500" />
                Change Password
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure your account stays secure by using a strong password
              </p>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pl-9 pr-10 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-slate-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pl-9 pr-10 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-slate-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pl-9 pr-10 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-slate-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Validation Checklist */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs">
              <p className="font-semibold text-slate-700 mb-1">
                Password Requirements:
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                    isPasswordLengthValid
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isPasswordLengthValid ? <Check className="h-3 w-3" /> : "•"}
                </span>
                <span
                  className={
                    isPasswordLengthValid
                      ? "text-emerald-700 font-medium"
                      : "text-slate-500"
                  }
                >
                  Minimum 8 characters long
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                    isPasswordMatchValid
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isPasswordMatchValid ? <Check className="h-3 w-3" /> : "•"}
                </span>
                <span
                  className={
                    isPasswordMatchValid
                      ? "text-emerald-700 font-medium"
                      : "text-slate-500"
                  }
                >
                  Passwords match
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2 rounded-xl shadow-xs transition-all flex items-center gap-2"
                onClick={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Update Password</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Account & Settings */}
        <TabsContent value="account" className="space-y-6 focus-visible:outline-none">
          {/* Activity Overview */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                Account Activity & Stats
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of your field operation activity record
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Last Active</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {profile?.last_active_at
                    ? new Date(profile.last_active_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Active Now"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Account Created</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })
                    : "N/A"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>Total Submissions</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {profile?.reports_submitted || 0} Reports
                </p>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-500" />
                Notification Preferences
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose what notifications and alerts you receive
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-900">
                    Issue Status Updates
                  </p>
                  <p className="text-xs text-slate-500">
                    Get notified when status changes on your submitted issues
                  </p>
                </div>
                <Switch
                  checked={notifIssueUpdates}
                  onCheckedChange={setNotifIssueUpdates}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-900">
                    Task Reminders
                  </p>
                  <p className="text-xs text-slate-500">
                    Receive periodic reminders for pending field tasks
                  </p>
                </div>
                <Switch
                  checked={notifTaskReminders}
                  onCheckedChange={setNotifTaskReminders}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-900">
                    System Announcements
                  </p>
                  <p className="text-xs text-slate-500">
                    Important operational notifications and platform updates
                  </p>
                </div>
                <Switch
                  checked={notifSystemAlerts}
                  onCheckedChange={setNotifSystemAlerts}
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-red-900 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                  Deactivate Account
                </h3>
                <p className="text-xs text-red-700/80 max-w-xl">
                  Temporarily disable your agent account. Once deactivated, you
                  will need to contact your supervisor to reactivate access.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800 bg-white shadow-xs font-medium text-xs rounded-xl"
                onClick={() =>
                  toast.error("Contact your supervisor to deactivate account")
                }
              >
                Deactivate Account
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
