import React from "react";
import { Plus, GripVertical, Edit, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const carouselItems = [
  {
    id: 1,
    title: "PARLIAMENT ACTIVITIES",
    link: "No link",
    date: "Jul 29, 2025",
    image: "/placeholder-carousel-1.jpg"
  },
  {
    id: 2,
    title: "PARLIAMENT ACTIVITIES",
    link: "No link",
    date: "Jul 29, 2025",
    image: "/placeholder-carousel-2.jpg"
  },
  {
    id: 3,
    title: "PARLIAMENT ACTIVITIES",
    link: "No link",
    date: "Jul 29, 2025",
    image: "/placeholder-carousel-3.jpg"
  },
  {
    id: 4,
    title: "THANK YOU TOUR",
    link: "No link",
    date: "Jul 29, 2025",
    image: "/placeholder-carousel-4.jpg"
  },
  {
    id: 5,
    title: "PARLIAMENT ACTIVITIES",
    link: "No link",
    date: "Jul 29, 2025",
    image: "/placeholder-carousel-5.jpg"
  },
  {
    id: 6,
    title: "TIME WITH GOD",
    link: "No link",
    date: "Jul 29, 2025",
    image: "/placeholder-carousel-6.jpg"
  }
];

export function CarouselList() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Homepage Carousel</h2>
          <p className="text-sm text-slate-500">Manage sliding images that appear on the homepage</p>
        </div>
        <Link href="/web-admin-dashboard/carousel/new">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Carousel Item
          </Button>
        </Link>
      </div>

      {/* Info Alert */}
      <div className="flex items-center gap-2 text-sm text-slate-600 px-2">
        <Info className="h-4 w-4 text-slate-400" />
        <span>Drag and drop items to change their display order on the homepage.</span>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {carouselItems.map((item) => (
            <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
              <div className="cursor-move text-slate-300 hover:text-slate-500">
                <GripVertical className="h-5 w-5" />
              </div>
              
              <div className="h-16 w-24 bg-slate-100 rounded-md overflow-hidden border border-slate-200 flex-shrink-0 relative">
                 {/* Placeholder for image */}
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400 text-xs">
                    Image
                 </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 uppercase truncate">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.link}</p>
                <p className="text-xs text-slate-400 mt-1">Added {item.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/web-admin-dashboard/carousel/${item.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
