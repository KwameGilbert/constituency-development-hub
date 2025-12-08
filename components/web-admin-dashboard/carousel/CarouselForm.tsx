import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button as UiButton } from "@/components/ui/button"; // Alias to avoid conflict if needed, though not strictly necessary here
import Link from "next/link";

interface CarouselFormProps {
  isEditing?: boolean;
}

export function CarouselForm({ isEditing = false }: CarouselFormProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            placeholder="" 
            className="border-slate-200 focus:border-purple-500 focus:ring-purple-500" 
            defaultValue={isEditing ? "PARLIAMENT ACTIVITIES" : ""}
          />
          <p className="text-xs text-slate-400">The title appears when hovering over the image</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkUrl">Link URL <span className="text-slate-400 font-normal">(Optional)</span></Label>
          <Input 
            id="linkUrl" 
            placeholder="https://" 
            className="border-slate-200 focus:border-purple-500 focus:ring-purple-500" 
          />
          <p className="text-xs text-slate-400">Where users will go when they click on this carousel item</p>
        </div>

        <div className="space-y-2">
          <Label>Carousel Image</Label>
          <div className="flex items-center gap-4">
             {isEditing && (
                <div className="h-24 w-36 bg-slate-100 rounded-md border border-slate-200 overflow-hidden relative">
                    {/* Placeholder for existing image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400 text-xs text-center p-2">
                        Current Image
                    </div>
                </div>
             )}
            <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-fit border-slate-200 text-slate-600 hover:bg-slate-50">
                {isEditing ? "Choose New Image" : "Choose File"}
                </Button>
                {!isEditing && <span className="text-sm text-slate-400">No file chosen</span>}
                {isEditing && <span className="text-xs text-slate-400 break-all max-w-md">Current image: 1753785776_481162358...jpg</span>}
            </div>
          </div>
          <p className="text-xs text-slate-400">Recommended size: 1920x600 pixels. Max file size: 2MB</p>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <Link href="/web-admin-dashboard/carousel">
            <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
            Cancel
            </Button>
        </Link>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          {isEditing ? "Update Carousel Item" : "Add Carousel Item"}
        </Button>
      </div>
    </div>
  );
}
