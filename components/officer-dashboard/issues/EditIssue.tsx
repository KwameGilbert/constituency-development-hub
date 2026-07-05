"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2,
  Check,
  ChevronsUpDown,
  Image as ImageIcon,
  X,
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
import { issuesService, Issue } from "@/lib/services/issues-service";
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

interface FormData {
  title: string;
  description: string;
  category: string;
  category_id?: number;
  issue_type: "community_based" | "individual_based";
  priority: "low" | "medium" | "high" | "urgent";
  location: string;
  smaller_community?: string;
  suburb?: string;
  suburb_id?: number;
  community_id?: number;
  cottage?: string;
  sector_id?: number;
  sector?: string;
  sub_sector_id?: number;
  subsector?: string;
  people_affected?: number;
  additional_notes?: string;
  reporter_name: string;
  reporter_phone: string;
  reporter_email?: string;
  reporter_gender?: string;
  reporter_address?: string;
  agent_id?: number;
  images?: string[];
}

interface EditIssueProps {
  issueId: string;
  onIssueLoad?: (caseId: string) => void;
}

interface RawIssue {
  id: number;
  case_id?: string;
  title?: string;
  description?: string;
  category?: string;
  category_id?: string | number;
  issue_type?: string;
  priority?: string;
  community?: string;
  location?: string;
  community_id?: string | number;
  suburb?: string;
  suburb_id?: string | number;
  specific_location?: string;
  cottage?: string;
  sector_id?: string | number;
  sector?: string;
  sub_sector_id?: string | number;
  subsector?: string;
  people_affected?: string | number;
  details?: string;
  additional_notes?: string;
  reporter_name?: string;
  reporter_phone?: string;
  reporter_email?: string;
  reporter_gender?: string;
  reporter_address?: string;
  constituent?: {
    name?: string;
    phone_number?: string;
    email?: string;
    gender?: string;
    home_address?: string;
  };
  agent?: {
    id?: number;
  };
  agent_id?: string | number;
  images?: string[];
}

export function EditIssue({ issueId, onIssueLoad }: EditIssueProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Data options
  const [locations, setLocations] = useState<Location[]>([]);
  const [suburbs, setSuburbs] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [filteredSectors, setFilteredSectors] = useState<Sector[]>([]);
  const [subSectors, setSubSectors] = useState<SubSector[]>([]);
  const [agents, setAgents] = useState<
    { id: number; name: string; email: string }[]
  >([]);

  // Loading states
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubLocations, setLoadingSubLocations] = useState(false);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [loadingSubSectors, setLoadingSubSectors] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    category_id: undefined,
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
    agent_id: undefined,
  });

  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Fetch initial issue data and general options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingInitial(true);
        setLoadingData(true);

        const [issueRes, locRes, secRes, catRes, agentRes] = await Promise.all([
          issuesService.getOfficerIssueById(parseInt(issueId)),
          locationsService.getLocations({
            type: "community",
            status: "active",
            limit: 1000,
          }),
          sectorsService.getSectors(),
          categoriesService.getCategories(),
          issuesService.getAgentsForOfficer(),
        ]);

        const typedLocRes = locRes as unknown as { success: boolean; data?: { locations?: Location[] } };
        if (typedLocRes.success && typedLocRes.data?.locations) {
          setLocations(typedLocRes.data.locations);
        }

        const typedSecRes = secRes as unknown as { success: boolean; data?: { sectors?: Sector[] } };
        if (typedSecRes.success && typedSecRes.data?.sectors) {
          setSectors(typedSecRes.data.sectors);
        }

        const typedCatRes = catRes as unknown as { success: boolean; data?: { categories?: Category[] } };
        if (typedCatRes.success && typedCatRes.data?.categories) {
          setCategories(typedCatRes.data.categories);
        }

        const typedAgentRes = agentRes as unknown as { success: boolean; data?: { agents?: { id: number; name: string; email: string }[] } };
        if (typedAgentRes.success && typedAgentRes.data?.agents) {
          setAgents(typedAgentRes.data.agents);
        }

        if (issueRes.success && issueRes.data.report) {
          const issue = issueRes.data.report as unknown as RawIssue;

          if (onIssueLoad && issue.case_id) {
            onIssueLoad(issue.case_id);
          } else if (onIssueLoad) {
            onIssueLoad(`#${issue.id}`);
          }

          // Map backend issue to form data
          setFormData({
            title: issue.title || "",
            description: issue.description || "",
            category: issue.category || "",
            category_id: issue.category_id
              ? Number(issue.category_id)
              : undefined,
            issue_type:
              (issue.issue_type as "community_based" | "individual_based") ||
              "community_based",
            priority:
              (issue.priority as "low" | "medium" | "high" | "urgent") ||
              "medium",
            location: (issue.community && issue.community !== "Unknown" && issue.community !== "0")
              ? issue.community
              : (issue.location && issue.location !== "0" ? issue.location : ""),
            community_id: (issue.community_id && Number(issue.community_id) !== 0)
              ? Number(issue.community_id)
              : undefined,
            suburb: (issue.suburb && issue.suburb !== "Unknown" && issue.suburb !== "0") ? issue.suburb : "",
            suburb_id: (issue.suburb_id && Number(issue.suburb_id) !== 0) ? Number(issue.suburb_id) : undefined,
            cottage: issue.specific_location || issue.cottage || "",
            sector_id: issue.sector_id ? Number(issue.sector_id) : undefined,
            sector: issue.sector || "",
            sub_sector_id: issue.sub_sector_id
              ? Number(issue.sub_sector_id)
              : undefined,
            subsector: issue.subsector || "",
            people_affected: issue.people_affected
              ? Number(issue.people_affected)
              : undefined,
            additional_notes: issue.details || issue.additional_notes || "",
            reporter_name: issue.reporter_name || issue.constituent?.name || "",
            reporter_phone:
              issue.reporter_phone || issue.constituent?.phone_number || "",
            reporter_email:
              issue.reporter_email || issue.constituent?.email || "",
            reporter_gender:
              issue.reporter_gender || issue.constituent?.gender || "",
            reporter_address:
              issue.reporter_address || issue.constituent?.home_address || "",
            agent_id:
              issue.agent?.id ||
              (issue.agent_id ? Number(issue.agent_id) : undefined),
            images: Array.isArray(issue.images) ? issue.images : [],
          });
        } else {
          toast.error("Failed to load issue details");
          router.push("/officer-dashboard/issues");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while loading data");
      } finally {
        setLoadingInitial(false);
        setLoadingData(false);
      }
    };

    fetchData();
  }, [issueId, router, onIssueLoad]);

  // Filter sectors when category changes
  useEffect(() => {
    if (formData.category_id && sectors.length > 0) {
      setLoadingSectors(true);
      const filtered = sectors.filter(
        (s) => s.category_id === formData.category_id,
      );
      setFilteredSectors(filtered);
      setLoadingSectors(false);
    } else {
      setFilteredSectors([]);
    }
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

  // Fetch suburbs when location changes
  useEffect(() => {
    const fetchSubLocations = async () => {
      if (!formData.location || locations.length === 0) {
        setSuburbs([]);
        return;
      }

      const selectedLocation = locations.find(
        (l) => l.name === formData.location,
      );
      if (!selectedLocation) return;

      setLoadingSubLocations(true);
      try {
        const suburbRes = await locationsService.getLocations({
          parent_id: selectedLocation.id,
          type: "suburb",
          status: "active",
          limit: 1000,
        });

        if (suburbRes.success && suburbRes.data?.locations) {
          setSuburbs(suburbRes.data.locations);
        }
      } catch (error) {
        console.error("Error fetching sub-locations:", error);
      } finally {
        setLoadingSubLocations(false);
      }
    };

    fetchSubLocations();
  }, [formData.location, locations]);


  const updateField = (
    field: keyof FormData,
    value: string | number | undefined | boolean | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const required: (keyof FormData)[] = [
      "title",
      "description",
      "category",
      "priority",
      "location",
    ];
    for (const field of required) {
      if (!formData[field]) {
        toast.error(
          `Please fill in the ${String(field).replace("_", " ")} field`,
        );
        return false;
      }
    }

    if (!formData.reporter_name || !formData.reporter_phone) {
      toast.error("Please provide constituent name and phone number");
      return false;
    }

    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setNewImageFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    const newFiles = [...newImageFiles];
    newFiles.splice(index, 1);
    setNewImageFiles(newFiles);

    const newPreviews = [...newImagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setNewImagePreviews(newPreviews);
  };

  const removeExistingImage = (imageUrl: string) => {
    setImagesToDelete((prev) => [...prev, imageUrl]);
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((img) => img !== imageUrl),
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Find IDs for community and suburb if not already set (for safety)
      let finalCommunityId = formData.community_id;
      if (!finalCommunityId && formData.location) {
        finalCommunityId = locations.find(
          (l) => l.name === formData.location,
        )?.id;
      }

      let finalSuburbId = formData.suburb_id;
      if (!finalSuburbId && formData.suburb) {
        finalSuburbId = suburbs.find((l) => l.name === formData.suburb)?.id;
      }

      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          (typeof value !== "string" || value !== "") &&
          key !== "images"
        ) {
          submitData.append(key, value.toString());
        }
      });

      if (finalCommunityId)
        submitData.append("community_id", finalCommunityId.toString());
      if (finalSuburbId)
        submitData.append("suburb_id", finalSuburbId.toString());
      submitData.append("specific_location", formData.cottage || "");
      submitData.append("details", formData.additional_notes || "");

      // Also send reporter fields for backend processing if needed (as constituent fields)
      if (formData.reporter_name)
        submitData.append("constituent_name", formData.reporter_name);
      if (formData.reporter_phone)
        submitData.append("constituent_phone", formData.reporter_phone);
      if (formData.reporter_email)
        submitData.append("constituent_email", formData.reporter_email);
      if (formData.reporter_gender)
        submitData.append("constituent_gender", formData.reporter_gender);
      if (formData.reporter_address)
        submitData.append("constituent_address", formData.reporter_address);

      submitData.append("keep_existing_images", "true");

      // Add existing images to delete
      imagesToDelete.forEach((img) => {
        submitData.append("delete_images[]", img);
      });

      // Add new images
      newImageFiles.forEach((file) => {
        submitData.append("images[]", file);
      });

      const response = await issuesService.updateOfficerIssue(
        parseInt(issueId),
        submitData,
      );

      if (response.success) {
        toast.success("Issue updated successfully!");
        router.push(`/officer-dashboard/issues/${issueId}`);
      } else {
        toast.error(response.message || "Failed to update issue");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating the issue");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-500 font-medium">Loading issue details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Constituent & Location Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">
              Constituent Details
            </h3>
            
            <div className="space-y-4">
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

              <FormItem label="Home Address">
                <Input
                  className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                  value={formData.reporter_address || ""}
                  onChange={(e) => updateField("reporter_address", e.target.value)}
                />
              </FormItem>
            </div>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">
              Location Details
            </h3>

            <div className="space-y-4">
              <FormItem label="Main Community" required>
                <SearchableSelect
                  value={formData.location}
                  onChange={(v) => {
                    const loc = locations.find((l) => l.name === v);
                    setFormData((prev) => ({
                      ...prev,
                      location: v,
                      community_id: loc?.id,
                      suburb: "",
                      suburb_id: undefined,
                    }));
                  }}
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

              <FormItem label="Suburb">
                <SearchableSelect
                  value={formData.suburb || ""}
                  onChange={(v) => {
                    const loc = suburbs.find((l) => l.name === v);
                    setFormData((prev) => ({
                      ...prev,
                      suburb: v,
                      suburb_id: loc?.id,
                    }));
                  }}
                  options={suburbs.map((loc) => ({
                    label: loc.name,
                    value: loc.name,
                  }))}
                  placeholder={
                    !formData.location
                      ? "Select Main Community first"
                      : "Select Suburb (Optional)"
                  }
                  searchPlaceholder="Search suburbs..."
                  disabled={!formData.location || loadingSubLocations}
                  loading={loadingSubLocations}
                  emptyMessage="No suburb found."
                />
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
          </div>
        </div>

        {/* Right Column: Issue Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">
              Issue Details
            </h3>

            <div className="space-y-4">
              <FormItem label="Issue Title" required>
                <Input
                  placeholder="Enter a clear and concise title"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                />
              </FormItem>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem label="Impact Type" required>
                  <Select
                    value={formData.issue_type || "community_based"}
                    onValueChange={(v: "community_based" | "individual_based") => {
                      updateField("issue_type", v);
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
                        Community-Based
                      </SelectItem>
                      <SelectItem value="individual_based">
                        Individual
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>

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
                      className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </FormItem>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem label="Category" required>
                  <Select
                    value={formData.category_id?.toString() || ""}
                    onValueChange={(v) => {
                      const categoryId = parseInt(v);
                      const selectedCat = categories.find(
                        (c) => c.id === categoryId,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        category_id: categoryId,
                        category: selectedCat?.name || "",
                        sector_id: undefined,
                        sector: "",
                        sub_sector_id: undefined,
                        subsector: "",
                      }));
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
                    onValueChange={(v: "low" | "medium" | "high" | "urgent") =>
                      updateField("priority", v)
                    }
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      setFormData((prev) => ({
                        ...prev,
                        sector_id: sectorId,
                        sector: selectedSec?.name || "",
                        sub_sector_id: undefined,
                        subsector: "",
                      }));
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
                          No sectors found
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

              <FormItem label="Assign To Agent (Optional)">
                <SearchableSelect
                  value={formData.agent_id?.toString() || ""}
                  onChange={(v) => {
                    const id = v ? parseInt(v) : undefined;
                    updateField("agent_id", id);
                  }}
                  options={agents.map((a) => ({
                    label: `${a.name} (${a.email})`,
                    value: a.id.toString(),
                  }))}
                  placeholder="Select Agent to handle this issue"
                  searchPlaceholder="Search agents..."
                  emptyMessage="No agent found."
                />
              </FormItem>

              <FormItem label="Description" required>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => updateField("description", value)}
                  placeholder="Describe the issue in detail..."
                  height={160}
                />
              </FormItem>

              <FormItem label="Additional Notes">
                <Textarea
                  className="border-slate-200 focus:border-slate-500 focus:ring-slate-500 min-h-[80px]"
                  value={formData.additional_notes || ""}
                  onChange={(e) => updateField("additional_notes", e.target.value)}
                  placeholder="Any other details that might be helpful..."
                />
              </FormItem>

              <FormItem label="Issue Images">
                <div className="mt-2 flex flex-wrap gap-4">
                  {/* Existing Images */}
                  {formData.images?.map((img, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm"
                    >
                      <Image
                        src={img}
                        alt="Existing"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {/* New Previews */}
                  {newImagePreviews.map((preview, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-indigo-200 shadow-sm ring-2 ring-indigo-100"
                    >
                      <Image
                        src={preview}
                        alt="New Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-indigo-500/80 text-[8px] text-white py-0.5 text-center font-bold">
                        NEW
                      </div>
                    </div>
                  ))}

                  <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-slate-400 hover:text-indigo-500">
                    <ImageIcon className="h-5 w-5 mb-1" />
                    <span className="text-[9px] font-medium">Add Image</span>
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
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-100">
        <p className="text-xs text-red-500">* Required fields</p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/officer-dashboard/issues/${issueId}`)}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
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
      <label className="text-sm font-medium text-slate-700">
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
