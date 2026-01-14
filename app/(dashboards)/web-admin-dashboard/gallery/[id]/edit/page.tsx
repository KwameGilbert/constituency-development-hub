"use client";

import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import GalleryForm from "@/components/web-admin-dashboard/gallery/GalleryForm";
import { galleryService, Gallery } from "@/lib/services/gallery-service";
import Link from "next/link";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function EditGalleryPage() {
  const params = useParams();
  const id = params.id as string;
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchGallery();
    }
  }, [id]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getGallery(id);
      if (response.success && response.data.gallery) {
        setGallery(response.data.gallery);
      } else {
        setError(response.message || "Failed to load gallery details");
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
      setError("An unexpected error occurred while loading gallery details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <WebAdminHeader title="Edit Gallery Album" />
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col gap-2">
          <Link 
            href="/web-admin-dashboard/gallery"
            className="flex items-center text-sm text-slate-500 hover:text-emerald-600 transition-colors w-fit mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Galleries
          </Link>
          
          {gallery && (
             <>
                <h1 className="text-3xl font-bold text-slate-900">Edit Album</h1>
                <p className="text-slate-500">Update the details for &quot;{gallery.title}&quot;</p>
             </>
          )}
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p>Loading album details...</p>
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-red-50 rounded-xl border border-red-100">
             <AlertCircle className="h-10 w-10 text-red-600 mb-4" />
             <h3 className="text-lg font-semibold text-red-900 mb-1">Error</h3>
             <p className="text-red-600 max-w-md mb-6">{error}</p>
             <Button onClick={fetchGallery} className="bg-white text-slate-900 hover:bg-slate-50 border border-slate-200">
               Try Again
             </Button>
          </div>
        ) : gallery ? (
          <GalleryForm gallery={gallery} />
        ) : null}
      </div>
    </div>
  );
}
