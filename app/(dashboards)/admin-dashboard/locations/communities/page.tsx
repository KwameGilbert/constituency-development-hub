"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { 
    Home, 
    MapPin, 
    UserCircle, 
    ShieldAlert, 
    Settings2, 
    LogOut,
    Search,
    Plus,
    Building,
    Edit,
    Trash2,
    ArrowLeft
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
import { Label } from "@/components/ui/label";

export default function CommunitiesPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [newCommunityName, setNewCommunityName] = useState("");
    
    // Edit State
    const [selectedCommunity, setSelectedCommunity] = useState<{id: number, name: string} | null>(null);
    const [editCommunityName, setEditCommunityName] = useState("");

    // Mock Data
    const communities = [
        { id: 1, name: "Sefwi Asawinso", suburbs: 1, created: "Sep 28, 2025" },
        { id: 2, name: "Sefwi Boako", suburbs: 0, created: "Sep 28, 2025" },
        { id: 3, name: "Sefwi Dwenase", suburbs: 0, created: "Sep 28, 2025" },
        { id: 4, name: "Sefwi Wiawso", suburbs: 0, created: "Sep 28, 2025" },
    ];

    const filteredCommunities = communities.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddCommunity = () => {
        // Handle add logic here
        console.log("Adding community:", newCommunityName);
        setIsAddModalOpen(false);
        setNewCommunityName("");
    };

    const handleEditClick = (community: typeof communities[0]) => {
        setSelectedCommunity(community);
        setEditCommunityName(community.name);
        setIsEditModalOpen(true);
    };

    const handleSaveChanges = () => {
        // Handle save logic here
        console.log("Updating community:", selectedCommunity?.id, "to", editCommunityName);
        setIsEditModalOpen(false);
        setSelectedCommunity(null);
        setEditCommunityName("");
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
                            <p className="text-sm text-gray-500">Showing {filteredCommunities.length} communities</p>
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
                                    {filteredCommunities.map((community) => (
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
                                                {community.suburbs > 0 ? (
                                                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                                                        {community.suburbs} suburbs
                                                    </Badge>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No suburbs</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-sm">{community.created}</TableCell>
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
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredCommunities.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                                                No communities found
                                            </TableCell>
                                        </TableRow>
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
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={handleAddCommunity}
                        >
                            Add Community
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
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={handleSaveChanges}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
