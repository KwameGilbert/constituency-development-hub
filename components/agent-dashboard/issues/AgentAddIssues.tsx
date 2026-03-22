"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Loader2,
  Check,
  ChevronsUpDown,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
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
import { agentService, IssueSubmission } from "@/lib/services/agent-service";
import { locationsService } from "@/lib/services/locations-service";
import {
  sectorsService,
  Sector,
  SubSector,
} from "@/lib/services/sectors-service";
import { categoriesService, Category } from "@/lib/services/categories-service";

// Zod schema for constituent details validation
const constituentSchema = z.object({
  constituent_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(
      /^[a-zA-Z\s\-'.]+$/,
      "Name should only contain letters, spaces, hyphens, or apostrophes",
    ),
  constituent_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(
      /^\+?[0-9]+$/,
      "Phone number should only contain digits (optionally starting with +)",
    ),
  constituent_email: z
    .string()
    .email("Please enter a valid email address")
    .or(z.literal("")),
});

type ConstituentFieldErrors = Partial<
  Record<keyof z.infer<typeof constituentSchema>, string>
>;

interface Location {
  id: number;
  name: string;
}

export function AgentAddIssues() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("constituent-details");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ConstituentFieldErrors>({});
  const [locations, setLocations] = useState<Location[]>([]);

  const [suburbs, setSuburbs] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSectors, setFilteredSectors] = useState<Sector[]>([]);
  const [subSectors, setSubSectors] = useState<SubSector[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubLocations, setLoadingSubLocations] = useState(false);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [loadingSubSectors, setLoadingSubSectors] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState<IssueSubmission>({
    title: "",
    description: "",
    category: "",
    category_id: undefined,
    issue_type: "community_based", // NEW: Community-based or individual-based
    priority: "medium",
    community: "",
    community_id: 0,
    suburb: "",
    suburb_id: undefined,
    specific_location: "",
    sector_id: undefined,
    sector: "",
    sub_sector_id: undefined,
    subsector: "",
    people_affected: undefined,
    estimated_budget: undefined,
    additional_notes: "",
    constituent_name: "",
    constituent_phone: "",
    constituent_email: "",
    constituent_gender: "",
    constituent_address: "",
  });

  // Fetch locations, sectors, and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [locRes, catRes] = await Promise.all([
          locationsService.getLocations({
            type: "community",
            status: "active",
            limit: 10000,
          }),
          categoriesService.getCategories(),
        ]);

        if (locRes.success && locRes.data?.locations) {
          setLocations(locRes.data.locations);
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

  // Fetch sectors when category changes
  useEffect(() => {
    const fetchSectors = async () => {
      if (!formData.category_id) {
        setFilteredSectors([]);
        return;
      }

      setLoadingSectors(true);
      try {
        const response = await sectorsService.getSectors(formData.category_id);
        if (response.success && response.data?.sectors) {
          setFilteredSectors(response.data.sectors);
        } else {
          setFilteredSectors([]);
        }
      } catch (error) {
        console.error("Error fetching sectors:", error);
        toast.error("Failed to load sectors");
      } finally {
        setLoadingSectors(false);
      }
    };

    fetchSectors();
    // Reset sector and subsector when category changes
    setSubSectors([]);
  }, [formData.category_id, setSubSectors]);

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
  }, [formData.sector_id, setSubSectors]);

  // Fetch smaller communities and suburbs when location changes
  useEffect(() => {
    const fetchSubLocations = async () => {
      // Reset sub-locations when main location changes
      setSuburbs([]);

      if (!formData.community_id) return;

      const selectedLocation = locations.find(
        (l) => l.id === formData.community_id,
      );
      if (!selectedLocation) return;

      setLoadingSubLocations(true);
      try {
        const suburbRes = await locationsService.getLocations({
          parent_id: selectedLocation.id,
          type: "suburb",
          status: "active",
          limit: 10000,
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
  }, [formData.community_id, locations]);

  const handleNext = (nextTab: string) => {
    setActiveTab(nextTab);
  };

  const updateField = (
    field: keyof IssueSubmission,
    value: string | number | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Real-time validation for constituent fields
  const validateConstituentField = (
    field: keyof z.infer<typeof constituentSchema>,
    value: string,
  ) => {
    // Only validate if user has typed something
    if (!value) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      return;
    }
    const fieldSchema = constituentSchema.shape[field];
    const result = fieldSchema.safeParse(value);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: result.success
        ? undefined
        : result.error?.issues?.[0]?.message || "Invalid input",
    }));
  };

  const validateForm = (): boolean => {
    const required = [
      "title",
      "description",
      "category",
      "priority",
      "community",
    ];
    for (const field of required) {
      if (!formData[field as keyof IssueSubmission]) {
        toast.error(`Please fill in the ${field.replace("_", " ")} field`);
        return false;
      }
    }

    if (!formData.constituent_name || !formData.constituent_phone) {
      toast.error("Please provide constituent name and phone number");
      setActiveTab("constituent-details");
      return false;
    }

    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Create FormData to handle image uploads
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          submitData.append(key, value.toString());
        }
      });

      // Add images
      imageFiles.forEach((file) => {
        submitData.append("images[]", file);
      });

      const response = await agentService.submitIssue(submitData);

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[450px] mb-8 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger
            value="constituent-details"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm transition-all"
          >
            Constituent Details
          </TabsTrigger>
          <TabsTrigger
            value="location"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm transition-all"
          >
            Location
          </TabsTrigger>
          <TabsTrigger
            value="issue-details"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm transition-all"
          >
            Issue Details
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
                className="border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
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
              height={400}
            />
          </FormItem>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Category" required>
              <Select
                value={formData.category_id?.toString() || ""}
                onValueChange={(v) => {
                  const categoryId = parseInt(v);
                  const selectedCat = categories.find(
                    (c) => c.id === categoryId,
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
                  <SelectItem value="urgent">Urgent</SelectItem>
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
                    (s) => s.id === sectorId,
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
                    (s) => s.id === subSectorId,
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  className="border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Approximate number of people affected by this issue
                </p>
              </FormItem>
            )}

            <FormItem label="Estimated Budget (GHS)">
              <Input
                type="number"
                placeholder="e.g., 5000"
                value={formData.estimated_budget || ""}
                onChange={(e) =>
                  updateField(
                    "estimated_budget",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                className="border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
              />
              <p className="text-xs text-slate-500 mt-1">
                Optional estimated cost to resolve the issue
              </p>
            </FormItem>
          </div>

          <FormItem label="Additional Notes">
            <Textarea
              className="border-slate-200 focus:border-slate-500 focus:ring-slate-500 min-h-[100px]"
              value={formData.additional_notes || ""}
              onChange={(e) => updateField("additional_notes", e.target.value)}
              placeholder="Any other details that might be helpful..."
            />
          </FormItem>

          <FormItem label="Issue Images">
            <div className="mt-2 flex flex-wrap gap-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm"
                >
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all text-slate-400 hover:text-amber-500">
                <ImageIcon className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-medium">Add Image</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </FormItem>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-red-500">* Required fields</p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleNext("location")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-md shadow-amber-200/50 transition-all font-semibold"
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

        {/* Tab 2: Constituent Details */}
        <TabsContent value="constituent-details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem
              label="Constituent Name"
              required
              error={fieldErrors.constituent_name}
            >
              <Input
                className={cn(
                  "border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg",
                  fieldErrors.constituent_name &&
                    "border-red-400 focus:border-red-500 focus:ring-red-500",
                )}
                value={formData.constituent_name || ""}
                onChange={(e) => {
                  updateField("constituent_name", e.target.value);
                  validateConstituentField("constituent_name", e.target.value);
                }}
              />
            </FormItem>
            <FormItem
              label="Phone Number"
              required
              error={fieldErrors.constituent_phone}
            >
              <Input
                type="tel"
                inputMode="numeric"
                maxLength={13}
                className={cn(
                  "border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg",
                  fieldErrors.constituent_phone &&
                    "border-red-400 focus:border-red-500 focus:ring-red-500",
                )}
                placeholder="+233 ..."
                value={formData.constituent_phone || ""}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /[^0-9+]/g,
                    "",
                  );
                }}
                onChange={(e) => {
                  const filtered = e.target.value.replace(/[^0-9+]/g, "");
                  updateField("constituent_phone", filtered);
                  validateConstituentField("constituent_phone", filtered);
                }}
              />
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem
              label="Email Address"
              error={fieldErrors.constituent_email}
            >
              <Input
                type="email"
                className={cn(
                  "border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg",
                  fieldErrors.constituent_email &&
                    "border-red-400 focus:border-red-500 focus:ring-red-500",
                )}
                value={formData.constituent_email || ""}
                onChange={(e) => {
                  updateField("constituent_email", e.target.value);
                  validateConstituentField("constituent_email", e.target.value);
                }}
              />
            </FormItem>
            <FormItem label="Gender">
              <Select
                value={formData.constituent_gender || ""}
                onValueChange={(v) => updateField("constituent_gender", v)}
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
              className="border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
              value={formData.constituent_address || ""}
              onChange={(e) =>
                updateField("constituent_address", e.target.value)
              }
            />
          </FormItem>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-red-500">* Required fields</p>
            <Button
              onClick={() => handleNext("location")}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm font-semibold px-6"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* Tab 3: Location */}
        <TabsContent value="location" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Community" required>
              <SearchableSelect
                value={formData.community_id?.toString() || ""}
                onChange={(v) => {
                  const id = parseInt(v);
                  const loc = locations.find((l) => l.id === id);
                  updateField("community_id", id);
                  updateField("community", loc?.name || "");
                }}
                options={locations.map((loc) => ({
                  label: loc.name,
                  value: loc.id.toString(),
                }))}
                placeholder={loadingData ? "Loading..." : "Select Community"}
                searchPlaceholder="Search communities..."
                loading={loadingData}
                disabled={loadingData}
              />
            </FormItem>
            <FormItem label="Suburb">
              <SearchableSelect
                value={formData.suburb_id?.toString() || ""}
                onChange={(v) => {
                  const id = parseInt(v);
                  const loc = suburbs.find((l) => l.id === id);
                  updateField("suburb_id", id);
                  updateField("suburb", loc?.name || "");
                }}
                options={suburbs.map((loc) => ({
                  label: loc.name,
                  value: loc.id.toString(),
                }))}
                placeholder={
                  !formData.community_id
                    ? "Select Community first"
                    : "Select Suburb (Optional)"
                }
                searchPlaceholder="Search suburbs..."
                disabled={!formData.community_id || loadingSubLocations}
                loading={loadingSubLocations}
                emptyMessage="No suburb found."
              />
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem label="Specific Location">
              <Input
                placeholder="e.g., 'Near the old market'"
                className="border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                value={formData.specific_location || ""}
                onChange={(e) =>
                  updateField("specific_location", e.target.value)
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
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                onClick={() => handleNext("issue-details")}
                className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm font-semibold px-6"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
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
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
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
            disabled && "opacity-50 cursor-not-allowed",
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
                      value === option.value ? "opacity-100" : "opacity-0",
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
