"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Loader2,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { issuesService } from "@/lib/services/issues-service";
import { IssueSubmission } from "@/lib/services/agent-service"; // Reusing type
import { locationsService } from "@/lib/services/locations-service";
import {
  sectorsService,
  Sector,
  SubSector,
} from "@/lib/services/sectors-service";
import { categoriesService, Category } from "@/lib/services/categories-service";

interface Location {
  id: number;
  name: string;
}

export function AddIssues() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("issue-details");
  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);

  const [suburbs, setSuburbs] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [filteredSectors, setFilteredSectors] = useState<Sector[]>([]);
  const [subSectors, setSubSectors] = useState<SubSector[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubLocations, setLoadingSubLocations] = useState(false);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [loadingSubSectors, setLoadingSubSectors] = useState(false);

  // Form state
  const [formData, setFormData] = useState<IssueSubmission>({
    title: "",
    description: "",
    category: "",
    category_id: undefined,
    type: "", // Legacy field for backward compatibility
    issue_type: "community_based",
    priority: "medium",
    location: "",
    smaller_community: "",
    suburb: "",
    cottage: "",
    sector_id: undefined,
    sector: "",
    sub_sector_id: undefined,
    subsector: "",
    people_affected: undefined,
    additional_notes: "",
    reporter_name: "",
    reporter_phone: "",
    reporter_email: "",
    reporter_gender: "",
    reporter_address: "",
  });

  // Fetch locations, sectors, and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [locRes, secRes, catRes] = await Promise.all([
          locationsService.getLocations({
            type: "community",
            status: "active",
          }),
          sectorsService.getSectors(),
          categoriesService.getCategories(),
        ]);

        if (locRes.success && locRes.data?.locations) {
          setLocations(locRes.data.locations);
        }
        if (secRes.success && secRes.data?.sectors) {
          setSectors(secRes.data.sectors);
        }
        if (catRes.success && catRes.data?.categories) {
          setCategories(catRes.data.categories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Filter sectors when category changes
  useEffect(() => {
    if (formData.category_id) {
      setLoadingSectors(true);
      const filtered = sectors.filter(
        (s) => s.category_id === formData.category_id
      );
      setFilteredSectors(filtered);
      setLoadingSectors(false);
    } else {
      setFilteredSectors([]);
    }
    // Reset sector and subsector when category changes
    setSubSectors([]);
  }, [formData.category_id, sectors]);

  // Load subsectors when sector changes
  useEffect(() => {
    const fetchSubSectors = async () => {
      if (!formData.sector_id) {
        setSubSectors([]);
        return;
      }

      setLoadingSubSectors(true);
      try {
        const response = await sectorsService.getSubSectors(formData.sector_id);
        if (response.success && response.data?.sub_sectors) {
          setSubSectors(response.data.sub_sectors);
        }
      } catch (error) {
        console.error("Error fetching subsectors:", error);
      } finally {
        setLoadingSubSectors(false);
      }
    };

    fetchSubSectors();
  }, [formData.sector_id]);

  // Fetch smaller communities and suburbs when location changes
  useEffect(() => {
    const fetchSubLocations = async () => {
      // Reset sub-locations when main location changes
      setSuburbs([]);

      if (!formData.location) return;

      const selectedLocation = locations.find(
        (l) => l.name === formData.location
      );
      if (!selectedLocation) return;

      setLoadingSubLocations(true);
      try {
        const suburbRes = await locationsService.getLocations({
          parent_id: selectedLocation.id,
          type: "suburb",
          status: "active",
        });

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

  const updateField = (
    field: keyof IssueSubmission,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const required = [
      "title",
      "description",
      "category",
      "priority",
      "location",
    ];
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
      // Create FormData for officer submission
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          submitData.append(key, value.toString());
        }
      });

      const response = await issuesService.submitOfficerIssue(submitData);

      if (response.success) {
        toast.success("Issue submitted successfully!");
        router.push("/officer-dashboard/issues");
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
            <RichTextEditor
              value={formData.description}
              onChange={(value) => updateField("description", value)}
              placeholder="Describe the issue in detail..."
              height={200}
            />
          </FormItem>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Category" required>
              <Select
                value={formData.category_id?.toString() || ""}
                onValueChange={(v) => {
                  const categoryId = parseInt(v);
                  const selectedCat = categories.find(
                    (c) => c.id === categoryId
                  );
                  updateField("category_id", categoryId);
                  updateField("category", selectedCat?.name || "");
                  // Reset sector and subsector when category changes
                  updateField("sector_id", undefined);
                  updateField("sector", "");
                  updateField("sub_sector_id", undefined);
                  updateField("subsector", "");
                }}
                disabled={loadingData}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue
                    placeholder={loadingData ? "Loading..." : "Select Category"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem label="Priority" required>
              <Select
                value={formData.priority}
                onValueChange={(v) => updateField("priority", v)}
              >
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
                value={formData.sector_id?.toString() || ""}
                onValueChange={(v) => {
                  if (v === "placeholder" || v === "loading" || v === "empty")
                    return;
                  const sectorId = parseInt(v);
                  const selectedSec = filteredSectors.find(
                    (s) => s.id === sectorId
                  );
                  updateField("sector_id", sectorId);
                  updateField("sector", selectedSec?.name || "");
                  // Reset subsector when sector changes
                  updateField("sub_sector_id", undefined);
                  updateField("subsector", "");
                }}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  {!formData.category_id ? (
                    <SelectItem value="placeholder" disabled>
                      Select a category first
                    </SelectItem>
                  ) : loadingSectors ? (
                    <SelectItem value="loading" disabled>
                      Loading sectors...
                    </SelectItem>
                  ) : filteredSectors.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No sectors found for this category
                    </SelectItem>
                  ) : (
                    filteredSectors.map((sec) => (
                      <SelectItem key={sec.id} value={sec.id.toString()}>
                        {sec.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem label="Subsector">
              <Select
                value={formData.sub_sector_id?.toString() || ""}
                onValueChange={(v) => {
                  if (v === "placeholder" || v === "loading" || v === "empty")
                    return;
                  const subSectorId = parseInt(v);
                  const selectedSubSec = subSectors.find(
                    (s) => s.id === subSectorId
                  );
                  updateField("sub_sector_id", subSectorId);
                  updateField("subsector", selectedSubSec?.name || "");
                }}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Select Subsector (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  {!formData.sector_id ? (
                    <SelectItem value="placeholder" disabled>
                      Select a sector first
                    </SelectItem>
                  ) : loadingSubSectors ? (
                    <SelectItem value="loading" disabled>
                      Loading subsectors...
                    </SelectItem>
                  ) : subSectors.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No subsectors available
                    </SelectItem>
                  ) : (
                    subSectors.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id.toString()}>
                        {sub.name}
                      </SelectItem>
                    ))
                  )}
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
                onChange={(e) =>
                  updateField(
                    "people_affected",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
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
              <SearchableSelect
                value={formData.location}
                onChange={(v) => updateField("location", v)}
                options={locations.map((loc) => ({
                  label: loc.name,
                  value: loc.name,
                }))}
                placeholder={
                  loadingData ? "Loading..." : "Select Main Community"
                }
                searchPlaceholder="Search communities..."
                loading={loadingData}
                disabled={loadingData}
              />
            </FormItem>
            <FormItem label="Smaller Community">
              <SearchableSelect
                value={formData.suburb || ""}
                onChange={(v) => updateField("suburb", v)}
                options={suburbs.map((loc) => ({
                  label: loc.name,
                  value: loc.name,
                }))}
                placeholder={
                  !formData.location
                    ? "Select Main Community first"
                    : "Select Smaller Community (Optional)"
                }
                searchPlaceholder="Search smaller communities..."
                disabled={!formData.location || loadingSubLocations}
                loading={loadingSubLocations}
                emptyMessage="No smaller community found."
              />
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Submitting...
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

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No item found.",
  disabled = false,
  loading = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            "border-slate-200 bg-transparent hover:bg-slate-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          {loading
            ? "Loading..."
            : value
              ? options.find((option) => option.value === value)?.label || value
              : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
