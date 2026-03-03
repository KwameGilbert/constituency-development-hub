"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import {
  ArrowLeft,
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
  Search,
  Plus,
  Home,
  Edit,
  Trash2,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { locationsService, Location } from "@/lib/services/locations-service";

interface Cottage {
  id: number;
  name: string;
  parent_id: number | null;
  parent_name: string | null;
  created_at: string;
}

interface Suburb {
  id: number;
  name: string;
}

interface SmallerCommunity {
  id: number;
  name: string;
  parent_id: number | null; // This points to the suburb
}

export default function CottagesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter State
  const [selectedSuburbFilter, setSelectedSuburbFilter] = useState("all");
  const [selectedSmallerCommunityFilter, setSelectedSmallerCommunityFilter] =
    useState("all");

  // Add/Edit State
  const [newCottageName, setNewCottageName] = useState("");
  const [selectedSuburb, setSelectedSuburb] = useState("");
  const [selectedSmallerCommunity, setSelectedSmallerCommunity] =
    useState("none");

  // Edit specific state
  const [editingCottage, setEditingCottage] = useState<Cottage | null>(null);
  const [editCottageName, setEditCottageName] = useState("");
  const [editSuburbId, setEditSuburbId] = useState("");
  const [editSmallerCommunityId, setEditSmallerCommunityId] = useState("none");

  // API State
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [smallerCommunities, setSmallerCommunities] = useState<
    SmallerCommunity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch suburbs
  const fetchSuburbs = useCallback(async () => {
    try {
      const response = await locationsService.getLocations({
        type: "suburb",
        limit: 100,
        sort_by: "name",
        sort_order: "asc",
      });

      if (response.success && response.data?.locations) {
        const mappedSuburbs: Suburb[] = response.data.locations.map(
          (loc: Location) => ({
            id: loc.id,
            name: loc.name,
          }),
        );
        setSuburbs(mappedSuburbs);
      }
    } catch (error) {
      console.error("Failed to fetch suburbs:", error);
    }
  }, []);

  // Fetch smaller communities
  const fetchSmallerCommunities = useCallback(async () => {
    try {
      const response = await locationsService.getLocations({
        type: "smaller_community",
        limit: 100,
        sort_by: "name",
        sort_order: "asc",
      });

      if (response.success && response.data?.locations) {
        const mappedCommunities: SmallerCommunity[] =
          response.data.locations.map((loc: Location) => ({
            id: loc.id,
            name: loc.name,
            parent_id: loc.parent_id,
          }));
        setSmallerCommunities(mappedCommunities);
      }
    } catch (error) {
      console.error("Failed to fetch smaller communities:", error);
    }
  }, []);

  // Fetch cottages
  const fetchCottages = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        type: "cottage",
        limit: 100,
        sort_by: "name",
        sort_order: "asc",
      };

      // Handle filters
      // Note: API only supports direct parent_id filtering usually.
      // If user filters by Suburb, we need to find all cottages that have this suburb as parent OR have a smaller community parent that belongs to this suburb.
      // Complex filtering is better done client-side if API doesn't support recursive/deep filtering.
      // For now, I'll fetch all and filter in memory since we are paginating locally effectively (limit 100).

      const response = await locationsService.getLocations(params);

      if (response.success && response.data?.locations) {
        const mappedCottages: Cottage[] = response.data.locations.map(
          (loc: Location) => ({
            id: loc.id,
            name: loc.name,
            parent_id: loc.parent_id,
            parent_name: loc.parent_name,
            created_at: loc.created_at,
          }),
        );
        setCottages(mappedCottages);
      }
    } catch (error) {
      console.error("Failed to fetch cottages:", error);
      toast.error("Failed to load cottages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuburbs();
    fetchSmallerCommunities();
    fetchCottages();
  }, [fetchSuburbs, fetchSmallerCommunities, fetchCottages]);

  // Helper to resolve hierarchy
  const getCottageContext = (cottage: Cottage) => {
    let suburbName = "-";
    let smallerCommunityName = "-";

    if (cottage.parent_id) {
      // Check if parent is a smaller community
      const parentSmallerComm = smallerCommunities.find(
        (sc) => sc.id === cottage.parent_id,
      );
      if (parentSmallerComm) {
        smallerCommunityName = parentSmallerComm.name;
        // Find suburb of this smaller community
        const parentSuburb = suburbs.find(
          (s) => s.id === parentSmallerComm.parent_id,
        );
        if (parentSuburb) {
          suburbName = parentSuburb.name;
        }
      } else {
        // Parent might be a Suburb directly (if that's allowed logic)
        const parentSuburb = suburbs.find((s) => s.id === cottage.parent_id);
        if (parentSuburb) {
          suburbName = parentSuburb.name;
        }
      }
    }
    return { suburbName, smallerCommunityName };
  };

  // Filter cottages
  const filteredCottages = cottages.filter((cottage) => {
    const { suburbName, smallerCommunityName } = getCottageContext(cottage);

    // Search query
    const matchesSearch =
      cottage.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suburbName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      smallerCommunityName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Suburb Filter
    if (selectedSuburbFilter !== "all") {
      // We need to resolve the ID of the suburbName to match filter
      // Or simpler: check if the resolved suburb matches the selected ID?
      // Not easy without IDs.
      // Let's use the IDs logic:
      let cottageSuburbId: number | null = null;

      // Check if direct parent is suburb
      if (
        cottage.parent_id &&
        suburbs.some(
          (s) =>
            s.id === cottage.parent_id &&
            s.id.toString() === selectedSuburbFilter,
        )
      ) {
        cottageSuburbId = cottage.parent_id;
      }

      // Check if parent is smaller community, and THAT smaller community's parent is the suburb
      if (!cottageSuburbId && cottage.parent_id) {
        const sc = smallerCommunities.find((s) => s.id === cottage.parent_id);
        if (
          sc &&
          sc.parent_id &&
          sc.parent_id.toString() === selectedSuburbFilter
        ) {
          cottageSuburbId = sc.parent_id;
        }
      }

      if (!cottageSuburbId) return false;
    }

    // Smaller Community Filter
    if (selectedSmallerCommunityFilter !== "all") {
      // Must have this direct parent
      if (cottage.parent_id?.toString() !== selectedSmallerCommunityFilter)
        return false;
    }

    return true;
  });

  // Client-side pagination
  const totalPages = Math.ceil(filteredCottages.length / pageSize);
  const paginatedCottages = filteredCottages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSuburbFilter, selectedSmallerCommunityFilter]);

  // Filtered lists for dropdowns based on selections
  const getFilteredSmallerCommunities = (suburbId: string) => {
    if (!suburbId) return [];
    return smallerCommunities.filter(
      (sc) => sc.parent_id?.toString() === suburbId,
    );
  };

  // Handle adding
  const handleAddCottage = async () => {
    if (!newCottageName.trim()) {
      toast.error("Cottage name is required");
      return;
    }
    if (!selectedSuburb) {
      toast.error("Please select a suburb");
      return;
    }

    // Determine parent_id
    // If smaller community is selected, that is the parent.
    // If not, the suburb is the parent.
    const parentId =
      selectedSmallerCommunity && selectedSmallerCommunity !== "none"
        ? parseInt(selectedSmallerCommunity)
        : parseInt(selectedSuburb);

    setIsSubmitting(true);
    try {
      const response = await locationsService.createLocation({
        name: newCottageName.trim(),
        type: "cottage",
        parent_id: parentId,
      });

      if (response.success) {
        toast.success("Cottage added successfully");
        setIsAddModalOpen(false);
        setNewCottageName("");
        setSelectedSuburb("");
        setSelectedSmallerCommunity("none");
        fetchCottages();
      } else {
        toast.error(response.message || "Failed to add cottage");
      }
    } catch (error) {
      console.error("Failed to add cottage:", error);
      toast.error("Failed to add cottage");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit click
  const handleEditClick = (cottage: Cottage) => {
    setEditingCottage(cottage);
    setEditCottageName(cottage.name);

    // Determine current selections based on parent_id
    if (cottage.parent_id) {
      // Is parent a smaller community?
      const parentSC = smallerCommunities.find(
        (sc) => sc.id === cottage.parent_id,
      );
      if (parentSC) {
        setEditSmallerCommunityId(parentSC.id.toString());
        setEditSuburbId(parentSC.parent_id?.toString() || "");
      } else {
        // Parent must be suburb
        setEditSmallerCommunityId("none");
        setEditSuburbId(cottage.parent_id.toString());
      }
    } else {
      setEditSuburbId("");
      setEditSmallerCommunityId("none");
    }

    setIsEditModalOpen(true);
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    if (!editingCottage) return;

    if (!editCottageName.trim()) {
      toast.error("Cottage name is required");
      return;
    }
    if (!editSuburbId) {
      toast.error("Please select a suburb");
      return;
    }

    const parentId =
      editSmallerCommunityId && editSmallerCommunityId !== "none"
        ? parseInt(editSmallerCommunityId)
        : parseInt(editSuburbId);

    setIsSubmitting(true);
    try {
      const response = await locationsService.updateLocation(
        editingCottage.id,
        {
          name: editCottageName.trim(),
          parent_id: parentId,
        },
      );

      if (response.success) {
        toast.success("Cottage updated successfully");
        setIsEditModalOpen(false);
        setEditingCottage(null);
        setEditCottageName("");
        setEditSuburbId("");
        setEditSmallerCommunityId("none");
        fetchCottages();
      } else {
        toast.error(response.message || "Failed to update cottage");
      }
    } catch (error) {
      console.error("Failed to update cottage:", error);
      toast.error("Failed to update cottage");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (cottage: Cottage) => {
    setEditingCottage(cottage);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!editingCottage) return;

    setIsSubmitting(true);
    try {
      const response = await locationsService.deleteLocation(editingCottage.id);

      if (response.success) {
        toast.success("Cottage deleted successfully");
        setIsDeleteDialogOpen(false);
        setEditingCottage(null);
        fetchCottages();
      } else {
        toast.error(response.message || "Failed to delete cottage");
      }
    } catch (error) {
      console.error("Failed to delete cottage:", error);
      toast.error("Failed to delete cottage");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Cottages"
        description="Manage cottages within suburbs and smaller communities"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
          {
            label: "Back to Locations",
            href: "/admin-dashboard/locations",
            icon: ArrowLeft,
          },
          {
            label: "Profile Settings",
            href: "/admin-dashboard/profile",
            icon: UserCircle,
          },
          {
            label: "Audit Logs",
            href: "/admin-dashboard/audit",
            icon: ShieldAlert,
          },
          {
            label: "System Settings",
            href: "/admin-dashboard/system-settings",
            icon: Settings2,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-600 focus:text-red-600 focus:bg-red-50",
          },
        ]}
        actionButtons={[
          {
            label: "Add Cottage",
            icon: Plus,
            onClick: () => setIsAddModalOpen(true),
            className: "bg-indigo-600 hover:bg-indigo-700 text-white",
          },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Content Header & Filters */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">Cottages</h2>
              <p className="text-sm text-gray-500">
                {loading
                  ? "Loading..."
                  : `Showing ${filteredCottages.length} cottages`}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                <div className="flex flex-col lg:flex-row gap-4 w-full flex-1 flex-wrap">
                  <div className="relative w-full lg:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by name..."
                      className="pl-10 w-full bg-white border-gray-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select
                    value={selectedSuburbFilter}
                    onValueChange={setSelectedSuburbFilter}
                  >
                    <SelectTrigger className="w-full lg:w-48 bg-white border-gray-200">
                      <SelectValue placeholder="All Suburbs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suburbs</SelectItem>
                      {suburbs.map((suburb) => (
                        <SelectItem
                          key={suburb.id}
                          value={suburb.id.toString()}
                        >
                          {suburb.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedSmallerCommunityFilter}
                    onValueChange={setSelectedSmallerCommunityFilter}
                  >
                    <SelectTrigger className="w-full lg:w-56 bg-white border-gray-200">
                      <SelectValue placeholder="All Smaller Communities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        All Smaller Communities
                      </SelectItem>
                      {smallerCommunities.map((sc) => (
                        <SelectItem key={sc.id} value={sc.id.toString()}>
                          {sc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full lg:w-auto">
                    Apply Filters
                  </Button>
                </div>
                <div className="w-full xl:w-auto flex justify-end">
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#D97706] hover:bg-[#B45309] text-white whitespace-nowrap w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Cottage
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading / Empty State / List */}
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-4 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
              <p className="text-gray-500">Loading cottages...</p>
            </div>
          ) : filteredCottages.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No cottages found
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                There are no cottages in the system yet.
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Cottage
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Name
                    </TableHead>
                    <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Suburb
                    </TableHead>
                    <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Smaller Community
                    </TableHead>
                    <TableHead className="text-right font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCottages.map((cottage) => {
                    const { suburbName, smallerCommunityName } =
                      getCottageContext(cottage);
                    return (
                      <TableRow
                        key={cottage.id}
                        className="hover:bg-gray-50/50 border-gray-100 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                              <Home className="w-4 h-4" />
                            </div>
                            {cottage.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {suburbName}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {smallerCommunityName}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                              onClick={() => handleEditClick(cottage)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                              onClick={() => handleDeleteClick(cottage)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium text-gray-900">{(currentPage - 1) * pageSize + 1}</span>
                  {" "}to{" "}
                  <span className="font-medium text-gray-900">{Math.min(currentPage * pageSize, filteredCottages.length)}</span>
                  {" "}of{" "}
                  <span className="font-medium text-gray-900">{filteredCottages.length}</span>{" "}
                  cottages
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        </div>
      </div>

      {/* Add Cottage Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Cottage</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Suburb</Label>
              <Select
                value={selectedSuburb}
                onValueChange={(val) => {
                  setSelectedSuburb(val);
                  setSelectedSmallerCommunity("none"); // Reset child selection
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Suburb" />
                </SelectTrigger>
                <SelectContent>
                  {suburbs.map((suburb) => (
                    <SelectItem key={suburb.id} value={suburb.id.toString()}>
                      {suburb.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Smaller Community (Optional)</Label>
              <Select
                value={selectedSmallerCommunity}
                onValueChange={setSelectedSmallerCommunity}
                disabled={isSubmitting || !selectedSuburb}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {getFilteredSmallerCommunities(selectedSuburb).map((sc) => (
                    <SelectItem key={sc.id} value={sc.id.toString()}>
                      {sc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Cottage Name</Label>
              <Input
                id="name"
                placeholder="Enter cottage name"
                value={newCottageName}
                onChange={(e) => setNewCottageName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleAddCottage}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Cottage"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Cottage Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Cottage</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Suburb</Label>
              <Select
                value={editSuburbId}
                onValueChange={(val) => {
                  setEditSuburbId(val);
                  setEditSmallerCommunityId("none");
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Suburb" />
                </SelectTrigger>
                <SelectContent>
                  {suburbs.map((suburb) => (
                    <SelectItem key={suburb.id} value={suburb.id.toString()}>
                      {suburb.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Smaller Community (Optional)</Label>
              <Select
                value={editSmallerCommunityId}
                onValueChange={setEditSmallerCommunityId}
                disabled={isSubmitting || !editSuburbId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {getFilteredSmallerCommunities(editSuburbId).map((sc) => (
                    <SelectItem key={sc.id} value={sc.id.toString()}>
                      {sc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Cottage Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter cottage name"
                value={editCottageName}
                onChange={(e) => setEditCottageName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleSaveChanges}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cottage</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{editingCottage?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
