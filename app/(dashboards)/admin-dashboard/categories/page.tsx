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
  FolderTree,
  Edit,
  Trash2,
  Loader2,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  LayoutGrid,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { categoriesService, Category } from "@/lib/services/categories-service";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function CategoriesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    color: "#f59e0b",
  });

  // API State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit/Delete State
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoriesService.getAdminCategories();

      if (response.success && response.data?.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Process failure in category synchronization");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Filter categories based on search query
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Client-side pagination
  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
      color: "#f59e0b",
    });
  };

  // Handle adding a new category
  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast.error("Taxonomy identification label required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await categoriesService.createCategory({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        icon: formData.icon.trim() || undefined,
        color: formData.color || undefined,
      });

      if (response.success) {
        toast.success("Primary category finalized");
        setIsAddModalOpen(false);
        resetForm();
        fetchCategories();
      } else {
        toast.error(response.message || "Initialization failure");
      }
    } catch (error) {
      console.error("Failed to add category:", error);
      toast.error("System process error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit click
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
      color: category.color || "#f59e0b",
    });
    setIsEditModalOpen(true);
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    if (!selectedCategory) return;

    if (!formData.name.trim()) {
      toast.error("Category Title Identification required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await categoriesService.updateCategory(
        selectedCategory.id,
        {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          icon: formData.icon.trim() || null,
          color: formData.color || null,
        },
      );

      if (response.success) {
        toast.success("Category synchronization complete");
        setIsEditModalOpen(false);
        setSelectedCategory(null);
        resetForm();
        fetchCategories();
      } else {
        toast.error(response.message || "Synchronization failure");
      }
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Process error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    setIsSubmitting(true);
    try {
      const response = await categoriesService.deleteCategory(
        selectedCategory.id,
      );

      if (response.success) {
        toast.success("Classification purged from registry");
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
        fetchCategories();
      } else {
        toast.error(response.message || "Purge failure");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Taxonomy dependency detected: Purge blocked");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <AdminHeader
        title="Categories"
        description="Master foundational taxonomy and strategic classification hub"
        roleAbbr="MP"
        dropdownItems={[
          {
            label: "Sectors Hub",
            href: "/admin-dashboard/sectors",
            icon: Layers,
          },
          {
            label: "Back to Dashboard",
            href: "/admin-dashboard",
            icon: ArrowLeft,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-500 font-bold",
          },
        ]}
        actionButtons={[
            {
                label: "Manage Sectors",
                icon: Layers,
                href: "/admin-dashboard/sectors",
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
                Taxonomy Registry
              </h2>
              <p className="text-slate-500 font-medium text-sm mt-0.5">
                {loading ? "Synchronizing classification metadata..." : `Overseeing ${filteredCategories.length} root categories`}
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
            Declare New Category
          </Button>
        </div>

        {/* Search Matrix */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-amber-500 transition-colors" />
          <Input
            placeholder="Search classification registry by title or description..."
            className="h-14 pl-12 bg-white border-none shadow-md shadow-slate-200/40 rounded-2xl focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Grid Table */}
        <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[35%]">Entity Identity</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[35%]">Descriptive Scope</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dependencies</TableHead>
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
                ) : paginatedCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-24 text-center text-slate-400 font-bold italic">No matching registry entries found</TableCell>
                  </TableRow>
                ) : (
                  paginatedCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors group">
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: category.color || "#f59e0b" }}
                          >
                            <FolderTree className="w-5 h-5 stroke-[2.5px]" />
                          </div>
                          <span className="font-bold text-slate-950 text-sm group-hover:text-amber-600 transition-colors">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                         <span className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
                          {category.description || "N/A — No secondary descriptive metadata available."}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                         <Link href="/admin-dashboard/sectors">
                           <Badge className="bg-slate-950 text-white rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer">
                              {category.sectors_count || 0} Sectors
                           </Badge>
                         </Link>
                      </TableCell>
                      <TableCell className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => handleEditClick(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-9 w-9 rounded-xl ${
                              (category.sectors_count || 0) > 0
                                ? "text-slate-200 cursor-not-allowed"
                                : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                            }`}
                            onClick={() => {
                                if ((category.sectors_count || 0) > 0) {
                                    toast.error("Process Blocked: Active sector dependencies detected");
                                    return;
                                }
                                handleDeleteClick(category);
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

          {/* Pagination Footer */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
               <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Showing <span className="text-slate-950">{paginatedCategories.length}</span> of <span className="text-slate-950">{filteredCategories.length}</span>
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

      {/* Synchronize Dialog Units */}
      <Dialog 
        open={isAddModalOpen || isEditModalOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedCategory(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden p-0">
          <DialogHeader className="p-6 bg-slate-950 text-white relative">
            <div className="absolute top-6 left-6 w-1 h-6 bg-amber-500 rounded-full" />
            <DialogTitle className="pl-4 text-xl font-bold tracking-tight">
              {isEditModalOpen ? "Category Synchronization" : "Category Initialization"}
            </DialogTitle>
            <p className="pl-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Refine foundational classification profile</p>
          </DialogHeader>
          
          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Classification Title</Label>
              <Input
                placeholder="e.g. Infrastructure & Utilities"
                className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white text-xs font-bold"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Scope Summary</Label>
              <Textarea
                placeholder="Declare high-level sector categorization..."
                className="min-h-[100px] rounded-xl bg-slate-50 border-slate-100 focus:bg-white text-xs font-medium resize-none shadow-xs"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
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
                   <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                   <Input
                    placeholder="folder-tree"
                    className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-mono text-xs font-bold"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
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
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/20"
              onClick={isEditModalOpen ? handleSaveChanges : handleAddCategory}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                 <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                isEditModalOpen ? "Commit Update" : "Finalize Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Purge Alert Dialog Unit */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          <div className="p-8 space-y-4">
             <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-2">
                <Trash2 className="w-8 h-8" />
             </div>
             <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black text-slate-950 tracking-tight">Purge Taxonomy</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500 font-medium text-base leading-relaxed">
                  Are you absolutely certain you want to purge &quot;{selectedCategory?.name}&quot;? All child sector associations must be terminated prior to this action. This process is irreversible.
                </AlertDialogDescription>
             </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex-row gap-4">
            <AlertDialogCancel className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-white border-slate-100" disabled={isSubmitting}>Retain</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-600/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Purge"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
