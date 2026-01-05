"use client";

import React, { useState } from "react";
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
    Trash2
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
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SuburbsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Filter State
    const [selectedCommunityFilter, setSelectedCommunityFilter] = useState("all");

    // Add/Edit State
    const [newSuburbName, setNewSuburbName] = useState("");
    const [selectedCommunity, setSelectedCommunity] = useState("");
    
    // Edit specific state
    const [editingSuburb, setEditingSuburb] = useState<any>(null);
    const [editSuburbName, setEditSuburbName] = useState("");
    const [editCommunityId, setEditCommunityId] = useState("");
    
    // Mock Data - Empty array to show empty state as per default, or we can add entries to test list view
    // const suburbs = []; 
    // To demonstrate list view capabilities vs empty state, I'll default to empty as requested by "Nodak" empty state requirement,
    // but the code handles both.
    // Let's stick to empty for now to match the "No suburbs found" screenshot requirement,
    // but I'll write the list rendering logic so it works when data is present.
    const suburbs: any[] = []; 

    const handleAddSuburb = () => {
        console.log("Adding suburb:", newSuburbName, "in community:", selectedCommunity);
        setIsAddModalOpen(false);
        setNewSuburbName("");
        setSelectedCommunity("");
    };

    const handleEditClick = (suburb: any) => {
        setEditingSuburb(suburb);
        setEditSuburbName(suburb.name);
        setEditCommunityId(suburb.communityId);
        setIsEditModalOpen(true);
    };

    const handleSaveChanges = () => {
        console.log("Updating suburb", editingSuburb?.id, "to", editSuburbName, editCommunityId);
        setIsEditModalOpen(false);
        setEditingSuburb(null);
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
                    { label: "Back to Locations", href: "/admin-dashboard/locations", icon: ArrowLeft },
                    { label: "Profile Settings", href: "/admin-dashboard/profile", icon: UserCircle },
                    { label: "Audit Logs", href: "/admin-dashboard/audit", icon: ShieldAlert },
                    { label: "System Settings", href: "/admin-dashboard/system-settings", icon: Settings2 },
                    { label: "Logout", icon: LogOut, className: "text-red-600 focus:text-red-600 focus:bg-red-50" },
                ]}
                actionButtons={[
                    { 
                        label: "Add Suburb", 
                        icon: Plus, 
                        onClick: () => setIsAddModalOpen(true),
                        className: "bg-indigo-600 hover:bg-indigo-700 text-white" 
                    }
                ]}
            />

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    {/* Content Header & Filters */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-gray-900">Suburbs</h2>
                            <p className="text-sm text-gray-500">Showing {suburbs.length} suburbs</p>
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
                                <Select value={selectedCommunityFilter} onValueChange={setSelectedCommunityFilter}>
                                    <SelectTrigger className="w-full sm:w-56 bg-white border-gray-200">
                                        <SelectValue placeholder="Filter by Community" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Communities</SelectItem>
                                        <SelectItem value="c1">Sefwi Asawinso</SelectItem>
                                        <SelectItem value="c2">Sefwi Boako</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Apply Filters
                                </Button>
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

                    {/* Empty State / List */}
                    {suburbs.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">No suburbs found</h3>
                            <p className="text-gray-500 mb-6 max-w-sm">There are no suburbs in the system yet.</p>
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
                                        <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">Name</TableHead>
                                        <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">Community</TableHead>
                                        <TableHead className="text-right font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {suburbs.map((suburb) => (
                                        <TableRow key={suburb.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                                            <TableCell className="font-medium text-gray-900">{suburb.name}</TableCell>
                                            <TableCell className="text-gray-500">{suburb.communityName}</TableCell>
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
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50">
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
                            <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Community" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="c1">Sefwi Asawinso</SelectItem>
                                    <SelectItem value="c2">Sefwi Boako</SelectItem>
                                    <SelectItem value="c3">Sefwi Dwenase</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Suburb Name</Label>
                            <Input 
                                id="name" 
                                placeholder="" 
                                value={newSuburbName}
                                onChange={(e) => setNewSuburbName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={handleAddSuburb}
                        >
                            Add Suburb
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
                            <Select value={editCommunityId} onValueChange={setEditCommunityId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Community" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="c1">Sefwi Asawinso</SelectItem>
                                    <SelectItem value="c2">Sefwi Boako</SelectItem>
                                    <SelectItem value="c3">Sefwi Dwenase</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Suburb Name</Label>
                            <Input 
                                id="edit-name" 
                                placeholder="" 
                                value={editSuburbName}
                                onChange={(e) => setEditSuburbName(e.target.value)}
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
