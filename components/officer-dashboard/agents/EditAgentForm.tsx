"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

import { Checkbox } from "@/components/ui/checkbox";
import {

  Eye,
  EyeOff,
  Save,
  User,
  MapPin,
  Lock,
  Loader2,
  Undo2,
  Shield,
  Info,
} from "lucide-react";
import { agentService, AgentProfile } from "@/lib/services/agent-service";
import { locationsService, Location } from "@/lib/services/locations-service";
import { toast } from "sonner";
import Link from "next/link";

interface EditAgentFormProps {
  agentId: string;
}

export function EditAgentForm({ agentId }: EditAgentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "pending",
    assigned_location: "",
    assigned_communities: "",
    id_type: "",
    id_number: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    can_submit_reports: true,
    can_collect_data: true,
    can_register_residents: false,
    // Password fields are separate as they are optional
    newPassword: "",
    confirmPassword: "",
  });

  const [originalAgent, setOriginalAgent] = useState<AgentProfile | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch locations and agent data in parallel
        const [locResponse, agentResponse] = await Promise.all([
          locationsService.getLocations(),
          agentService.getAgentById(parseInt(agentId)),
        ]);

        if (locResponse.success && locResponse.data.locations) {
          setLocations(locResponse.data.locations);
        }

        if (agentResponse.success && agentResponse.data.agent) {
          const agent = agentResponse.data.agent;
          setOriginalAgent(agent);
          setFormData({
            name: agent.user.name,
            email: agent.user.email,
            phone: agent.user.phone || "",
            status: agent.user.status,
            assigned_location: agent.assigned_location || "",
            assigned_communities: Array.isArray(agent.assigned_communities) 
                ? agent.assigned_communities.join(", ") 
                : (agent.assigned_communities || ""),
            id_type: agent.id_type || "",
            id_number: agent.id_number || "",
            address: agent.address || "",
            emergency_contact_name: agent.emergency_contact_name || "",
            emergency_contact_phone: agent.emergency_contact_phone || "",
            can_submit_reports: agent.can_submit_reports,
            can_collect_data: agent.can_collect_data,
            can_register_residents: agent.can_register_residents,
            newPassword: "",
            confirmPassword: "",
          });
        } else {
            toast.error("Failed to load agent details");
            router.push("/officer-dashboard/agents");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    }

    if (agentId) {
      fetchData();
    }
  }, [agentId, router]);

  function handleChange(field: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
        const updateData: any = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            status: formData.status,
            assigned_location: formData.assigned_location,
            assigned_communities: formData.assigned_communities,
            id_type: formData.id_type,
            id_number: formData.id_number,
            address: formData.address,
            emergency_contact_name: formData.emergency_contact_name,
            emergency_contact_phone: formData.emergency_contact_phone,
            can_submit_reports: formData.can_submit_reports,
            can_collect_data: formData.can_collect_data,
            can_register_residents: formData.can_register_residents,
        };

        if (formData.newPassword) {
            updateData.password = formData.newPassword;
        }

        const response = await agentService.updateAgent(parseInt(agentId), updateData);
        
        if (response.success) {
            toast.success("Agent updated successfully");
            // Optionally redirect or refresh
            router.refresh();
        } else {
            toast.error(response.message || "Failed to update agent");
        }
    } catch (error) {
        console.error("Update failed:", error);
        toast.error("Failed to update agent");
    } finally {
        setSubmitting(false);
    }
  }

  if (loading) {
    return (
        <div className="flex h-60 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading agent details...</span>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium text-[#1e1b4b]">
              Edit Agent: {originalAgent?.agent_code}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Update {formData.name}&apos;s details and permissions
            </p>
          </div>
          <Link href="/officer-dashboard/agents">
            <Button type="button" variant="outline" size="sm">
              <Undo2 className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
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
                <Input 
                    id="fullName" 
                    value={formData.name} 
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input 
                    id="email" 
                    value={formData.email} 
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                    id="phone" 
                    value={formData.phone} 
                    onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Account Status</Label>
                <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
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
                    <Label>Assigned Location</Label>
                    <Select
                        value={formData.assigned_location}
                        onValueChange={(value) => handleChange("assigned_location", value)}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                        {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.name}>
                            {loc.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Assigned Communities</Label>
                    <Input
                        placeholder="e.g., Community A, Community B"
                        value={formData.assigned_communities}
                        onChange={(e) => handleChange("assigned_communities", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Comma separated</p>
                </div>
                <div className="space-y-2">
                    <Label>ID Type</Label>
                    <Select
                        value={formData.id_type}
                        onValueChange={(value) => handleChange("id_type", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select ID Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ghana_card">National ID (Ghana Card)</SelectItem>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="drivers_license">Driver&apos;s License</SelectItem>
                            <SelectItem value="voter_id">Voter ID</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>ID Number</Label>
                    <Input
                        value={formData.id_number}
                        onChange={(e) => handleChange("id_number", e.target.value)}
                    />
                </div>
                <div className="space-y-2 col-span-2">
                    <Label>Address</Label>
                    <Input
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                    />
                </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#1e1b4b] font-medium pb-2 border-b">
              <User className="h-4 w-4" />
              <h3>Emergency Contact</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                        value={formData.emergency_contact_name}
                        onChange={(e) => handleChange("emergency_contact_name", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                        value={formData.emergency_contact_phone}
                        onChange={(e) => handleChange("emergency_contact_phone", e.target.value)}
                    />
                </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#1e1b4b] font-medium pb-2 border-b">
              <Shield className="h-4 w-4" />
              <h3>Permissions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="canSubmitReports"
                        checked={formData.can_submit_reports}
                        onCheckedChange={(checked) => handleChange("can_submit_reports", !!checked)}
                    />
                    <Label htmlFor="canSubmitReports" className="text-sm font-normal">Can Submit Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="canCollectData"
                        checked={formData.can_collect_data}
                        onCheckedChange={(checked) => handleChange("can_collect_data", !!checked)}
                    />
                    <Label htmlFor="canCollectData" className="text-sm font-normal">Can Collect Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="canRegisterResidents"
                        checked={formData.can_register_residents}
                        onCheckedChange={(checked) => handleChange("can_register_residents", !!checked)}
                    />
                    <Label htmlFor="canRegisterResidents" className="text-sm font-normal">Can Register Residents</Label>
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
                    value={formData.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
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
                <span className="font-medium">
                    {originalAgent?.created_at ? new Date(originalAgent.created_at).toLocaleString() : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">
                    {originalAgent?.updated_at ? new Date(originalAgent.updated_at).toLocaleString() : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Link href="/officer-dashboard/agents">
                <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button className="bg-[#312e81] hover:bg-[#312e81]/90 gap-2" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Update Agent
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
