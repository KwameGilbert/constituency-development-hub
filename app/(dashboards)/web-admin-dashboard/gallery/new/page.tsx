import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import GalleryForm from "@/components/web-admin-dashboard/gallery/GalleryForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import React from "react";

export default function NewGalleryPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <WebAdminHeader title="Create New Album" />
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col gap-2">
          <Link 
            href="/web-admin-dashboard/gallery"
            className="flex items-center text-sm text-slate-500 hover:text-emerald-600 transition-colors w-fit mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Galleries
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Create New Album</h1>
          <p className="text-slate-500">Add a new photo album with event highlights and community updates.</p>
        </div>

        <GalleryForm />
      </div>
    </div>
  );
}
