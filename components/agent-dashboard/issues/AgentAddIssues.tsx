"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { agentService, IssueSubmission } from "@/lib/services/agent-service";
import { locationsService } from "@/lib/services/locations-service";
import { sectorsService } from "@/lib/services/sectors-service";

interface Location {
  id: number;
  name: string;
}

interface Sector {
  id: number;
  name: string;
  subsectors?: { id: number; name: string }[];
}

const CATEGORIES = [
  "Infrastructure",
  "Health",
  "Education",
  "Economic Empowerment",
  "Water & Sanitation",
  "Security",
  "Environment",
  "Social Services",
  "Other",
];

export function AgentAddIssues() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("issue-details");
  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [smallerCommunities, setSmallerCommunities] = useState<Location[]>([]);
  const [suburbs, setSuburbs] = useState<Location[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubLocations, setLoadingSubLocations] = useState(false);

  // Form state
  const [formData, setFormData] = useState<IssueSubmission>({
    title: "",
    description: "",
    category: "",
    type: "", // Legacy field for backward compatibility
    issue_type: "community_based", // NEW: Community-based or individual-based
    priority: "medium",
    location: "",
    smaller_community: "",
    suburb: "",
    cottage: "",
    sector: "",
    subsector: "",
    people_affected: undefined,
    additional_notes: "",
    reporter_name: "",
    reporter_phone: "",
    reporter_email: "",
    reporter_gender: "",
    reporter_address: "",
  });

  // Fetch locations and sectors
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [locRes, secRes] = await Promise.all([
          locationsService.getLocations({ type: 'community', status: 'active' }),
          sectorsService.getSectors(),
        ]);

        if (locRes.success && locRes.data?.locations) {
          setLocations(locRes.data.locations);
        }
        if (secRes.success && secRes.data?.sectors) {
          setSectors(secRes.data.sectors);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Fetch smaller communities and suburbs when location changes
  useEffect(() => {
    const fetchSubLocations = async () => {
      // Reset sub-locations when main location changes
      setSmallerCommunities([]);
      setSuburbs([]);
      
      if (!formData.location) return;

      const selectedLocation = locations.find(l => l.name === formData.location);
      if (!selectedLocation) return;

      setLoadingSubLocations(true);
      try {
        const [smallerRes, suburbRes] = await Promise.all([
          locationsService.getLocations({ parent_id: selectedLocation.id, type: 'smaller_community', status: 'active' }),
          locationsService.getLocations({ parent_id: selectedLocation.id, type: 'suburb', status: 'active' })
        ]);

        if (smallerRes.success && smallerRes.data?.locations) {
          setSmallerCommunities(smallerRes.data.locations);
        }
        if (suburbRes.success && suburbRes.data?.locations) {
          setSuburbs(suburbRes.data.locations);
        }
      } catch (error) {
        console.error("Error fetching sub-locations:", error);
        toast.error("Failed to load sub-locations");
      } finally {
        setLoadingSubLocations(false);
      }
    };

    fetchSubLocations();
  }, [formData.location, locations]);

  const handleNext = (nextTab: string) => {
    setActiveTab(nextTab);
  };

  const updateField = (field: keyof IssueSubmission, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const required = ["title", "description", "category", "priority", "location"];
    for (const field of required) {
      if (!formData[field as keyof IssueSubmission]) {
        toast.error(`Please fill in the ${field.replace("_", " ")} field`);
        return false;
      }
    }

    if (!formData.reporter_name || !formData.reporter_phone) {
      toast.error("Please provide constituent name and phone number");
      setActiveTab("constituent-details");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await agentService.submitIssue(formData);

      if (response.success) {
        toast.success("Issue submitted successfully!");
        router.push("/agents-dashboard/issues");
      } else {
        toast.error(response.message || "Failed to submit issue");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred while submitting the issue");
    } finally {
      setSubmitting(false);
    }
  };

  // Get subsectors for selected sector
  const selectedSector = sectors.find((s) => s.name === formData.sector);
  const subsectors = selectedSector?.subsectors || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-8 bg-slate-100">
          <TabsTrigger
            value="issue-details"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
          >
            Issue Details
          </TabsTrigger>
          <TabsTrigger
            value="constituent-details"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
          >
            Constituent Details
          </TabsTrigger>
          <TabsTrigger
            value="location"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
          >
            Location
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Issue Details */}
        <TabsContent value="issue-details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Issue Title" required>
              <Input
                placeholder="Enter a clear and concise title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
              />
            </FormItem>
            <FormItem label="Impact Type" required>
              <Select 
                value={formData.issue_type || "community_based"} 
                onValueChange={(v) => {
                  updateField("issue_type", v);
                  // Reset people_affected if switching to individual
                  if (v === "individual_based") {
                    updateField("people_affected", 1);
                  }
                }}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Select Impact Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="community_based">
                    Community-Based Issue
                  </SelectItem>
                  <SelectItem value="individual_based">
                    Individual Issue
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 mt-1">
                {formData.issue_type === "community_based" 
                  ? "Affects multiple people in the community"
                  : "Affects a single person or household"}
              </p>
            </FormItem>
          </div>

          <FormItem label="Description" required>
            <Textarea
              className="min-h-[100px] border-slate-200 focus:border-slate-500 focus:ring-slate-500"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </FormItem>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Category" required>
              <Select value={formData.category} onValueChange={(v) => updateField("category", v)}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem label="Priority" required>
              <Select value={formData.priority} onValueChange={(v) => updateField("priority", v)}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Sector">
              <Select 
                value={formData.sector || ""} 
                onValueChange={(v) => {
                  updateField("sector", v);
                  updateField("subsector", ""); // Reset subsector when sector changes
                }}
                disabled={loadingData}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder={loadingData ? "Loading..." : "Select Sector"} />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sec) => (
                    <SelectItem key={sec.id} value={sec.name}>
                      {sec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem label="Subsector">
              <Select 
                value={formData.subsector || ""} 
                onValueChange={(v) => updateField("subsector", v)}
                disabled={!formData.sector || subsectors.length === 0}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Select Subsector (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  {subsectors.map((sub) => (
                    <SelectItem key={sub.id} value={sub.name}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          </div>

          {/* Show People Affected only for community-based issues */}
          {formData.issue_type === "community_based" && (
            <FormItem label="People Affected (Approx.)" required>
              <Input
                type="number"
                placeholder="e.g., 100"
                value={formData.people_affected || ""}
                onChange={(e) => updateField("people_affected", e.target.value ? parseInt(e.target.value) : undefined)}
                className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Approximate number of people affected by this issue
              </p>
            </FormItem>
          )}

          <FormItem label="Additional Notes">
            <Textarea
              className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
              value={formData.additional_notes || ""}
              onChange={(e) => updateField("additional_notes", e.target.value)}
            />
          </FormItem>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-red-500">* Required fields</p>
            <Button
              onClick={() => handleNext("constituent-details")}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* Tab 2: Constituent Details */}
        <TabsContent value="constituent-details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Constituent Name" required>
              <Input
                className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                value={formData.reporter_name || ""}
                onChange={(e) => updateField("reporter_name", e.target.value)}
              />
            </FormItem>
            <FormItem label="Phone Number" required>
              <Input
                className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                placeholder="+233 ..."
                value={formData.reporter_phone || ""}
                onChange={(e) => updateField("reporter_phone", e.target.value)}
              />
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Email Address">
              <Input
                type="email"
                className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                value={formData.reporter_email || ""}
                onChange={(e) => updateField("reporter_email", e.target.value)}
              />
            </FormItem>
            <FormItem label="Gender">
              <Select
                value={formData.reporter_gender || ""}
                onValueChange={(v) => updateField("reporter_gender", v)}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </div>

          <FormItem label="Home Address">
            <Input
              className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
              value={formData.reporter_address || ""}
              onChange={(e) => updateField("reporter_address", e.target.value)}
            />
          </FormItem>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-red-500">* Required fields</p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleNext("issue-details")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                onClick={() => handleNext("location")}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Location */}
        <TabsContent value="location" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Main Community" required>
              <Select
                value={formData.location}
                onValueChange={(v) => updateField("location", v)}
                disabled={loadingData}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder={loadingData ? "Loading..." : "Select Main Community"} />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.name}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem label="Smaller Community">
              <Select 
                value={formData.smaller_community || ""} 
                onValueChange={(v) => updateField("smaller_community", v)}
                disabled={!formData.location || loadingSubLocations}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder={
                    loadingSubLocations 
                      ? "Loading..." 
                      : (!formData.location ? "Select Main Community first" : "Select Smaller Community (Optional)")
                  } />
                </SelectTrigger>
                <SelectContent>
                  {smallerCommunities.map((loc) => (
                    <SelectItem key={loc.id} value={loc.name}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Suburb">
              <Select 
                value={formData.suburb || ""} 
                onValueChange={(v) => updateField("suburb", v)}
                disabled={!formData.location || loadingSubLocations}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder={
                    loadingSubLocations 
                      ? "Loading..." 
                      : (!formData.location ? "Select Main Community first" : "Select Suburb (Optional)")
                  } />
                </SelectTrigger>
                <SelectContent>
                  {suburbs.map((loc) => (
                    <SelectItem key={loc.id} value={loc.name}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem label="Specific Location Details">
              <Input
                placeholder="e.g., 'Near the old market'"
                className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                value={formData.cottage || ""}
                onChange={(e) => updateField("cottage", e.target.value)}
              />
            </FormItem>
          </div>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-red-500">* Required fields</p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleNext("constituent-details")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Submit Issue
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FormItem({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
