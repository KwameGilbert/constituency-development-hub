"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { 
    UserCircle, 
    ShieldAlert, 
    Settings2, 
    LogOut,
    Search,
    Plus,
    Building,
    Edit,
    Trash2,
    ArrowLeft,
    Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { toast } from "sonner";
import { locationsService, Location } from "@/lib/services/locations-service";

interface Community {
    id: number;
    name: string;
    children_count: number;
    created_at: string;
}

export default function CommunitiesPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [newCommunityName, setNewCommunityName] = useState("");
    
    // API State
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Edit State
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
    const [editCommunityName, setEditCommunityName] = useState("");

    // Fetch communities from API
    const fetchCommunities = useCallback(async () => {
        try {
            setLoading(true);
            const response = await locationsService.getLocations({
                type: 'community',
                limit: 100,
                sort_by: 'name',
                sort_order: 'asc'
            });
            
            if (response.success && response.data?.locations) {
                const mappedCommunities: Community[] = response.data.locations.map((loc: Location) => ({
                    id: loc.id,
                    name: loc.name,
                    children_count: loc.children_count,
                    created_at: loc.created_at
                }));
                setCommunities(mappedCommunities);
            }
        } catch (error) {
            console.error("Failed to fetch communities:", error);
            toast.error("Failed to load communities");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCommunities();
    }, [fetchCommunities]);

    // Filter communities based on search query
    const filteredCommunities = communities.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Format date for display
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
        } catch {
            return dateString;
        }
    };

    // Handle adding a new community
    const handleAddCommunity = async () => {
        if (!newCommunityName.trim()) {
            toast.error("Community name is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await locationsService.createLocation({
                name: newCommunityName.trim(),
                type: 'community',
            });

            if (response.success) {
                toast.success("Community added successfully");
                setIsAddModalOpen(false);
                setNewCommunityName("");
                fetchCommunities();
            } else {
                toast.error(response.message || "Failed to add community");
            }
        } catch (error) {
            console.error("Failed to add community:", error);
            toast.error("Failed to add community");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle edit click
    const handleEditClick = (community: Community) => {
        setSelectedCommunity(community);
        setEditCommunityName(community.name);
        setIsEditModalOpen(true);
    };

    // Handle saving changes
    const handleSaveChanges = async () => {
        if (!selectedCommunity) return;
        
        if (!editCommunityName.trim()) {
            toast.error("Community name is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await locationsService.updateLocation(selectedCommunity.id, {
                name: editCommunityName.trim(),
            });

            if (response.success) {
                toast.success("Community updated successfully");
                setIsEditModalOpen(false);
                setSelectedCommunity(null);
                setEditCommunityName("");
                fetchCommunities();
            } else {
                toast.error(response.message || "Failed to update community");
            }
        } catch (error) {
            console.error("Failed to update community:", error);
            toast.error("Failed to update community");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete click
    const handleDeleteClick = (community: Community) => {
        setSelectedCommunity(community);
        setIsDeleteDialogOpen(true);
    };

    // Handle delete confirmation
    const handleConfirmDelete = async () => {
        if (!selectedCommunity) return;

        setIsSubmitting(true);
        try {
            const response = await locationsService.deleteLocation(selectedCommunity.id);

            if (response.success) {
                toast.success("Community deleted successfully");
                setIsDeleteDialogOpen(false);
                setSelectedCommunity(null);
                fetchCommunities();
            } else {
                toast.error(response.message || "Failed to delete community");
            }
        } catch (error) {
            console.error("Failed to delete community:", error);
            toast.error("Failed to delete community. It may have associated suburbs or issues.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <AdminHeader 
                title="Communities" 
                description="Manage main communities in the constituency"
                roleAbbr="MP"
                userName="Admin.Rock"
                userRoleLabel="MP"
                dropdownItems={[
                    { label: "Back to Locations", href: "/admin-dashboard/locations", icon: ArrowLeft },
                    { label: "Profile Settings", href: "/admin-dashboard/profile", icon: UserCircle },
                    { label: "Audit Logs", href: "/admin-dashboard/audit", icon: ShieldAlert },
                    { label: "System Settings", href: "/admin-dashboard/system-settings", icon: Settings2 },
                    { label: "Logout", icon: LogOut, className: "text-red-600 focus:text-red-600 focus:bg-red-50" },
                ]}
                actionButtons={[
                    { 
                        label: "Add Community", 
                        icon: Plus, 
                        onClick: () => setIsAddModalOpen(true),
                        className: "bg-indigo-600 hover:bg-indigo-700 text-white" 
                    }
                ]}
            />

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    {/* Content Header */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-gray-900">Communities</h2>
                            <p className="text-sm text-gray-500">
                                {loading ? "Loading..." : `Showing ${filteredCommunities.length} communities`}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input 
                                    placeholder="Search communities by name..." 
                                    className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Community
                            </Button>
                        </div>

                        {/* Table */}
                        <div className="rounded-lg border border-gray-100 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="hover:bg-transparent border-gray-100">
                                        <TableHead className="w-[40%] font-medium text-gray-500 text-xs uppercase tracking-wider">Name</TableHead>
                                        <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">Suburbs</TableHead>
                                        <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">Created</TableHead>
                                        <TableHead className="text-right font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                                                    <span className="text-gray-500">Loading communities...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredCommunities.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                                                No communities found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCommunities.map((community) => (
                                            <TableRow key={community.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                                                <TableCell className="font-medium text-gray-900">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                            <Building className="w-4 h-4" />
                                                        </div>
                                                        {community.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {community.children_count > 0 ? (
                                                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                                                            {community.children_count} suburbs
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No suburbs</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-gray-500 text-sm">
                                                    {formatDate(community.created_at)}
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
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Community Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Community</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
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

            {/* Edit Community Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Community</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
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
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Community</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{selectedCommunity?.name}&quot;? 
                            This action cannot be undone. Communities with associated suburbs or issues cannot be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
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
