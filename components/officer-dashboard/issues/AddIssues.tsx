"use client";

import React, { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { locationsService, Location } from "@/lib/services/locations-service";
import { issuesService } from "@/lib/services/issues-service";

export function AddIssues() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("issue-details");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Dropdown Data
  const [communities, setCommunities] = useState<Location[]>([]);
  const [suburbs, setSuburbs] = useState<Location[]>([]);
  const [smallerCommunities, setSmallerCommunities] = useState<Location[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    // Issue Details
    title: "",
    issue_type: "",
    description: "",
    category: "",
    priority: "", // maps to severity
    sector: "",
    subsector: "",
    people_affected: "",
    notes: "",

    // Constituent Details
    reporter_name: "", // Constituent Name
    reporter_phone: "",
    reporter_email: "",
    constituent_gender: "",
    constituent_address: "",

    // Location
    location_community: "",
    location_smaller_community: "",
    location_suburb: "",
    location_details: "",
  });

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const [coms, subs, smalls] = await Promise.all([
          locationsService.getLocations({ type: "community", limit: 100 }),
          locationsService.getLocations({ type: "suburb", limit: 100 }),
          locationsService.getLocations({
            type: "smaller_community",
            limit: 100,
          }),
        ]);

        if (coms.success) setCommunities(coms.data.locations);
        if (subs.success) setSuburbs(subs.data.locations);
        if (smalls.success) setSmallerCommunities(smalls.data.locations);
      } catch (error) {
        console.error("Failed to load locations", error);
        toast.error("Failed to load location data");
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = (nextTab: string) => {
    // Basic validation before switching?
    if (activeTab === "issue-details") {
      if (
        !formData.title ||
        !formData.issue_type ||
        !formData.description ||
        !formData.category ||
        !formData.priority ||
        !formData.sector
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    if (activeTab === "constituent-details") {
      if (!formData.reporter_name || !formData.reporter_phone) {
        toast.error("Please fill in constituent name and phone");
        return;
      }
    }
    setActiveTab(nextTab);
  };

  const handleSubmit = async () => {
    if (!formData.location_community && !formData.location_suburb) {
      toast.error("Please select at least a main community or suburb");
      return;
    }

    setSubmitting(true);
    try {
      // Resolve names from IDs (assuming select values are IDs or Names - let's assume Names for simplicity or lookup)
      // Ideally we store IDs but backend takes string location.
      // Wait, select values usually are IDs. I should find Name by ID.
      const getLocName = (id: string, list: Location[]) =>
        list.find((l) => l.id.toString() === id)?.name || id;

      const comName = getLocName(formData.location_community, communities);
      const subName = getLocName(formData.location_suburb, suburbs);
      const smallName = getLocName(
        formData.location_smaller_community,
        smallerCommunities,
      );

      const locationParts = [];
      if (smallName) locationParts.push(smallName);
      if (subName) locationParts.push(subName);
      if (comName) locationParts.push(comName);

      // Final string: "Details, Smaller Comm, Suburb, Community"
      const hierarchy = locationParts.join(", ");
      const fullLocation = formData.location_details
        ? `${formData.location_details}, ${hierarchy}`
        : hierarchy;

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("issue_type", formData.issue_type);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);

      // Map severity to priority
      const priorityMap: Record<string, string> = {
        low: "low",
        medium: "medium",
        high: "high",
        critical: "urgent",
      };
      submitData.append("priority", priorityMap[formData.priority] || "medium");

      submitData.append("sector", formData.sector);
      submitData.append("subsector", formData.subsector);
      submitData.append("people_affected", formData.people_affected);
      submitData.append("notes", formData.notes);

      submitData.append("reporter_name", formData.reporter_name);
      submitData.append("reporter_phone", formData.reporter_phone);
      submitData.append("reporter_email", formData.reporter_email);
      submitData.append("constituent_gender", formData.constituent_gender);
      submitData.append("constituent_address", formData.constituent_address);

      submitData.append("location", fullLocation);

      const response = await issuesService.submitOfficerIssue(submitData);

      if (response.success) {
        toast.success("Issue submitted successfully");
        // Reset or redirect
        router.push("/officer-dashboard/issues");
      } else {
        toast.error(response.message || "Failed to submit issue");
      }
    } catch (error) {
      console.error("Submit error", error);
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-8">
          <TabsTrigger value="issue-details">Issue Details</TabsTrigger>
          <TabsTrigger value="constituent-details">
            Constituent Details
          </TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        {/* Tab 1: Issue Details */}
        <TabsContent value="issue-details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Issue Title" required>
              <Input
                placeholder="Brief title of the issue"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </FormItem>
            <FormItem label="Issue Type" required>
              <Select
                value={formData.issue_type}
                onValueChange={(v) => handleChange("issue_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Service Delivery">
                    Service Delivery
                  </SelectItem>
                  <SelectItem value="Social Welfare">Social Welfare</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </div>

          <FormItem label="Description" required>
            <Textarea
              className="min-h-[100px]"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </FormItem>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Category" required>
              <Select
                value={formData.category}
                onValueChange={(v) => handleChange("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Water">Water</SelectItem>
                  <SelectItem value="Electricity">Electricity</SelectItem>
                  <SelectItem value="Roads">Roads</SelectItem>
                  <SelectItem value="Sanitation">Sanitation</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem label="Severity" required>
              <Select
                value={formData.priority}
                onValueChange={(v) => handleChange("priority", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Severity" />
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
            <FormItem label="Sector" required>
              <Select
                value={formData.sector}
                onValueChange={(v) => handleChange("sector", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="NGO">NGO</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem label="Subsector">
              <Select
                value={formData.subsector}
                onValueChange={(v) => handleChange("subsector", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subsector (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primary Education">
                    Primary Education
                  </SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Road Maintenance">
                    Road Maintenance
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </div>

          <FormItem label="People Affected (Approx.)">
            <Input
              placeholder="e.g., 100"
              value={formData.people_affected}
              onChange={(e) => handleChange("people_affected", e.target.value)}
            />
          </FormItem>

          <FormItem label="Additional Notes">
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </FormItem>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-red-500">* Required fields</p>
            <Button
              onClick={() => handleNext("constituent-details")}
              className="bg-[#1e1b4b] hover:bg-[#1e1b4b]/90"
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
                value={formData.reporter_name}
                onChange={(e) => handleChange("reporter_name", e.target.value)}
              />
            </FormItem>
            <FormItem label="Phone Number" required>
              <Input
                value={formData.reporter_phone}
                onChange={(e) => handleChange("reporter_phone", e.target.value)}
              />
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Email Address">
              <Input
                value={formData.reporter_email}
                onChange={(e) => handleChange("reporter_email", e.target.value)}
              />
            </FormItem>
            <FormItem label="Gender">
              <Select
                value={formData.constituent_gender}
                onValueChange={(v) => handleChange("constituent_gender", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </div>

          <FormItem label="Home Address">
            <Input
              value={formData.constituent_address}
              onChange={(e) =>
                handleChange("constituent_address", e.target.value)
              }
            />
          </FormItem>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-red-500">* Required fields</p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleNext("issue-details")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                onClick={() => handleNext("location")}
                className="bg-[#1e1b4b] hover:bg-[#1e1b4b]/90"
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
                value={formData.location_community}
                onValueChange={(v) => handleChange("location_community", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Main Community" />
                </SelectTrigger>
                <SelectContent>
                  {communities.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem label="Smaller Community">
              <Select
                value={formData.location_smaller_community}
                onValueChange={(v) =>
                  handleChange("location_smaller_community", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Smaller Community (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  {smallerCommunities.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Suburb">
              <Select
                value={formData.location_suburb}
                onValueChange={(v) => handleChange("location_suburb", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Suburb (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  {suburbs.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem label="Specific Location Details">
              <Input
                placeholder="e.g., 'In front of Building 5'"
                value={formData.location_details}
                onChange={(e) =>
                  handleChange("location_details", e.target.value)
                }
              />
            </FormItem>
          </div>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-red-500">* Required fields</p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleNext("constituent-details")}
                disabled={submitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                className="bg-[#1e1b4b] hover:bg-[#1e1b4b]/90"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Submit Issue
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
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
