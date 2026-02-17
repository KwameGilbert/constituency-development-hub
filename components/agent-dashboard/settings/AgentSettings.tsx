"use client";

import React, { useState, useEffect } from "react";
import { Camera, Mail, CheckCircle2, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { agentService, AgentProfile } from "@/lib/services/agent-service";

export function AgentSettings() {
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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
        newPassword,
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-red-50 p-6 text-red-600 flex items-center gap-3">
        <AlertCircle className="h-5 w-5" />
        <div>
          <p className="font-medium">Error loading profile</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-500">
          Manage your account details and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="flex items-center gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={profile?.profile_image || "/placeholder-user.jpg"}
            />
            <AvatarFallback className="text-2xl bg-slate-100 text-slate-500">
              {profile ? getInitials(profile.user.name) : "AG"}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 rounded-full bg-slate-900 p-2 text-white hover:bg-slate-800">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">
            {profile?.user.name}
          </h2>
          <p className="text-slate-500">Field Agent • {profile?.agent_code}</p>
          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Mail className="h-3.5 w-3.5" />
              {profile?.user.email}
            </div>
            <Badge
              variant="secondary"
              className={`gap-1 ${
                profile?.user.status === "active"
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              {profile?.user.status === "active"
                ? "Active"
                : profile?.user.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <Tabs defaultValue="profile" className="w-full">
          <div className="border-b border-slate-200 px-6 pt-2">
            <TabsList className="bg-transparent p-0 h-auto gap-6">
              <TabsTrigger
                value="profile"
                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
              >
                Profile Information
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
              >
                Change Password
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
              >
                Account Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="p-6 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                  placeholder="e.g., +233 20 123 4567"
                  className="border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Address
                </label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your address"
                  className="border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Role
                </label>
                <Input
                  defaultValue="Field Agent"
                  readOnly
                  className="bg-slate-50 border-slate-200 text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Agent Code
                </label>
                <Input
                  defaultValue={profile?.agent_code || ""}
                  readOnly
                  className="bg-slate-50 border-slate-200 text-slate-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="password" className="p-6 space-y-8">
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border-slate-200 focus:border-slate-900 focus:ring-slate-900 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-slate-200 focus:border-slate-900 focus:ring-slate-900 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500">Minimum 8 characters</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-slate-200 focus:border-slate-900 focus:ring-slate-900 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
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

            <div className="flex justify-end pt-4">
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white"
                onClick={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="account" className="p-6 space-y-8">
            {/* Account Activity */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900">
                Account Activity
              </h3>
              <div className="rounded-lg bg-slate-50 p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Last Active</span>
                  <span className="font-medium text-slate-900">
                    {profile?.last_active_at
                      ? new Date(profile.last_active_at).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Account Created</span>
                  <span className="font-medium text-slate-900">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Reports Submitted</span>
                  <span className="font-medium text-slate-900">
                    {profile?.reports_submitted || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900">
                Notification Preferences
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="issue-updates"
                    defaultChecked
                    className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                  />
                  <label
                    htmlFor="issue-updates"
                    className="text-sm text-slate-600 cursor-pointer"
                  >
                    Issue status updates
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="task-reminders"
                    defaultChecked
                    className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                  />
                  <label
                    htmlFor="task-reminders"
                    className="text-sm text-slate-600 cursor-pointer"
                  >
                    Task reminders
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="system-notifs"
                    defaultChecked
                    className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                  />
                  <label
                    htmlFor="system-notifs"
                    className="text-sm text-slate-600 cursor-pointer"
                  >
                    System notifications
                  </label>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900">
                Danger Zone
              </h3>
              <div className="rounded-lg border border-red-100 bg-red-50 p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-red-900">
                    Deactivate Account
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    Temporarily disable your account. You would have to contact
                    your supervisor to reactivate your account.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 bg-white"
                >
                  Deactivate
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
