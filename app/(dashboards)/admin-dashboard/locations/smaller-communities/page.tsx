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
    Filter
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

export default function SmallerCommunitiesPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Filter State
    const [selectedCommunityFilter, setSelectedCommunityFilter] = useState("all");
    const [selectedSuburbFilter, setSelectedSuburbFilter] = useState("all");

    // Add/Edit State
    const [newCommunityName, setNewCommunityName] = useState("");
    const [selectedSuburb, setSelectedSuburb] = useState("");
    
    // Define types for better TS support if needed, but for now inferred is fine
    // Mock Data - Empty for now to match design requirement of "No smaller communities found"
    // const smallerCommunities = []; 
    const smallerCommunities: any[] = []; 

    const handleAddCommunity = () => {
        console.log("Adding smaller community:", newCommunityName, "in suburb:", selectedSuburb);
        setIsAddModalOpen(false);
        setNewCommunityName("");
        setSelectedSuburb("");
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
                    { label: "Back to Locations", href: "/admin-dashboard/locations", icon: ArrowLeft },
                    { label: "Profile Settings", href: "/admin-dashboard/profile", icon: UserCircle },
                    { label: "Audit Logs", href: "/admin-dashboard/audit", icon: ShieldAlert },
                    { label: "System Settings", href: "/admin-dashboard/system-settings", icon: Settings2 },
                    { label: "Logout", icon: LogOut, className: "text-red-600 focus:text-red-600 focus:bg-red-50" },
                ]}
                actionButtons={[
                    { 
                        label: "Add Smaller Community", 
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
                            <h2 className="text-lg font-semibold text-gray-900">Smaller Communities</h2>
                            <p className="text-sm text-gray-500">Showing {smallerCommunities.length} smaller communities</p>
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
                                <Select value={selectedCommunityFilter} onValueChange={setSelectedCommunityFilter}>
                                    <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
                                        <SelectValue placeholder="All Communities" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Communities</SelectItem>
                                        <SelectItem value="c1">Sefwi Asawinso</SelectItem>
                                        <SelectItem value="c2">Sefwi Boako</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={selectedSuburbFilter} onValueChange={setSelectedSuburbFilter}>
                                    <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
                                        <SelectValue placeholder="All Suburbs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Suburbs</SelectItem>
                                        <SelectItem value="s1">Suburb A</SelectItem>
                                        <SelectItem value="s2">Suburb B</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Apply Filters
                                </Button>
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

                    {/* Empty State / List */}
                    {smallerCommunities.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">No smaller communities found</h3>
                            <p className="text-gray-500 mb-6 max-w-sm">There are no smaller communities in the system yet.</p>
                            <Button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Smaller Community
                            </Button>
                        </div>
                    ) : (
                        // Placeholder for list view if data exists
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-gray-500">List view implementation...</p>
                        </div>
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
                            <Select value={selectedSuburb} onValueChange={setSelectedSuburb}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Suburb" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="s1">Suburb A</SelectItem>
                                    <SelectItem value="s2">Suburb B</SelectItem>
                                    <SelectItem value="s3">Suburb C</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Smaller Community Name</Label>
                            <Input 
                                id="name" 
                                placeholder="" 
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
                            Add Smaller Community
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
