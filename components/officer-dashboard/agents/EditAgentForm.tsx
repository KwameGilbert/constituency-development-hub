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
  AlertTriangle,
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
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 sm:px-10 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Profile Configuration</span>
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Edit Agent Profile
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <span>Modifying operative</span>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">{originalAgent?.agent_code}</span>
                </div>
              </div>
              <Link href="/officer-dashboard/agents">
                <Button type="button" variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-4 h-10 gap-2 transition-all">
                  <Undo2 className="h-4 w-4" />
                  Discard Changes
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
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Core Credentials</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">
                    Full Name
                  </Label>
                  <Input 
                    id="fullName" 
                    className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                    value={formData.name} 
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">
                    Official Email
                  </Label>
                  <Input 
                    id="email" 
                    className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium text-slate-500"
                    value={formData.email} 
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">
                    Mobile Number
                  </Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    inputMode="numeric"
                    className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                    value={formData.phone} 
                    onChange={(e) => handleChange("phone", e.target.value.replace(/[^0-9+]/g, ''))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">
                    Account Lifecycle
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger className="h-12 bg-slate-50/50 border-slate-200 rounded-xl px-4 font-medium">
                      <SelectValue placeholder="Select Lifecycle State" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      <SelectItem value="active" className="focus:bg-indigo-50 font-medium">Active - Fully Operational</SelectItem>
                      <SelectItem value="inactive" className="focus:bg-indigo-50 font-medium">Inactive - Temporary Hold</SelectItem>
                      <SelectItem value="suspended" className="focus:bg-indigo-50 font-medium text-rose-600">Suspended - Access Revoked</SelectItem>
                      <SelectItem value="pending" className="focus:bg-indigo-50 font-medium text-amber-600">Pending - Verification Reqd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Assignment Information */}
            <section className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                   <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Geospatial Assignment</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">Operations Zone</Label>
                  <Select
                    value={formData.assigned_location}
                    onValueChange={(value) => handleChange("assigned_location", value)}
                  >
                    <SelectTrigger className="h-12 bg-slate-50/50 border-slate-200 rounded-xl px-4 font-medium">
                      <SelectValue placeholder="Assign operational zone" />
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
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">Territorial Communities</Label>
                  <Input
                    placeholder="e.g. Area A, Sector B"
                    className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                    value={formData.assigned_communities}
                    onChange={(e) => handleChange("assigned_communities", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">Verification ID Type</Label>
                  <Select
                    value={formData.id_type}
                    onValueChange={(value) => handleChange("id_type", value)}
                  >
                    <SelectTrigger className="h-12 bg-slate-50/50 border-slate-200 rounded-xl px-4 font-medium">
                      <SelectValue placeholder="ID Specification" />
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
                    className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                    value={formData.id_number}
                    onChange={(e) => handleChange("id_number", e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">Base Residency</Label>
                  <Input
                    className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Operational Metrics & Info (Read Only) */}
            <section className="p-6 bg-slate-50/50 border border-slate-200 rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white text-slate-600 rounded-lg shadow-sm">
                   <Info className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800 tracking-tight">System Telemetry</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium">Account Activated</span>
                  <span className="font-bold text-slate-900">
                    {originalAgent?.created_at ? new Date(originalAgent.created_at).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium">Latest Sync</span>
                  <span className="font-bold text-slate-900">
                    {originalAgent?.updated_at ? new Date(originalAgent.updated_at).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            </section>

            {/* Application Permissions */}
            <section className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                   <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Operational Privileges</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { id: "canSubmitReports", field: "can_submit_reports", label: "Incident Logging" },
                  { id: "canCollectData", field: "can_collect_data", label: "Intelligence Gathering" },
                  { id: "canRegisterResidents", field: "can_register_residents", label: "Resident Indexing" }
                ].map((perm) => (
                  <div key={perm.id} className="relative flex items-center gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-100 transition-all group">
                    <Checkbox
                      id={perm.id}
                      checked={formData[perm.field as keyof typeof formData] as boolean}
                      onCheckedChange={(checked) => handleChange(perm.field, !!checked)}
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
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Authentication Override</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded ml-auto">Optional</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">New Access Key</Label>
                  <div className="relative group">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 bg-slate-50/50 border-slate-200 focus:ring-indigo-500 rounded-xl px-4 font-medium"
                      value={formData.newPassword}
                      onChange={(e) => handleChange("newPassword", e.target.value)}
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1 font-mono">Verify New Key</Label>
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
                    Review all configuration changes carefully <br /> before applying to the production profile.
                  </p>
               </div>
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <Link href="/officer-dashboard/agents" className="flex-1 sm:flex-none">
                    <Button type="button" variant="outline" className="w-full h-12 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                       Abort Changes
                    </Button>
                 </Link>
                 <Button
                    type="submit"
                    className="flex-1 sm:flex-none h-12 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all gap-2"
                    disabled={submitting}
                 >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Commit Profile Updates
                 </Button>
               </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
