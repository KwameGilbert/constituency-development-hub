"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  Trash2,
  Edit,
  GripVertical,
  AlertCircle,
  Layers,
  ListTree,
  ChevronRight,
  Database,
} from "lucide-react";
import { toast } from "sonner";
import {
  sectorsService,
  Sector,
  SubSector,
} from "@/lib/services/sectors-service";

interface SubSectorsManagerProps {
  sector: Sector | null;
  isOpen: boolean;
  onClose: () => void;
  sectorName?: string;
  sectorId?: number;
}

export function SubSectorsManager({
  sector,
  isOpen,
  onClose,
  sectorName,
  sectorId,
}: SubSectorsManagerProps) {
  const [subSectors, setSubSectors] = useState<SubSector[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  const effectiveId = sectorId || sector?.id;
  const effectiveName = sectorName || sector?.name;

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const fetchSubSectors = useCallback(async () => {
    if (!effectiveId) return;
    try {
      setLoading(true);
      setApiUnavailable(false);
      const response = await sectorsService.getSubSectors(effectiveId);
      if (response.success && response.data.sub_sectors) {
        setSubSectors(response.data.sub_sectors);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch sub-sectors:", error);
      if (
        error instanceof Error &&
        (error.message.includes("Network error") ||
          error.message.includes("Failed to fetch"))
      ) {
        setApiUnavailable(true);
      } else {
        toast.error("Process failure in taxonomy synchronization");
      }
    } finally {
      setLoading(false);
    }
  }, [effectiveId]);

  useEffect(() => {
    if (isOpen && effectiveId) {
      fetchSubSectors();
      resetForm();
    }
  }, [isOpen, effectiveId, fetchSubSectors]);

  const resetForm = () => {
    setFormData({ name: "", code: "", description: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (sub: SubSector) => {
    setFormData({
      name: sub.name,
      code: sub.code || "",
      description: sub.description || "",
    });
    setEditingId(sub.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setIsSubmitting(true);
      const response = await sectorsService.deleteSubSector(id);
      if (response.success) {
        toast.success("Sub-sector taxonomy purged");
        fetchSubSectors();
      } else {
        toast.error(response.message || "Execution failure");
      }
    } catch {
      toast.error("Process error: Associated dependencies detected");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveId) return;
    if (!formData.name.trim()) {
      toast.error("Identity label required");
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditing && editingId) {
        const response = await sectorsService.updateSubSector(editingId, {
          name: formData.name,
          code: formData.code,
          description: formData.description,
        });
        if (response.success) {
          toast.success("Sub-sector synchronization complete");
          resetForm();
          fetchSubSectors();
        } else {
          toast.error(response.message || "Update failure");
        }
      } else {
        const response = await sectorsService.createSubSector(effectiveId, {
          name: formData.name,
          code: formData.code,
          description: formData.description,
        });
        if (response.success) {
          toast.success("Sub-sector initialized");
          resetForm();
          fetchSubSectors();
        } else {
          toast.error(response.message || "Initialization failure");
        }
      }
    } catch {
      toast.error("System synchronization failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[850px] min-h-[500px] h-[75vh] flex flex-col p-0 gap-0 border-none shadow-2xl rounded-3xl overflow-hidden">
        <DialogHeader className="p-6 bg-slate-950 text-white relative">
           <div className="absolute top-6 left-6 w-1 h-6 bg-amber-500 rounded-full" />
           <DialogTitle className="pl-4 flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight">Sub-Sectors Oversight</span>
            {effectiveName && (
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-700 text-amber-500 bg-slate-900 shadow-lg">
                {effectiveName}
              </Badge>
            )}
          </DialogTitle>
          <p className="pl-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Refine and manage sub-category taxonomies</p>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden bg-white">
          {/* List Section Layer */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/50">
            {apiUnavailable ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                   <Database className="w-8 h-8 opacity-70" />
                </div>
                <div className="text-center">
                  <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Database Sync Error</p>
                  <p className="text-xs text-slate-500 mt-2 max-w-[200px] mx-auto leading-relaxed">
                    Sub-sector management requires localized backend deployment.
                  </p>
                </div>
              </div>
            ) : loading ? (
              <div className="flex flex-col justify-center items-center h-full gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synchronizing records...</span>
              </div>
            ) : subSectors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                  <ListTree className="w-8 h-8" />
                </div>
                <div>
                   <p className="text-slate-900 font-bold text-sm">Unified Taxonomy</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Zero children defined</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {subSectors.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-amber-200/50 hover:bg-amber-50/10 transition-all duration-300"
                  >
                    <GripVertical className="w-4 h-4 text-slate-200 cursor-move group-hover:text-amber-300" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 text-sm group-hover:text-amber-600 transition-colors truncate">
                          {sub.name}
                        </span>
                        {sub.code && (
                          <Badge
                            className="text-[9px] font-black tracking-tighter bg-slate-900 text-white rounded-md h-4 border-none"
                          >
                            {sub.code}
                          </Badge>
                        )}
                      </div>
                      {sub.description && (
                        <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">
                          {sub.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-900"
                        onClick={() => handleEdit(sub)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-600"
                        onClick={() => handleDelete(sub.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Context Layer */}
          <div className="w-[320px] p-8 flex flex-col bg-white border-l border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-widest">
                {isEditing ? "Modify Profile" : "Initialize Entity"}
              </h3>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[10px] font-bold text-slate-400 hover:text-slate-950"
                  onClick={resetForm}
                >
                  Discard
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Identity Label</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Infrastructure Maintenance"
                  className="h-10 rounded-xl bg-slate-50 border-slate-100 focus:bg-white text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Unified Code</Label>
                <Input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="e.g. INF-MAIN"
                  className="h-10 rounded-xl bg-slate-50 border-slate-100 focus:bg-white text-xs font-mono font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Strategic Scope</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Summarize specific mandate..."
                  className="min-h-[100px] rounded-xl bg-slate-50 border-slate-100 focus:bg-white text-xs font-medium resize-none shadow-xs"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-slate-950 text-white hover:bg-slate-800 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="p-1 bg-amber-500 rounded-md group-hover:scale-110 transition-transform">
                     <Plus className="w-3.5 h-3.5 text-slate-950" />
                  </div>
                )}
                {isEditing ? "Synchronize" : "Commit Entity"}
              </Button>
            </form>

            <div className="mt-auto pt-8">
               <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950">
                     <AlertCircle className="w-4 h-4" />
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">
                    Changes take effect across all operational sectors immediately.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
