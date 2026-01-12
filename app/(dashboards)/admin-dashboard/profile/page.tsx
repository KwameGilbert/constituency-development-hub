"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MapPin, Lock, Info, Save, Shield, Loader2, Camera, History } from "lucide-react";
import { profileService, UserProfile, UserActivity } from "@/lib/services/profile-service";
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
        department: "", // Note: API might not support department update directly if it's not in allowedFields in Controller
        bio: ""
    });

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, activityRes] = await Promise.all([
                    profileService.getProfile(),
                    profileService.getActivity(1, 5)
                ]);

                if (profileRes.success) {
                    setProfile(profileRes.data.user);
                    setFormData({
                        name: profileRes.data.user.name,
                        phone: profileRes.data.user.phone || "",
                        department: "Administration", // Placeholder or derived from role
                        bio: profileRes.data.user.bio || ""
                    });
                }
                
                if (activityRes.success) {
                    setActivities(activityRes.data.activities);
                }

            } catch (error) {
                console.error("Failed to load profile", error);
                toast.error("Failed to load profile data");
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
                bio: formData.bio
            });
            
            if (response.success) {
                setProfile(response.data.user);
                toast.success("Profile updated successfully");
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            toast.error("New passwords do not match");
            setSubmitting(false);
            return;
        }

        try {
            const response = await profileService.changePassword(passwordData);
            if (response.success) {
                toast.success("Password changed successfully");
                setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" });
            } else {
                toast.error(response.message || "Failed to change password");
            }
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : "An error occurred";
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
                toast.success("Avatar updated");
            }
        } catch (error) {
             toast.error("Failed to upload avatar");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <AdminHeader 
                title="Profile Settings" 
                description="Manage your account information and preferences"
            />

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Profile Card */}
                        <Card>
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <div className="relative group mb-4">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={profile?.avatar} />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                                            {profile?.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50 border transition-colors opacity-0 group-hover:opacity-100">
                                        <Camera className="w-4 h-4 text-gray-600" />
                                        <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                    </label>
                                </div>
                                
                                <h2 className="text-xl font-bold text-[#1e1b4b]">{profile?.name}</h2>
                                <p className="text-muted-foreground text-sm mb-2 capitalize">{profile?.role?.replace('_', ' ')}</p>
                                <Badge className={`${profile?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} mb-6`}>
                                    {profile?.status}
                                </Badge>

                                <div className="w-full space-y-3 text-sm border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Email:</span>
                                        <span className="font-medium truncate max-w-[150px]" title={profile?.email}>{profile?.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Joined:</span>
                                        <span className="font-medium">{new Date(profile?.created_at || "").toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Login:</span>
                                        <span className="font-medium">{profile?.last_login ? new Date(profile.last_login).toLocaleDateString() : "Never"}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <History className="w-4 h-4" /> Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activities.length > 0 ? activities.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3 text-sm pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="p-1.5 bg-gray-100 rounded text-gray-600 mt-0.5">
                                                <Info className="h-3 w-3" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{activity.action.replace(/_/g, ' ')}</p>
                                                <p className="text-xs text-gray-500">{new Date(activity.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-gray-500 italic text-center py-4">No recent activity</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Update Profile Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Update Profile Information</CardTitle>
                                <CardDescription>Keep your personal details up to date</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-[#1e1b4b] font-semibold">
                                            <User className="h-4 w-4" />
                                            <h3>Personal Information</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName">Full Name</Label>
                                                <Input 
                                                    id="fullName" 
                                                    value={formData.name} 
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input value={profile?.email} disabled className="bg-muted" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input 
                                                    id="phone" 
                                                    value={formData.phone} 
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="department">Department</Label>
                                                <Input value={formData.department} disabled className="bg-muted" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Input 
                                                id="bio" 
                                                value={formData.bio} 
                                                onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" className="bg-[#1e1b4b] hover:bg-[#1e1b4b]/90 gap-2" disabled={submitting}>
                                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                            Update Profile
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Change Password Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>Manage your password and security preferences</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordChange} className="space-y-6">
                                     <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-[#1e1b4b] font-semibold">
                                            <Lock className="h-4 w-4" />
                                            <h3>Change Password</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="currentPassword">Current Password</Label>
                                                <Input 
                                                    id="currentPassword" 
                                                    type="password" 
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                                                    required={passwordData.new_password.length > 0}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">New Password</Label>
                                                <Input 
                                                    id="newPassword" 
                                                    type="password" 
                                                    value={passwordData.new_password}
                                                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                <Input 
                                                    id="confirmPassword" 
                                                    type="password" 
                                                    value={passwordData.new_password_confirmation}
                                                    onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" variant="outline" disabled={submitting || !passwordData.new_password}>
                                            Change Password
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
