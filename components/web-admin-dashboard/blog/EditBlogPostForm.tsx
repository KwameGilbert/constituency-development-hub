import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";

export function EditBlogPostForm() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Post Title</Label>
          <Input 
            id="title" 
            defaultValue="Sefwi Wiawso MCE and MP Collaborate to Reshape Road to Government Hospital Mortuary" 
            className="border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug <span className="text-slate-400 font-normal">(Leave empty to auto-generate from title)</span></Label>
          <div className="flex gap-2">
            <Input 
              id="slug" 
              defaultValue="sefwi-wiawso-mce-mp-collaborate-road-reshape" 
              className="border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
            />
            <Button variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200">
              Generate
            </Button>
          </div>
          <p className="text-xs text-slate-400">This will be used in the post's URL: yourdomain.com/blog/post-slug</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt <span className="text-slate-400 font-normal">(A short summary of the post)</span></Label>
          <Textarea 
            id="excerpt" 
            defaultValue="A major collaboration to improve infrastructure in the constituency..."
            className="min-h-[100px] border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="featured" defaultChecked className="data-[state=checked]:bg-violet-600 border-slate-300" />
          <Label htmlFor="featured" className="font-normal text-slate-600">
            Feature this post <span className="text-slate-400">(Featured posts appear in highlights sections)</span>
          </Label>
        </div>

        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="flex items-center gap-4">
            <div className="h-20 w-32 bg-slate-100 rounded-md border border-slate-200 overflow-hidden">
                {/* Placeholder for existing image preview */}
                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-400">Current Image</div>
            </div>
            <div className="flex flex-col gap-2">
                <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                Change File
                </Button>
                <span className="text-xs text-slate-400">current-image.jpg</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Post Content</Label>
          <div className="min-h-[400px] border border-slate-200 rounded-md p-4 bg-slate-50/50">
            {/* Placeholder for Rich Text Editor */}
            <p className="text-slate-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                <br/><br/>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
          Cancel
        </Button>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white">
          Update Post
        </Button>
      </div>
    </div>
  );
}
