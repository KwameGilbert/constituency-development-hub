"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  UserPlus,
  User,
  MapPin,
  Lock,
  Info,
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
} from "lucide-react";
import Link from "next/link";

export default function AddUserPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Add New User"
        description="Create a new system user account"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
          {
            label: "Profile Settings",
            href: "/admin-dashboard/profile",
            icon: UserCircle,
          },
          {
            label: "Audit Logs",
            href: "/admin-dashboard/audit",
            icon: ShieldAlert,
          },
          {
            label: "System Settings",
            href: "/admin-dashboard/system-settings",
            icon: Settings2,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-600 focus:text-red-600 focus:bg-red-50",
          },
        ]}
        actionButtons={[
          {
            label: "Back to Users",
            href: "/admin-dashboard/users",
            icon: ArrowLeft,
            className:
              "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm",
          },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Card className="border-t-4 border-t-red-900">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">
                User Information
              </CardTitle>
              <CardDescription>
                Fill in the details to create a new user account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold border-b border-gray-100 pb-2">
                  <User className="w-4 h-4" />
                  <h3>Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="fullName" placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">
                      Phone Number
                    </Label>
                    <Input id="phone" placeholder="e.g. +233 20 123 4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-gray-700">
                      Department
                    </Label>
                    <Input
                      id="department"
                      placeholder="e.g. Community Relations"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-700">
                      User Role <span className="text-red-500">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp">Member of Parliament</SelectItem>
                        <SelectItem value="mce">
                          Municipal Chief Executive
                        </SelectItem>
                        <SelectItem value="officer">Officer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700">
                      Account Status
                    </Label>
                    <Select defaultValue="active">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location Assignment */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold border-b border-gray-100 pb-2">
                  <MapPin className="w-4 h-4" />
                  <h3>Location Assignment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mainCommunity" className="text-gray-700">
                      Main Community
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Main Community" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comm1">Community 1</SelectItem>
                        <SelectItem value="comm2">Community 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smallerCommunity" className="text-gray-700">
                      Smaller Community
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Smaller Community" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small1">Smaller Comm 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suburb" className="text-gray-700">
                      Suburb
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Suburb" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sub1">Suburb 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cottage" className="text-gray-700">
                      Cottage
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Cottage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cot1">Cottage 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Security Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold border-b border-gray-100 pb-2">
                  <Lock className="w-4 h-4" />
                  <h3>Security Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password (min. 8 characters)"
                    />
                    <p className="text-[10px] text-gray-400">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>

              {/* Info Alert */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-blue-900">
                    Important Information
                  </h4>
                  <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                    <li>The user will receive login credentials via email</li>
                    <li>They can change their password after first login</li>
                    <li>Make sure the role assignment is correct</li>
                    <li>You can modify these details later if needed</li>
                  </ul>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                <Button
                  variant="outline"
                  asChild
                  className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                >
                  <Link href="/admin-dashboard/users">Cancel</Link>
                </Button>
                <Button className="bg-indigo-900 hover:bg-indigo-800 text-white gap-2">
                  <UserPlus className="w-4 h-4" />
                  Create User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
