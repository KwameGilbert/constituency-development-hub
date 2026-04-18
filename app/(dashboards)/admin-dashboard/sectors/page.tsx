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
  Tag,
  Edit,
  Trash2,
  ArrowLeft,
  Loader2,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListTree,
  ExternalLink,
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
import { sectorsService, Sector } from "@/lib/services/sectors-service";
import { categoriesService, Category } from "@/lib/services/categories-service";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubSectorsManager } from "@/components/admin-dashboard/sectors/SubSectorsManager";

export default function SectorsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubSectorsOpen, setIsSubSectorsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Form State
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    color: "#f59e0b", // standard amber
    icon: "",
  });

  // API State
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

  // Fetch sectors from API
  const fetchSectors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await sectorsService.getSectors();

      if (response.success && response.data?.sectors) {
        setSectors(response.data.sectors);
      }
    } catch (error) {
      console.error("Failed to fetch sectors:", error);
      toast.error("Process failure in sector synchronization");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesService.getCategories();
      if (response.success && response.data?.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchSectors();
    fetchCategories();
  }, [fetchSectors, fetchCategories]);

  // Filter sectors based on search query
  const filteredSectors = sectors.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Client-side pagination
  const totalPages = Math.ceil(filteredSectors.length / pageSize);
  const paginatedSectors = filteredSectors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle form change
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      category_id: "",
      name: "",
      description: "",
      color: "#f59e0b",
      icon: "",
    });
  };

  // Handle adding a new sector
  const handleAddSector = async () => {
    if (!formData.name.trim()) {
      toast.error("Identity profile requires a name");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sectorsService.createSector({
        category_id: formData.category_id
          ? parseInt(formData.category_id)
          : undefined,
        name: formData.name.trim(),
        description: formData.description,
        color: formData.color,
        icon: formData.icon,
        status: "active",
      });

      if (response.success) {
        toast.success("Sector taxonomy initialized");
        setIsAddModalOpen(false);
        resetForm();
        fetchSectors();
      } else {
        toast.error(response.message || "Execution failure");
      }
    } catch (error) {
      console.error("Failed to add sector:", error);
      toast.error("Process error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit click
  const handleEditClick = (sector: Sector) => {
    setSelectedSector(sector);
    setFormData({
      category_id: sector.category_id?.toString() || "",
      name: sector.name,
      description: sector.description || "",
      color: sector.color || "#f59e0b",
      icon: sector.icon || "",
    });
    setIsEditModalOpen(true);
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    if (!selectedSector) return;

    if (!formData.name.trim()) {
      toast.error("Sector identification required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sectorsService.updateSector(selectedSector.id, {
        category_id: formData.category_id
          ? parseInt(formData.category_id)
          : null,
        name: formData.name.trim(),
        description: formData.description,
        color: formData.color,
        icon: formData.icon,
        status: "active",
      });

      if (response.success) {
        toast.success("Sector profile synchronization complete");
        setIsEditModalOpen(false);
        setSelectedSector(null);
        resetForm();
        fetchSectors();
      } else {
        toast.error(response.message || "Synchronization failure");
      }
    } catch (error) {
      console.error("Failed to update sector:", error);
      toast.error("Update process error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (sector: Sector) => {
    setSelectedSector(sector);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!selectedSector) return;

    setIsSubmitting(true);
    try {
      const response = await sectorsService.deleteSector(selectedSector.id);

      if (response.success) {
        toast.success("Sector taxonomy purged");
        setIsDeleteDialogOpen(false);
        setSelectedSector(null);
        fetchSectors();
      } else {
        toast.error(response.message || "Purge failure");
      }
    } catch (error) {
      console.error("Failed to delete sector:", error);
      toast.error("Process error: Associated dependencies detected");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManageSubSectors = (sector: Sector) => {
    setSelectedSector(sector);
    setIsSubSectorsOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <AdminHeader
        title="Sectors"
        description="Strategic categorization and developmental sector oversight"
        roleAbbr="MP"
        dropdownItems={[
          {
            label: "Categories Hub",
            href: "/admin-dashboard/categories",
            icon: FolderTree,
          },
          {
            label: "Main Dashboard",
            href: "/admin-dashboard",
            icon: ArrowLeft,
          },
          {
            label: "Audit Oversight",
            href: "/admin-dashboard/audit",
            icon: ShieldAlert,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-500 font-bold",
          },
        ]}
        actionButtons={[
          {
            label: "Manage Categories",
            icon: FolderTree,
            href: "/admin-dashboard/categories",
            className: "bg-white border border-slate-100 text-slate-700 hover:bg-slate-50 shadow-sm",
          },
        ]}
      />

      <div className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto w-full">
        {/* Content Header Cluster */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
            <div>
              <h2 className="text-3xl font-bold text-slate-950 tracking-tight">
                Taxonomy Control
              </h2>
              <p className="text-slate-500 font-medium text-sm mt-0.5">
                {loading ? "Synchronizing sector metadata..." : `Overseeing ${filteredSectors.length} developmental sectors`}
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="h-12 px-6 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 group transition-all"
          >
            <div className="p-1.5 bg-amber-500 rounded-lg group-hover:rotate-12 transition-transform shadow-md shadow-amber-500/20">
               <Plus className="h-4 w-4 text-slate-950" />
            </div>
            Initialize Sector
          </Button>
        </div>

        {/* Search & Filter Unit */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-amber-500 transition-colors" />
          <Input
            placeholder="Search operational sectors by name or slug..."
            className="h-14 pl-12 bg-white border-none shadow-md shadow-slate-200/40 rounded-2xl focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Data Table Core */}
        <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[30%]">Sector Identity</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[40%]">Strategic Summary</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allocation</TableHead>
                  <TableHead className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Controls</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                     <TableCell colSpan={4} className="py-24">
                        <div className="flex flex-col items-center justify-center gap-4">
                           <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Master Taxonomy...</span>
                        </div>
                     </TableCell>
                  </TableRow>
                ) : paginatedSectors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-24 text-center">
                       <p className="text-slate-400 font-bold italic">No matching sectors found in database records</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSectors.map((sector) => (
                    <TableRow key={sector.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors group">
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: sector.color || "#f59e0b" }}
                          >
                            <Tag className="w-5 h-5 stroke-[2.5px]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-950 text-sm group-hover:text-amber-600 transition-colors">{sector.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/{sector.slug}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                         <span className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
                          {sector.description || "N/A — No strategic summary provided for this sector."}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                         <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 pb-1 rounded-xl w-fit group-hover:bg-amber-50 transition-colors">
                            <span className="text-xs font-black text-slate-900">{sector.projects_count || 0}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Investments</span>
                         </div>
                      </TableCell>
                      <TableCell className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 hover:bg-slate-100 flex items-center gap-2 border border-transparent hover:border-slate-100"
                            onClick={() => handleManageSubSectors(sector)}
                          >
                            <ListTree className="w-4 h-4" />
                            Subsectors
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => handleEditClick(sector)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-9 w-9 rounded-xl ${
                              (sector.projects_count || 0) > 0
                                ? "text-slate-200 cursor-not-allowed"
                                : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                            }`}
                            onClick={() => {
                              if ((sector.projects_count || 0) > 0) {
                                toast.error("Deployment dependency prevents deletion");
                                return;
                              }
                              handleDeleteClick(sector);
                            }}
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

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
               <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Showing <span className="text-slate-950">{paginatedSectors.length}</span> of <span className="text-slate-950">{filteredSectors.length}</span>
                </div>
              
              <div className="flex items-center gap-1.5">
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Initialize / Edit Modals — Unified Premium Style */}
      <Dialog 
        open={isAddModalOpen || isEditModalOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedSector(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden p-0">
          <DialogHeader className="p-6 bg-slate-950 text-white relative">
            <div className="absolute top-6 left-6 w-1 h-6 bg-amber-500 rounded-full" />
            <DialogTitle className="pl-4 text-xl font-bold tracking-tight">
              {isEditModalOpen ? "Sector Synchronization" : "Sector Initialization"}
            </DialogTitle>
            <p className="pl-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure developmental taxonomy profile</p>
          </DialogHeader>
          
          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Functional Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleFormChange("category_id", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100">
                  <SelectValue placeholder="Select primary category profile" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()} className="font-bold text-slate-700">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sector Title Identity</Label>
              <Input
                placeholder="e.g. Health & Wellness"
                className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-bold"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Strategic Description</Label>
              <Textarea
                placeholder="Comprehensive summary of sector mandate..."
                className="min-h-[100px] rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-medium text-sm"
                value={formData.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">System Tint</Label>
                <div className="flex gap-3">
                  <Input
                    type="color"
                    className="w-12 h-12 p-1 cursor-pointer rounded-xl border-slate-100"
                    value={formData.color}
                    onChange={(e) => handleFormChange("color", e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 h-12 flex items-center px-4 font-mono text-xs font-bold text-slate-500 uppercase">
                     {formData.color}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Registry Icon</Label>
                <div className="relative">
                   <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                   <Input
                    placeholder="lucide-tag"
                    className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-mono text-xs font-bold"
                    value={formData.icon}
                    onChange={(e) => handleFormChange("icon", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex-row gap-3">
            <Button
              variant="ghost"
              className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-white"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/20"
              onClick={isEditModalOpen ? handleSaveChanges : handleAddSector}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                 <Loader2 className="w-4 h-4 animate-spin" />
              ) : isEditModalOpen ? (
                "Update Profile"
              ) : (
                "Commit Sector"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Cluster */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          <div className="p-8 space-y-4">
             <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-2">
                <Trash2 className="w-8 h-8" />
             </div>
             <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black text-slate-950 tracking-tight">Decommission Sector</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500 font-medium text-base">
                  Are you certain you want to purge &quot;{selectedSector?.name}&quot;? This action will permanently remove this developmental taxonomy and all metadata.
                </AlertDialogDescription>
             </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex-row gap-4">
            <AlertDialogCancel className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-white border-slate-100">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-600/20"
            >
              Confirm Purge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* SubSectors Context Slide — Maintaining existing functionality with theme updates */}
      {selectedSector && (
        <SubSectorsManager
          isOpen={isSubSectorsOpen}
          onClose={() => setIsSubSectorsOpen(false)}
          sectorId={selectedSector.id}
          sectorName={selectedSector.name}
        />
      )}
    </div>
  );
}
