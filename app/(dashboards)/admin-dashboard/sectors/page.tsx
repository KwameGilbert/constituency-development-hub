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
import { ListTree } from "lucide-react";

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
    color: "#1e1b4b", // default color
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
      toast.error("Failed to load sectors");
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
      color: "#1e1b4b",
      icon: "",
    });
  };

  // Handle adding a new sector
  const handleAddSector = async () => {
    if (!formData.name.trim()) {
      toast.error("Sector name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sectorsService.createSector({
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
        name: formData.name.trim(),
        description: formData.description,
        color: formData.color,
        icon: formData.icon,
        status: "active",
      });

      if (response.success) {
        toast.success("Sector added successfully");
        setIsAddModalOpen(false);
        resetForm();
        fetchSectors();
      } else {
        toast.error(response.message || "Failed to add sector");
      }
    } catch (error) {
      console.error("Failed to add sector:", error);
      toast.error("Failed to add sector");
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
      color: sector.color || "#1e1b4b",
      icon: sector.icon || "",
    });
    setIsEditModalOpen(true);
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    if (!selectedSector) return;

    if (!formData.name.trim()) {
      toast.error("Sector name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sectorsService.updateSector(selectedSector.id, {
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        name: formData.name.trim(),
        description: formData.description,
        color: formData.color,
        icon: formData.icon,
        status: "active",
      });

      if (response.success) {
        toast.success("Sector updated successfully");
        setIsEditModalOpen(false);
        setSelectedSector(null);
        resetForm();
        fetchSectors();
      } else {
        toast.error(response.message || "Failed to update sector");
      }
    } catch (error) {
      console.error("Failed to update sector:", error);
      toast.error("Failed to update sector");
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
        toast.success("Sector deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedSector(null);
        fetchSectors();
      } else {
        toast.error(response.message || "Failed to delete sector");
      }
    } catch (error) {
      console.error("Failed to delete sector:", error);
      toast.error("Failed to delete sector. It may have associated projects.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManageSubSectors = (sector: Sector) => {
    setSelectedSector(sector);
    setIsSubSectorsOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Sectors"
        description="Manage project sectors and categories"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
          {
            label: "Categories",
            href: "/admin-dashboard/categories",
            icon: FolderTree,
          },
          {
            label: "Back to Dashboard",
            href: "/admin-dashboard",
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
            label: "Categories",
            icon: FolderTree,
            href: "/admin-dashboard/categories",
            className: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
          },
          {
            label: "Add Sector",
            icon: Plus,
            onClick: () => {
              resetForm();
              setIsAddModalOpen(true);
            },
            className: "bg-indigo-600 hover:bg-indigo-700 text-white",
          },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Content Header */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Sectors & Categories
              </h2>
              <p className="text-sm text-gray-500">
                {loading
                  ? "Loading..."
                  : `Showing ${filteredSectors.length} sectors`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search sectors..."
                  className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(true);
                }}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Sector
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="w-[30%] font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Name
                    </TableHead>
                    <TableHead className="w-[40%] font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Description
                    </TableHead>
                    <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Projects
                    </TableHead>
                    <TableHead className="text-right font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                          <span className="text-gray-500">
                            Loading sectors...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedSectors.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-10 text-gray-500"
                      >
                        No sectors found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedSectors.map((sector) => (
                      <TableRow
                        key={sector.id}
                        className="hover:bg-gray-50/50 border-gray-100 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                              style={{
                                backgroundColor: sector.color || "#6366f1",
                              }}
                            >
                              <Tag className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium">{sector.name}</div>
                              <div className="text-xs text-gray-400">
                                /{sector.slug}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm max-w-[300px] truncate">
                          {sector.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50"
                          >
                            {sector.projects_count || 0} projects
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              onClick={() => handleManageSubSectors(sector)}
                            >
                              <ListTree className="w-3.5 h-3.5 mr-1.5" />
                              Subsectors
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                              onClick={() => handleEditClick(sector)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${
                                (sector.projects_count || 0) > 0
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-red-400 hover:text-red-500 hover:bg-red-50"
                              }`}
                              onClick={() => {
                                if ((sector.projects_count || 0) > 0) {
                                  toast.error(
                                    "Cannot delete sector with existing projects",
                                  );
                                  return;
                                }
                                handleDeleteClick(sector);
                              }}
                              title={
                                (sector.projects_count || 0) > 0
                                  ? "Cannot delete sector with existing projects"
                                  : "Delete Sector"
                              }
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

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium text-gray-900">{(currentPage - 1) * pageSize + 1}</span>
                {" "}to{" "}
                <span className="font-medium text-gray-900">{Math.min(currentPage * pageSize, filteredSectors.length)}</span>
                {" "}of{" "}
                <span className="font-medium text-gray-900">{filteredSectors.length}</span>{" "}
                sectors
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Sector Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Sector</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleFormChange("category_id", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">
                Sector Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Education"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the sector..."
                value={formData.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    className="w-12 h-10 p-1 cursor-pointer"
                    value={formData.color}
                    onChange={(e) => handleFormChange("color", e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => handleFormChange("color", e.target.value)}
                    disabled={isSubmitting}
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Class (Optional)</Label>
                <Input
                  id="icon"
                  placeholder="e.g. lucide-book"
                  value={formData.icon}
                  onChange={(e) => handleFormChange("icon", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
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
              onClick={handleAddSector}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Sector"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Sector Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Sector</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleFormChange("category_id", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Sector Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="e.g. Education"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Brief description of the sector..."
                value={formData.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-color"
                    type="color"
                    className="w-12 h-10 p-1 cursor-pointer"
                    value={formData.color}
                    onChange={(e) => handleFormChange("color", e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => handleFormChange("color", e.target.value)}
                    disabled={isSubmitting}
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon Class (Optional)</Label>
                <Input
                  id="edit-icon"
                  placeholder="e.g. lucide-book"
                  value={formData.icon}
                  onChange={(e) => handleFormChange("icon", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
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
            <AlertDialogTitle>Delete Sector</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedSector?.name}
              &quot;? This action cannot be undone. Sectors with associated
              projects cannot be deleted.
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

      {/* Sub-Sectors Manager Dialog */}
      <SubSectorsManager
        sector={selectedSector}
        isOpen={isSubSectorsOpen}
        onClose={() => setIsSubSectorsOpen(false)}
      />
    </div>
  );
}
