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
  MapPin,
  Edit,
  Trash2,
  Loader2,
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

interface SmallerCommunity {
  id: number;
  name: string;
  parent_id: number | null;
  parent_name: string | null; // This will come from the API as the suburb name
  created_at: string;
}

interface Suburb {
  id: number;
  name: string;
}

export default function SmallerCommunitiesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter State
  const [selectedSuburbFilter, setSelectedSuburbFilter] = useState("all");

  // Add/Edit State
  const [newCommunityName, setNewCommunityName] = useState("");
  const [selectedSuburb, setSelectedSuburb] = useState("");

  // Edit specific state
  const [editingCommunity, setEditingCommunity] =
    useState<SmallerCommunity | null>(null);
  const [editCommunityName, setEditCommunityName] = useState("");
  const [editSuburbId, setEditSuburbId] = useState("");

  // API State
  const [smallerCommunities, setSmallerCommunities] = useState<
    SmallerCommunity[]
  >([]);
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch suburbs for dropdown
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

  // Fetch smaller communities from API
  const fetchSmallerCommunities = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        type: "smaller_community",
        limit: 100,
        sort_by: "name",
        sort_order: "asc",
      };

      // Filter by parent suburb if selected
      if (selectedSuburbFilter && selectedSuburbFilter !== "all") {
        params.parent_id = selectedSuburbFilter;
      }

      const response = await locationsService.getLocations(params);

      if (response.success && response.data?.locations) {
        const mappedCommunities: SmallerCommunity[] =
          response.data.locations.map((loc: Location) => ({
            id: loc.id,
            name: loc.name,
            parent_id: loc.parent_id,
            parent_name: loc.parent_name,
            created_at: loc.created_at,
          }));
        setSmallerCommunities(mappedCommunities);
      }
    } catch (error) {
      console.error("Failed to fetch smaller communities:", error);
      toast.error("Failed to load smaller communities");
    } finally {
      setLoading(false);
    }
  }, [selectedSuburbFilter]);

  useEffect(() => {
    fetchSuburbs();
  }, [fetchSuburbs]);

  useEffect(() => {
    fetchSmallerCommunities();
  }, [fetchSmallerCommunities]);

  // Filter communities based on search query
  const filteredCommunities = smallerCommunities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.parent_name &&
        c.parent_name.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Client-side pagination
  const totalPages = Math.ceil(filteredCommunities.length / pageSize);
  const paginatedCommunities = filteredCommunities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle adding a new smaller community
  const handleAddCommunity = async () => {
    if (!newCommunityName.trim()) {
      toast.error("Community name is required");
      return;
    }
    if (!selectedSuburb) {
      toast.error("Please select a suburb");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await locationsService.createLocation({
        name: newCommunityName.trim(),
        type: "smaller_community",
        parent_id: parseInt(selectedSuburb),
      });

      if (response.success) {
        toast.success("Smaller community added successfully");
        setIsAddModalOpen(false);
        setNewCommunityName("");
        setSelectedSuburb("");
        fetchSmallerCommunities();
      } else {
        toast.error(response.message || "Failed to add smaller community");
      }
    } catch (error) {
      console.error("Failed to add smaller community:", error);
      toast.error("Failed to add smaller community");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit click
  const handleEditClick = (community: SmallerCommunity) => {
    setEditingCommunity(community);
    setEditCommunityName(community.name);
    setEditSuburbId(community.parent_id?.toString() || "");
    setIsEditModalOpen(true);
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    if (!editingCommunity) return;

    if (!editCommunityName.trim()) {
      toast.error("Community name is required");
      return;
    }
    if (!editSuburbId) {
      toast.error("Please select a suburb");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await locationsService.updateLocation(
        editingCommunity.id,
        {
          name: editCommunityName.trim(),
          parent_id: parseInt(editSuburbId),
        },
      );

      if (response.success) {
        toast.success("Smaller community updated successfully");
        setIsEditModalOpen(false);
        setEditingCommunity(null);
        setEditCommunityName("");
        setEditSuburbId("");
        fetchSmallerCommunities();
      } else {
        toast.error(response.message || "Failed to update smaller community");
      }
    } catch (error) {
      console.error("Failed to update smaller community:", error);
      toast.error("Failed to update smaller community");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (community: SmallerCommunity) => {
    setEditingCommunity(community);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!editingCommunity) return;

    setIsSubmitting(true);
    try {
      const response = await locationsService.deleteLocation(
        editingCommunity.id,
      );

      if (response.success) {
        toast.success("Smaller community deleted successfully");
        setIsDeleteDialogOpen(false);
        setEditingCommunity(null);
        fetchSmallerCommunities();
      } else {
        toast.error(response.message || "Failed to delete smaller community");
      }
    } catch (error) {
      console.error("Failed to delete smaller community:", error);
      toast.error("Failed to delete smaller community");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Smaller Communities"
        description="Manage smaller communities within suburbs"
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
            label: "Add Smaller Community",
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
              <h2 className="text-lg font-semibold text-gray-900">
                Smaller Communities
              </h2>
              <p className="text-sm text-gray-500">
                {loading
                  ? "Loading..."
                  : `Showing ${filteredCommunities.length} smaller communities`}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
                <div className="relative w-full sm:w-64">
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
                  <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
                    <SelectValue placeholder="All Suburbs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suburbs</SelectItem>
                    {suburbs.map((suburb) => (
                      <SelectItem key={suburb.id} value={suburb.id.toString()}>
                        {suburb.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Smaller Community
              </Button>
            </div>
          </div>

          {/* Loading / Empty State / List */}
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-4 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
              <p className="text-gray-500">Loading smaller communities...</p>
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No smaller communities found
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                There are no smaller communities in the system yet.
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Smaller Community
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
                    <TableHead className="text-right font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCommunities.map((community) => (
                    <TableRow
                      key={community.id}
                      className="hover:bg-gray-50/50 border-gray-100 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                            <MapPin className="w-4 h-4" />
                          </div>
                          {community.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {community.parent_name || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                            onClick={() => handleEditClick(community)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteClick(community)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  <span className="font-medium text-gray-900">{Math.min(currentPage * pageSize, filteredCommunities.length)}</span>
                  {" "}of{" "}
                  <span className="font-medium text-gray-900">{filteredCommunities.length}</span>{" "}
                  communities
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

      {/* Add Smaller Community Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Smaller Community</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Suburb</Label>
              <Select
                value={selectedSuburb}
                onValueChange={setSelectedSuburb}
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
              <Label htmlFor="name">Community Name</Label>
              <Input
                id="name"
                placeholder="Enter community name"
                value={newCommunityName}
                onChange={(e) => setNewCommunityName(e.target.value)}
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
              onClick={handleAddCommunity}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Community"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Smaller Community Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Smaller Community</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Suburb</Label>
              <Select
                value={editSuburbId}
                onValueChange={setEditSuburbId}
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
              <Label htmlFor="edit-name">Community Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter community name"
                value={editCommunityName}
                onChange={(e) => setEditCommunityName(e.target.value)}
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
            <AlertDialogTitle>Delete Smaller Community</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{editingCommunity?.name}
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
