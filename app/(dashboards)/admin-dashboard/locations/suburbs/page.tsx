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

interface Suburb {
  id: number;
  name: string;
  parent_id: number | null;
  parent_name: string | null;
  created_at: string;
}

interface Community {
  id: number;
  name: string;
}

export default function SuburbsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter State
  const [selectedCommunityFilter, setSelectedCommunityFilter] = useState("all");

  // Add/Edit State
  const [newSuburbName, setNewSuburbName] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");

  // Edit specific state
  const [editingSuburb, setEditingSuburb] = useState<Suburb | null>(null);
  const [editSuburbName, setEditSuburbName] = useState("");
  const [editCommunityId, setEditCommunityId] = useState("");

  // API State
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch communities for dropdown
  const fetchCommunities = useCallback(async () => {
    try {
      const response = await locationsService.getLocations({
        type: "community",
        limit: 100,
        sort_by: "name",
        sort_order: "asc",
      });

      if (response.success && response.data?.locations) {
        const mappedCommunities: Community[] = response.data.locations.map(
          (loc: Location) => ({
            id: loc.id,
            name: loc.name,
          }),
        );
        setCommunities(mappedCommunities);
      }
    } catch (error) {
      console.error("Failed to fetch communities:", error);
    }
  }, []);

  // Fetch suburbs from API
  const fetchSuburbs = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        type: "suburb",
        limit: 100,
        sort_by: "name",
        sort_order: "asc",
      };

      // Filter by parent community if selected
      if (selectedCommunityFilter && selectedCommunityFilter !== "all") {
        params.parent_id = selectedCommunityFilter;
      }

      const response = await locationsService.getLocations(params);

      if (response.success && response.data?.locations) {
        const mappedSuburbs: Suburb[] = response.data.locations.map(
          (loc: Location) => ({
            id: loc.id,
            name: loc.name,
            parent_id: loc.parent_id,
            parent_name: loc.parent_name,
            created_at: loc.created_at,
          }),
        );
        setSuburbs(mappedSuburbs);
      }
    } catch (error) {
      console.error("Failed to fetch suburbs:", error);
      toast.error("Failed to load suburbs");
    } finally {
      setLoading(false);
    }
  }, [selectedCommunityFilter]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  useEffect(() => {
    fetchSuburbs();
  }, [fetchSuburbs]);

  // Filter suburbs based on search query
  const filteredSuburbs = suburbs.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.parent_name &&
        s.parent_name.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Handle adding a new suburb
  const handleAddSuburb = async () => {
    if (!newSuburbName.trim()) {
      toast.error("Suburb name is required");
      return;
    }
    if (!selectedCommunity) {
      toast.error("Please select a community");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await locationsService.createLocation({
        name: newSuburbName.trim(),
        type: "suburb",
        parent_id: parseInt(selectedCommunity),
      });

      if (response.success) {
        toast.success("Suburb added successfully");
        setIsAddModalOpen(false);
        setNewSuburbName("");
        setSelectedCommunity("");
        fetchSuburbs();
      } else {
        toast.error(response.message || "Failed to add suburb");
      }
    } catch (error) {
      console.error("Failed to add suburb:", error);
      toast.error("Failed to add suburb");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit click
  const handleEditClick = (suburb: Suburb) => {
    setEditingSuburb(suburb);
    setEditSuburbName(suburb.name);
    setEditCommunityId(suburb.parent_id?.toString() || "");
    setIsEditModalOpen(true);
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    if (!editingSuburb) return;

    if (!editSuburbName.trim()) {
      toast.error("Suburb name is required");
      return;
    }
    if (!editCommunityId) {
      toast.error("Please select a community");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await locationsService.updateLocation(editingSuburb.id, {
        name: editSuburbName.trim(),
        parent_id: parseInt(editCommunityId),
      });

      if (response.success) {
        toast.success("Suburb updated successfully");
        setIsEditModalOpen(false);
        setEditingSuburb(null);
        setEditSuburbName("");
        setEditCommunityId("");
        fetchSuburbs();
      } else {
        toast.error(response.message || "Failed to update suburb");
      }
    } catch (error) {
      console.error("Failed to update suburb:", error);
      toast.error("Failed to update suburb");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (suburb: Suburb) => {
    setEditingSuburb(suburb);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!editingSuburb) return;

    setIsSubmitting(true);
    try {
      const response = await locationsService.deleteLocation(editingSuburb.id);

      if (response.success) {
        toast.success("Suburb deleted successfully");
        setIsDeleteDialogOpen(false);
        setEditingSuburb(null);
        fetchSuburbs();
      } else {
        toast.error(response.message || "Failed to delete suburb");
      }
    } catch (error) {
      console.error("Failed to delete suburb:", error);
      toast.error("Failed to delete suburb");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Suburbs"
        description="Manage suburbs within communities"
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
            label: "Add Suburb",
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
              <h2 className="text-lg font-semibold text-gray-900">Suburbs</h2>
              <p className="text-sm text-gray-500">
                {loading
                  ? "Loading..."
                  : `Showing ${filteredSuburbs.length} suburbs`}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search suburbs by name..."
                    className="pl-10 w-full bg-white border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedCommunityFilter}
                  onValueChange={setSelectedCommunityFilter}
                >
                  <SelectTrigger className="w-full sm:w-56 bg-white border-gray-200">
                    <SelectValue placeholder="Filter by Community" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Communities</SelectItem>
                    {communities.map((community) => (
                      <SelectItem
                        key={community.id}
                        value={community.id.toString()}
                      >
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full lg:w-auto bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Suburb
              </Button>
            </div>
          </div>

          {/* Loading / Empty State / List */}
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-4 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
              <p className="text-gray-500">Loading suburbs...</p>
            </div>
          ) : filteredSuburbs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No suburbs found
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                There are no suburbs in the system yet.
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Suburb
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Name
                    </TableHead>
                    <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Community
                    </TableHead>
                    <TableHead className="text-right font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuburbs.map((suburb) => (
                    <TableRow
                      key={suburb.id}
                      className="hover:bg-gray-50/50 border-gray-100 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                            <MapPin className="w-4 h-4" />
                          </div>
                          {suburb.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {suburb.parent_name || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                            onClick={() => handleEditClick(suburb)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteClick(suburb)}
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
          )}
        </div>
      </div>

      {/* Add Suburb Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Suburb</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Community</Label>
              <Select
                value={selectedCommunity}
                onValueChange={setSelectedCommunity}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Community" />
                </SelectTrigger>
                <SelectContent>
                  {communities.map((community) => (
                    <SelectItem
                      key={community.id}
                      value={community.id.toString()}
                    >
                      {community.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Suburb Name</Label>
              <Input
                id="name"
                placeholder="Enter suburb name"
                value={newSuburbName}
                onChange={(e) => setNewSuburbName(e.target.value)}
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
              onClick={handleAddSuburb}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Suburb"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Suburb Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Suburb</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Community</Label>
              <Select
                value={editCommunityId}
                onValueChange={setEditCommunityId}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Community" />
                </SelectTrigger>
                <SelectContent>
                  {communities.map((community) => (
                    <SelectItem
                      key={community.id}
                      value={community.id.toString()}
                    >
                      {community.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Suburb Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter suburb name"
                value={editSuburbName}
                onChange={(e) => setEditSuburbName(e.target.value)}
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
            <AlertDialogTitle>Delete Suburb</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{editingSuburb?.name}&quot;?
              This action cannot be undone.
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
