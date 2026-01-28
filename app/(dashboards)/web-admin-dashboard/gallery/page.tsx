import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import GalleryList from "@/components/web-admin-dashboard/gallery/GalleryList";
import React from "react";

export default function GalleryAdminPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <WebAdminHeader title="Gallery Management" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
            Galleries
          </h1>
          <p className="text-slate-500">
            Manage photo albums, event galleries, and community development
            highlights.
          </p>
        </div>

        <GalleryList />
      </div>
    </div>
  );
}
