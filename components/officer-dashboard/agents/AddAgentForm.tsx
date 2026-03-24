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
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Generated Password Alert */}
        {generatedPassword && (
          <Alert className="bg-emerald-50 border-emerald-200 shadow-sm border-2 rounded-2xl overflow-hidden animate-in zoom-in duration-300">
            <Shield className="h-5 w-5 text-emerald-600" />
            <div className="ml-2">
              <AlertTitle className="text-emerald-900 font-bold text-lg">
                Field Agent Account Secured
              </AlertTitle>
              <AlertDescription className="text-emerald-700 mt-2">
                <div className="bg-white/50 border border-emerald-100 p-4 rounded-xl mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Generated Access Key</p>
                    <code className="text-xl font-mono font-bold tracking-wider text-emerald-900">
                      {generatedPassword}
                    </code>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 text-emerald-600 hover:bg-emerald-100"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPassword);
                      toast.success("Password copied to clipboard");
                    }}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs mt-4 font-medium leading-relaxed">
                  Important: This password is shown only once. Please securely transmit this to the agent for their first login.
                </p>
                <div className="mt-6 flex justify-end">
                  <Button
                    type="button"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6 shadow-lg shadow-emerald-200 transition-all"
                    onClick={() => router.push("/officer-dashboard/agents")}
                  >
                    Return to Management
                  </Button>
                </div>
              </AlertDescription>
            </div>
          </Alert>
        )}

        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 sm:px-10 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Enrollment Module</span>
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Onboard New Agent
                </CardTitle>
                <p className="text-sm text-slate-500 font-medium">
                  Initialize a new field operative account for the constituency
                </p>
              </div>
              <Link href="/officer-dashboard/agents">
                <Button type="button" variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-4 h-10 gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Cancel Setup
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-6 sm:px-10 py-10 space-y-12">
            {/* Personal Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                   <User className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Personal Credentials</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">
                    Official Full Name
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="e.g. Samuel Kojo Benteh"
                    className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">
                    Work Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="agent.name@domain.com"
                    className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">
                    Contact Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value.replace(/[^0-9+]/g, ''))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">
                    Residential Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="House No, Street, Landmark"
                    className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Assignment Information */}
            <section className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                   <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Territorial Assignment</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">Operations Zone</Label>
                  <Select
                    value={formData.assigned_location}
                    onValueChange={(value) =>
                      handleChange("assigned_location", value)
                    }
                  >
                    <SelectTrigger className="h-12 bg-slate-50/50 border-slate-200 rounded-xl px-4 font-medium">
                      <SelectValue placeholder="Select Zone" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.name} className="focus:bg-indigo-50 font-medium">
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">Target Communities</Label>
                  <Input
                    placeholder="e.g. Blue Lagoon, North Ridge"
                    className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                    value={formData.assigned_communities}
                    onChange={(e) =>
                      handleChange("assigned_communities", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">Recognition ID Type</Label>
                  <Select
                    value={formData.id_type}
                    onValueChange={(value) => handleChange("id_type", value)}
                  >
                    <SelectTrigger className="h-12 bg-slate-50/50 border-slate-200 rounded-xl px-4 font-medium">
                      <SelectValue placeholder="Select ID Specification" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      <SelectItem value="ghana_card" className="font-medium">Ghana Card (NIA)</SelectItem>
                      <SelectItem value="passport" className="font-medium">Passport</SelectItem>
                      <SelectItem value="drivers_license" className="font-medium">Driver&apos;s License</SelectItem>
                      <SelectItem value="voter_id" className="font-medium">Voter ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">Universal ID Number</Label>
                  <Input
                    placeholder="Enter registration number"
                    className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                    value={formData.id_number}
                    onChange={(e) => handleChange("id_number", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Operational Privileges */}
            <section className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                   <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">System Access Levels</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { id: "canSubmitReports", field: "can_submit_reports", label: "Incident Reporting" },
                  { id: "canCollectData", field: "can_collect_data", label: "Field Intelligence" },
                  { id: "canRegisterResidents", field: "can_register_residents", label: "Resident Enrollment" }
                ].map((perm) => (
                  <div key={perm.id} className="relative flex items-center gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-100 transition-all group">
                    <Checkbox
                      id={perm.id}
                      checked={formData[perm.field as keyof FormData] as boolean}
                      onCheckedChange={(checked) =>
                        handleChange(perm.field as keyof FormData, !!checked)
                      }
                      className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    />
                    <Label
                      htmlFor={perm.id}
                      className="text-xs font-bold text-slate-700 cursor-pointer group-hover:text-indigo-600 transition-colors"
                    >
                      {perm.label}
                    </Label>
                  </div>
                ))}
              </div>
            </section>

            {/* Security Protocol */}
            <section className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                   <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Security Credentials</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded ml-auto">Optional</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">Access Password</Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium pl-1">Leave blank to auto-generate a secure key</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">Verify Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Submission Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-slate-100">
               <div className="flex items-center gap-3 text-slate-400">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-[11px] font-medium leading-tight">
                    By onboarding this agent, you grant them access to <br /> field operations in your jurisdiction.
                  </p>
               </div>
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <Link href="/officer-dashboard/agents" className="flex-1 sm:flex-none">
                    <Button type="button" variant="outline" className="w-full h-12 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                       Safe Exit
                    </Button>
                 </Link>
                 <Button
                    type="submit"
                    className="flex-1 sm:flex-none h-12 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all gap-2"
                    disabled={loading}
                 >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Complete Onboarding
                 </Button>
               </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
