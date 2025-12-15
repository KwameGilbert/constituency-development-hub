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
    Home,
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

export default function CottagesPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Filter State
    const [selectedCommunityFilter, setSelectedCommunityFilter] = useState("all");
    const [selectedSuburbFilter, setSelectedSuburbFilter] = useState("all");
    const [selectedSmallerCommunityFilter, setSelectedSmallerCommunityFilter] = useState("all");

    // Add/Edit State
    const [newCottageName, setNewCottageName] = useState("");
    const [selectedSuburb, setSelectedSuburb] = useState("");
    const [selectedSmallerCommunity, setSelectedSmallerCommunity] = useState("none");
    
    // Edit specific state
    const [editingCottage, setEditingCottage] = useState<any>(null);
    const [editCottageName, setEditCottageName] = useState("");
    const [editSuburbId, setEditSuburbId] = useState("");
    const [editSmallerCommunityId, setEditSmallerCommunityId] = useState("none");
    
    // Mock Data - Empty
    const cottages: any[] = []; 

    const handleAddCottage = () => {
        console.log("Adding cottage:", newCottageName, "in suburb:", selectedSuburb, "smaller comm:", selectedSmallerCommunity);
        setIsAddModalOpen(false);
        setNewCottageName("");
        setSelectedSuburb("");
        setSelectedSmallerCommunity("none");
    };

    const handleEditClick = (cottage: any) => {
        setEditingCottage(cottage);
        setEditCottageName(cottage.name);
        setEditSuburbId(cottage.suburbId);
        setEditSmallerCommunityId(cottage.smallerCommunityId || "none");
        setIsEditModalOpen(true);
    };

    const handleSaveChanges = () => {
        console.log("Updating cottage", editingCottage?.id);
        setIsEditModalOpen(false);
        setEditingCottage(null);
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
                    { label: "Back to Locations", href: "/admin-dashboard/locations", icon: ArrowLeft },
                    { label: "Profile Settings", href: "/admin-dashboard/profile", icon: UserCircle },
                    { label: "Audit Logs", href: "/admin-dashboard/audit", icon: ShieldAlert },
                    { label: "System Settings", href: "/admin-dashboard/system-settings", icon: Settings2 },
                    { label: "Logout", icon: LogOut, className: "text-red-600 focus:text-red-600 focus:bg-red-50" },
                ]}
                actionButtons={[
                    { 
                        label: "Add Cottage", 
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
                            <h2 className="text-lg font-semibold text-gray-900">Cottages</h2>
                            <p className="text-sm text-gray-500">Showing {cottages.length} cottages</p>
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
                                    <Select value={selectedCommunityFilter} onValueChange={setSelectedCommunityFilter}>
                                        <SelectTrigger className="w-full lg:w-48 bg-white border-gray-200">
                                            <SelectValue placeholder="All Communities" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Communities</SelectItem>
                                            <SelectItem value="c1">Sefwi Asawinso</SelectItem>
                                            <SelectItem value="c2">Sefwi Boako</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={selectedSuburbFilter} onValueChange={setSelectedSuburbFilter}>
                                        <SelectTrigger className="w-full lg:w-48 bg-white border-gray-200">
                                            <SelectValue placeholder="All Suburbs" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Suburbs</SelectItem>
                                            <SelectItem value="s1">Suburb A</SelectItem>
                                            <SelectItem value="s2">Suburb B</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={selectedSmallerCommunityFilter} onValueChange={setSelectedSmallerCommunityFilter}>
                                        <SelectTrigger className="w-full lg:w-56 bg-white border-gray-200">
                                            <SelectValue placeholder="All Smaller Communities" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Smaller Communities</SelectItem>
                                            <SelectItem value="sc1">Small Comm 1</SelectItem>
                                            <SelectItem value="sc2">Small Comm 2</SelectItem>
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

                    {/* Empty State / List */}
                    {cottages.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Home className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">No cottages found</h3>
                            <p className="text-gray-500 mb-6 max-w-sm">There are no cottages in the system yet.</p>
                            <Button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Cottage
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="hover:bg-transparent border-gray-100">
                                        <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">Name</TableHead>
                                        <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">Suburb</TableHead>
                                        <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">Smaller Community</TableHead>
                                        <TableHead className="text-right font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cottages.map((cottage) => (
                                        <TableRow key={cottage.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                                            <TableCell className="font-medium text-gray-900">{cottage.name}</TableCell>
                                            <TableCell className="text-gray-500">{cottage.suburbName}</TableCell>
                                            <TableCell className="text-gray-500">{cottage.smallerCommunityName || "-"}</TableCell>
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

            {/* Add Cottage Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Cottage</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Suburb</Label>
                            <Select value={selectedSuburb} onValueChange={setSelectedSuburb}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Suburb" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="s1">Suburb A</SelectItem>
                                    <SelectItem value="s2">Suburb B</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Smaller Community (Optional)</Label>
                            <Select value={selectedSmallerCommunity} onValueChange={setSelectedSmallerCommunity}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="sc1">Small Comm 1</SelectItem>
                                    <SelectItem value="sc2">Small Comm 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Cottage Name</Label>
                            <Input 
                                id="name" 
                                placeholder="" 
                                value={newCottageName}
                                onChange={(e) => setNewCottageName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={handleAddCottage}
                        >
                            Add Cottage
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
                            <Select value={editSuburbId} onValueChange={setEditSuburbId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Suburb" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="s1">Suburb A</SelectItem>
                                    <SelectItem value="s2">Suburb B</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Smaller Community (Optional)</Label>
                            <Select value={editSmallerCommunityId} onValueChange={setEditSmallerCommunityId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="sc1">Small Comm 1</SelectItem>
                                    <SelectItem value="sc2">Small Comm 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Cottage Name</Label>
                            <Input 
                                id="edit-name" 
                                placeholder="" 
                                value={editCottageName}
                                onChange={(e) => setEditCottageName(e.target.value)}
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
