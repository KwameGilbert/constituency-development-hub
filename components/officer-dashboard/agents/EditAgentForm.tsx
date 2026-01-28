"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  User,
  MapPin,
  Lock,
  Info,
} from "lucide-react";

export function EditAgentForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium text-[#1e1b4b]">
              Agent Information
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Update agent details and settings
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>Agent ID: 1</p>
            <p>Created: Sep 28, 2025</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#1e1b4b] font-medium pb-2 border-b">
              <User className="h-4 w-4" />
              <h3>Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input id="fullName" defaultValue="Agent.Rock" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input id="email" defaultValue="agent.rock@kofibenteh.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="e.g., +233 20 123 4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g., Community Relations"
                />
              </div>
            </div>
          </div>

          {/* Assignment Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#1e1b4b] font-medium pb-2 border-b">
              <MapPin className="h-4 w-4" />
              <h3>Assignment Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>
                  Main Community <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Main Community" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c1">Community 1</SelectItem>
                    <SelectItem value="c2">Community 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Smaller Community</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Smaller Community" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sc1">Smaller Community 1</SelectItem>
                    <SelectItem value="sc2">Smaller Community 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Suburb</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Suburb" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s1">Suburb 1</SelectItem>
                    <SelectItem value="s2">Suburb 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cottage</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Cottage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ct1">Cottage 1</SelectItem>
                    <SelectItem value="ct2">Cottage 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Account Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#1e1b4b] font-medium pb-2 border-b">
              <Lock className="h-4 w-4" />
              <h3>
                Security Information{" "}
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  (Leave blank to keep current password)
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password (optional)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave blank to keep current password
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information (Read Only) */}
          <div className="bg-slate-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 text-[#1e1b4b] font-medium mb-4">
              <Info className="h-4 w-4" />
              <h3>Account Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">Sep 28, 2025 07:38</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">Nov 30, 2025 22:33</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Login:</span>
                <span className="font-medium">Nov 30, 2025 22:33</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Status:</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800 font-semibold">
              Important Notes
            </AlertTitle>
            <AlertDescription className="text-yellow-700 text-sm mt-2">
              <ul className="list-disc list-inside space-y-1">
                <li>The agent will be notified of any profile changes</li>
                <li>If you change the password, the agent will be informed</li>
                <li>Changing status to inactive will prevent login</li>
                <li>Location changes affect issue assignment</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-[#312e81] hover:bg-[#312e81]/90 gap-2">
              <Save className="h-4 w-4" />
              Update Agent
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
