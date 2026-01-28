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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  User,
  MapPin,
  Lock,
  Shield,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { agentService } from "@/lib/services/agent-service";
import { locationsService, Location } from "@/lib/services/locations-service";
import { toast } from "sonner";
import Link from "next/link";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  assigned_location: string;
  assigned_communities: string;
  id_type: string;
  id_number: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  can_submit_reports: boolean;
  can_collect_data: boolean;
  can_register_residents: boolean;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
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
};

export function AddAgentForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [locations, setLocations] = useState<Location[]>([]);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await locationsService.getLocations();
        if (response.success && response.data.locations) {
          setLocations(response.data.locations);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    }
    fetchLocations();
  }, []);

  function handleChange(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Build FormData for API
      const apiFormData = new FormData();
      apiFormData.append("name", formData.name);
      apiFormData.append("email", formData.email);
      if (formData.phone) apiFormData.append("phone", formData.phone);
      if (formData.password) apiFormData.append("password", formData.password);
      if (formData.assigned_location)
        apiFormData.append("assigned_location", formData.assigned_location);
      if (formData.assigned_communities)
        apiFormData.append(
          "assigned_communities",
          formData.assigned_communities,
        );
      if (formData.id_type) apiFormData.append("id_type", formData.id_type);
      if (formData.id_number)
        apiFormData.append("id_number", formData.id_number);
      if (formData.address) apiFormData.append("address", formData.address);
      if (formData.emergency_contact_name)
        apiFormData.append(
          "emergency_contact_name",
          formData.emergency_contact_name,
        );
      if (formData.emergency_contact_phone)
        apiFormData.append(
          "emergency_contact_phone",
          formData.emergency_contact_phone,
        );
      apiFormData.append(
        "can_submit_reports",
        formData.can_submit_reports ? "1" : "0",
      );
      apiFormData.append(
        "can_collect_data",
        formData.can_collect_data ? "1" : "0",
      );
      apiFormData.append(
        "can_register_residents",
        formData.can_register_residents ? "1" : "0",
      );

      const response = await agentService.createAgent(apiFormData);

      if (response.success) {
        if (response.data.generated_password) {
          setGeneratedPassword(response.data.generated_password);
          toast.success(
            `Agent created! Generated password: ${response.data.generated_password}`,
            { duration: 10000 },
          );
        } else {
          toast.success("Agent created successfully");
          router.push("/officer-dashboard/agents");
        }
      } else {
        toast.error(response.message || "Failed to create agent");
      }
    } catch (error) {
      console.error("Failed to create agent:", error);
      toast.error("Failed to create agent. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Generated Password Alert */}
      {generatedPassword && (
        <Alert className="bg-green-50 border-green-200">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 font-semibold">
            Agent Created Successfully!
          </AlertTitle>
          <AlertDescription className="text-green-700">
            <p className="mt-2">
              <strong>Generated Password:</strong>{" "}
              <code className="bg-green-100 px-2 py-1 rounded">
                {generatedPassword}
              </code>
            </p>
            <p className="text-sm mt-2">
              Please save this password and share it securely with the agent.
            </p>
            <Button
              type="button"
              className="mt-3 bg-green-600 hover:bg-green-700"
              onClick={() => router.push("/officer-dashboard/agents")}
            >
              Go to Agents List
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium text-[#1e1b4b]">
              Create New Agent
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Fill in the details to create a new field agent account
            </p>
          </div>
          <Link href="/officer-dashboard/agents">
            <Button type="button" variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
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
                  placeholder="Enter agent's full name"
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
                  type="email"
                  placeholder="agent@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+233 20 123 4567"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter home address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
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
                <Label>Assigned Location</Label>
                <Select
                  value={formData.assigned_location}
                  onValueChange={(value) =>
                    handleChange("assigned_location", value)
                  }
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
                  onChange={(e) =>
                    handleChange("assigned_communities", e.target.value)
                  }
                />
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
                    <SelectItem value="national_id">
                      National ID (Ghana Card)
                    </SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers_license">
                      Driver&apos;s License
                    </SelectItem>
                    <SelectItem value="voter_id">Voter ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ID Number</Label>
                <Input
                  placeholder="Enter ID number"
                  value={formData.id_number}
                  onChange={(e) => handleChange("id_number", e.target.value)}
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
                <Label>Emergency Contact Name</Label>
                <Input
                  placeholder="Contact person name"
                  value={formData.emergency_contact_name}
                  onChange={(e) =>
                    handleChange("emergency_contact_name", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Emergency Contact Phone</Label>
                <Input
                  placeholder="+233 20 123 4567"
                  value={formData.emergency_contact_phone}
                  onChange={(e) =>
                    handleChange("emergency_contact_phone", e.target.value)
                  }
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
                  onCheckedChange={(checked) =>
                    handleChange("can_submit_reports", !!checked)
                  }
                />
                <Label
                  htmlFor="canSubmitReports"
                  className="text-sm font-normal"
                >
                  Can Submit Reports
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canCollectData"
                  checked={formData.can_collect_data}
                  onCheckedChange={(checked) =>
                    handleChange("can_collect_data", !!checked)
                  }
                />
                <Label htmlFor="canCollectData" className="text-sm font-normal">
                  Can Collect Data
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canRegisterResidents"
                  checked={formData.can_register_residents}
                  onCheckedChange={(checked) =>
                    handleChange("can_register_residents", !!checked)
                  }
                />
                <Label
                  htmlFor="canRegisterResidents"
                  className="text-sm font-normal"
                >
                  Can Register Residents
                </Label>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#1e1b4b] font-medium pb-2 border-b">
              <Lock className="h-4 w-4" />
              <h3>
                Password{" "}
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  (Leave blank to auto-generate)
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password or leave blank"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
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
                  Leave blank to auto-generate a secure password
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
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

          {/* Important Notes */}
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800 font-semibold">
              Important Notes
            </AlertTitle>
            <AlertDescription className="text-blue-700 text-sm mt-2">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  The agent will receive login credentials via email (if
                  configured)
                </li>
                <li>
                  If password is left blank, a secure password will be generated
                </li>
                <li>Agent account will be pending until verified</li>
                <li>
                  Ensure correct location assignment for proper issue routing
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Link href="/officer-dashboard/agents">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-[#312e81] hover:bg-[#312e81]/90 gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Create Agent
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
