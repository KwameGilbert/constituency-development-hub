import React from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { CarouselForm } from "@/components/web-admin-dashboard/carousel/CarouselForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddCarouselItemPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <WebAdminHeader title="Add Carousel Item" />
      <div className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link href="/web-admin-dashboard/carousel">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add New Carousel Item</h1>
            <p className="text-slate-500">Add a new image to the homepage carousel slideshow</p>
          </div>
        </div>
        
        <CarouselForm />
      </div>
    </div>
  );
}
