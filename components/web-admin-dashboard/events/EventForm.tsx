import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface EventFormProps {
  isEditing?: boolean;
}

export function EventForm({ isEditing = false }: EventFormProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="eventName">Event Name</Label>
          <Input 
            id="eventName" 
            placeholder="" 
            className="border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug <span className="text-slate-400 font-normal">(Leave empty to auto-generate from event name)</span></Label>
          <div className="flex gap-2">
            <Input 
              id="slug" 
              placeholder="my-event-url" 
              className="border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
            />
            <Button variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200">
              Generate
            </Button>
          </div>
          <p className="text-xs text-slate-400">This will be used in the event's URL: yourdomain.com/events/event-slug</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            placeholder="" 
            className="border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <div className="relative">
              <Input 
                id="startDate" 
                placeholder="dd/mm/yyyy" 
                className="border-slate-200 focus:border-violet-500 focus:ring-violet-500 pr-10" 
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date <span className="text-slate-400 font-normal">(Optional, for multi-day events)</span></Label>
            <div className="relative">
              <Input 
                id="endDate" 
                placeholder="dd/mm/yyyy" 
                className="border-slate-200 focus:border-violet-500 focus:ring-violet-500 pr-10" 
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventTime">Event Time <span className="text-slate-400 font-normal">(Leave empty for all-day events)</span></Label>
          <div className="relative">
            <Input 
              id="eventTime" 
              placeholder="--:-- --" 
              className="border-slate-200 focus:border-violet-500 focus:ring-violet-500 pr-10" 
            />
            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Event Image</Label>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
              Choose File
            </Button>
            <span className="text-sm text-slate-400">No file chosen</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Event Description</Label>
          <div className="min-h-[300px] border border-slate-200 rounded-md p-4 bg-slate-50/50">
            {/* Placeholder for Rich Text Editor */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-2 text-slate-500">
                <span className="text-xs font-bold">B</span>
                <span className="text-xs italic">I</span>
                <span className="text-xs underline">U</span>
                <span className="text-xs line-through">S</span>
            </div>
            <p className="text-slate-400 text-sm">Type your description here...</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
          Cancel
        </Button>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white">
          {isEditing ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </div>
  );
}
