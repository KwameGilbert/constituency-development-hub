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
}

export function SubSectorsManager({
  sector,
  isOpen,
  onClose,
}: SubSectorsManagerProps) {
  const [subSectors, setSubSectors] = useState<SubSector[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const fetchSubSectors = useCallback(async () => {
    if (!sector) return;
    try {
      setLoading(true);
      setApiUnavailable(false);
      const response = await sectorsService.getSubSectors(sector.id);
      if (response.success && response.data.sub_sectors) {
        setSubSectors(response.data.sub_sectors);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch sub-sectors:", error);
      // Check if it's a network/API unavailable error
      if (error instanceof Error && (error.message.includes("Network error") || error.message.includes("Failed to fetch"))) {
        setApiUnavailable(true);
      } else {
        toast.error("Failed to load sub-sectors");
      }
    } finally {
      setLoading(false);
    }
  }, [sector]);

  useEffect(() => {
    if (isOpen && sector) {
      fetchSubSectors();
      resetForm();
    }
  }, [isOpen, sector, fetchSubSectors]);

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
    if (!confirm("Are you sure you want to delete this sub-sector?")) return;

    try {
      setIsSubmitting(true);
      const response = await sectorsService.deleteSubSector(id);
      if (response.success) {
        toast.success("Sub-sector deleted");
        fetchSubSectors();
      } else {
        toast.error(response.message || "Failed to delete");
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error && (error.message.includes("Network error") || error.message.includes("Failed to fetch"))) {
        toast.error("Feature not available - backend deployment required");
        setApiUnavailable(true);
      } else {
        toast.error("Failed to delete sub-sector");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sector) return;
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditing && editingId) {
        // Update
        const response = await sectorsService.updateSubSector(editingId, {
          name: formData.name,
          code: formData.code,
          description: formData.description,
        });
        if (response.success) {
          toast.success("Sub-sector updated");
          resetForm();
          fetchSubSectors();
        } else {
          toast.error(response.message || "Update failed");
        }
      } else {
        // Create
        const response = await sectorsService.createSubSector(sector.id, {
          name: formData.name,
          code: formData.code,
          description: formData.description,
        });
        if (response.success) {
          toast.success("Sub-sector added");
          resetForm();
          fetchSubSectors();
        } else {
          toast.error(response.message || "Creation failed");
        }
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error && (error.message.includes("Network error") || error.message.includes("Failed to fetch"))) {
        toast.error("Feature not available - backend deployment required");
        setApiUnavailable(true);
      } else {
        toast.error("Operation failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle className="flex items-center gap-2">
            <span>Manage Sub-Sectors</span>
            {sector && (
              <Badge variant="outline" className="ml-2 font-normal">
                {sector.name}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* List Section */}
          <div className="flex-1 overflow-y-auto p-4 border-r bg-slate-50">
            {apiUnavailable ? (
              <div className="flex flex-col items-center justify-center h-full text-amber-600 text-sm gap-3 p-4">
                <AlertCircle className="w-10 h-10 opacity-70" />
                <div className="text-center">
                  <p className="font-medium">Feature Not Available</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Sub-sector management requires backend deployment.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Please deploy the API changes to enable this feature.
                  </p>
                </div>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-gray-400" />
              </div>
            ) : subSectors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
                <AlertCircle className="w-8 h-8 opacity-50" />
                <p>No sub-sectors found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {subSectors.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white p-3 rounded border shadow-sm flex items-center gap-3 group"
                  >
                    <GripVertical className="w-4 h-4 text-gray-300 cursor-move" />
                    <div className="flex-1">
                      <div className="font-medium text-sm flex items-center gap-2">
                        {sub.name}
                        {sub.code && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-4 px-1"
                          >
                            {sub.code}
                          </Badge>
                        )}
                      </div>
                      {sub.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {sub.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleEdit(sub)}
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleDelete(sub.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
            )}
          </div>

          {/* Form Section */}
          <div className="w-[300px] p-6 flex flex-col bg-white">
            <h3 className="font-semibold mb-4 text-sm flex items-center justify-between">
              {isEditing ? "Edit Sub-Sector" : "Add New Sub-Sector"}
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sub-name" className="text-xs">
                  Name
                </Label>
                <Input
                  id="sub-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Primary Education"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-code" className="text-xs">
                  Code (Optional)
                </Label>
                <Input
                  id="sub-code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="e.g. EDU-PRI"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-desc" className="text-xs">
                  Description
                </Label>
                <Textarea
                  id="sub-desc"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description..."
                  className="min-h-[80px] text-sm resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={isSubmitting}
                size="sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3 h-3 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                {isEditing ? "Save Changes" : "Add Sub-Sector"}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
