"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MapPin, Lock, Info, Save, Loader2 } from "lucide-react";
import { profileService, UserProfile } from "@/lib/services/profile-service";
import {
  officerReportsService,
  ActivityStats,
  OfficerData,
} from "@/lib/services/officer-reports-service";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfileDetails() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activity, setActivity] = useState<ActivityStats | null>(null);
  const [officerData, setOfficerData] = useState<OfficerData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    department: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function fetchData() {
      // Check if user is authenticated
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      const envToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
      const hasToken =
        token || (envToken && envToken !== "YOUR_JWT_TOKEN_HERE");

      if (!hasToken) {
        toast.error("Please log in to access your profile.");
        setLoading(false);
        return;
      }

      try {
        const [profileRes, statsRes] = await Promise.all([
          profileService.getProfile(),
          officerReportsService.getProfileStats(),
        ]);

        if (profileRes.success && profileRes.data.user) {
          setProfile(profileRes.data.user);
          setFormData((prev) => ({
            ...prev,
            name: profileRes.data.user.name || "",
            email: profileRes.data.user.email || "",
            phone: profileRes.data.user.phone || "",
          }));
        }

        if (statsRes.success) {
          setActivity(statsRes.data.activity);
          setOfficerData(statsRes.data.officer);
          if (statsRes.data.officer?.department) {
            setFormData((prev) => ({
              ...prev,
              department: statsRes.data.officer?.department || "",
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";

        // Check for specific error types
        if (errorMessage.includes("User not found")) {
          toast.error(
            "Profile not found. Please contact support if this persists.",
          );
          setError(
            "Your profile could not be found. Please contact support or try logging in again.",
          );
        } else if (
          errorMessage.includes("401") ||
          errorMessage.includes("403")
        ) {
          toast.error("Session expired. Please log in again.");
          setError("Authentication required. Please log in again.");
          // Optionally redirect to login
          // window.location.href = "/login";
        } else if (errorMessage.includes("404")) {
          toast.error("Profile endpoint not found. Please contact support.");
          setError("Service temporarily unavailable. Please try again later.");
        } else if (
          errorMessage.includes("500") ||
          errorMessage.includes("502") ||
          errorMessage.includes("503")
        ) {
          toast.error("Server error. Please try again later.");
          setError("Service temporarily unavailable. Please try again later.");
        } else {
          toast.error("Failed to load profile data. Please try again.");
          setError("Unable to load profile data. Please refresh the page.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate password change if any password field is filled
    if (
      formData.newPassword ||
      formData.confirmPassword ||
      formData.currentPassword
    ) {
      if (!formData.currentPassword) {
        toast.error("Current password is required to change password");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      if (formData.newPassword.length < 8) {
        toast.error("New password must be at least 8 characters");
        return;
      }
    }

    setSaving(true);
    try {
      // Update profile
      const updateRes = await profileService.updateProfile({
        name: formData.name,
        phone: formData.phone,
      });

      if (!updateRes.success) {
        const errorMessage = updateRes.message || "Failed to update profile";
        if (
          errorMessage.includes("User not found") ||
          errorMessage.includes("401") ||
          errorMessage.includes("403")
        ) {
          toast.error("Session expired. Please log in again.");
          return;
        }
        toast.error(errorMessage);
        return;
      }

      // Change password if provided
      if (formData.currentPassword && formData.newPassword) {
        const passwordRes = await profileService.changePassword({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
          new_password_confirmation: formData.confirmPassword,
        });

        if (!passwordRes.success) {
          const errorMessage =
            passwordRes.message || "Failed to change password";
          if (
            errorMessage.includes("User not found") ||
            errorMessage.includes("401") ||
            errorMessage.includes("403")
          ) {
            toast.error("Session expired. Please log in again.");
            return;
          }
          toast.error(errorMessage);
          return;
        }

        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }

      toast.success("Profile updated successfully");

      // Refresh profile data
      const refreshRes = await profileService.getProfile();
      if (refreshRes.success) {
        setProfile(refreshRes.data.user);
      } else {
        const errorMessage =
          refreshRes.message || "Failed to refresh profile data";
        if (
          errorMessage.includes("User not found") ||
          errorMessage.includes("401") ||
          errorMessage.includes("403")
        ) {
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error("Profile updated but failed to refresh data.");
        }
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      if (
        errorMessage.includes("User not found") ||
        errorMessage.includes("401") ||
        errorMessage.includes("403")
      ) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  function formatDate(dateString?: string): string {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatMonthYear(dateString?: string): string {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <Info className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Unable to Load Profile
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#1e1b4b] hover:bg-[#1e1b4b]/90"
            >
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-[#1e1b4b]">
                {profile?.name || "Officer"}
              </h2>
              <p className="text-muted-foreground text-sm mb-2 capitalize">
                {profile?.role || "Officer"}
              </p>
              <Badge
                className={`mb-6 ${
                  profile?.status === "active"
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                }`}
              >
                {profile?.status
                  ? profile.status.charAt(0).toUpperCase() +
                    profile.status.slice(1)
                  : "Active"}
              </Badge>

              <div className="w-full space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{profile?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since:</span>
                  <span className="font-medium">
                    {formatMonthYear(profile?.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login:</span>
                  <span className="font-medium">
                    {formatDate(profile?.last_login)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded text-blue-600">
                    <Info className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Total Issues</span>
                </div>
                <span className="font-bold">{activity?.total_issues ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-yellow-100 rounded text-yellow-600">
                    <Info className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Pending Review</span>
                </div>
                <span className="font-bold">
                  {activity?.pending_review ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded text-green-600">
                    <Info className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Resolved</span>
                </div>
                <span className="font-bold">{activity?.resolved ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded text-purple-600">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Active Agents</span>
                </div>
                <span className="font-bold">
                  {activity?.active_agents ?? 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Update Profile Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Keep your profile information up to date
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1e1b4b] font-semibold">
                  <User className="h-4 w-4" />
                  <h3>Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="e.g., +233 20 123 4567"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={officerData?.department || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1e1b4b] font-semibold">
                  <MapPin className="h-4 w-4" />
                  <h3>Location Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assigned Locations</Label>
                    <Input
                      value={
                        officerData?.assigned_locations?.join(", ") ||
                        "Not Assigned"
                      }
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      value={officerData?.position || "Not Assigned"}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" /> Location information can only be
                  updated by an administrator.
                </p>
              </div>

              {/* Change Password */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1e1b4b] font-semibold">
                  <Lock className="h-4 w-4" />
                  <h3>
                    Change Password{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      (Leave blank to keep current password)
                    </span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        handleChange("currentPassword", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        handleChange("newPassword", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                <h3 className="font-semibold text-sm text-[#1e1b4b]">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">
                      Account Created:
                    </span>
                    <span>{formatDate(profile?.created_at)}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{formatDate(profile?.updated_at)}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-muted-foreground">
                      Account Status:
                    </span>
                    <Badge
                      className={`h-5 px-1.5 text-[10px] ${
                        profile?.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                      }`}
                    >
                      {profile?.status
                        ? profile.status.charAt(0).toUpperCase() +
                          profile.status.slice(1)
                        : "Active"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">User Role:</span>
                    <span className="capitalize">
                      {profile?.role || "Officer"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#1e1b4b] hover:bg-[#1e1b4b]/90 gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
