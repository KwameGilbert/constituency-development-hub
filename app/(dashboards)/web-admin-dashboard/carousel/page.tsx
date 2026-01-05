import React from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { CarouselList } from "@/components/web-admin-dashboard/carousel/CarouselList";

export default function ManageCarouselPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <WebAdminHeader title="Carousel Management" />
      <div className="flex-1 p-8 space-y-8 mx-auto w-full">
        <CarouselList />
      </div>
    </div>
  );
}
