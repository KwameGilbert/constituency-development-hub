import React from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { ArrowLeft, Calendar, MapPin, Clock, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function ViewEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <WebAdminHeader title="View Event" />
      <div className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/web-admin-dashboard/events">
              <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Event Details</h1>
              <p className="text-slate-500">View information about this event</p>
            </div>
          </div>
          <Link href={`/web-admin-dashboard/events/${id}/edit`}>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-64 w-full bg-slate-100 relative">
                 {/* Placeholder for event image */}
                 <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    No Image Available
                 </div>
            </div>
            <div className="p-8 space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Community Health Fair</h2>
                    <p className="text-slate-500 mt-2">Hosted by the Constituency Health Committee</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Date</p>
                            <p className="text-slate-900 font-medium">Oct 15, 2025</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-50 rounded-lg">
                            <Clock className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Time</p>
                            <p className="text-slate-900 font-medium">09:00 AM - 04:00 PM</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-50 rounded-lg">
                            <MapPin className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Location</p>
                            <p className="text-slate-900 font-medium">Community Center, Main Hall</p>
                        </div>
                    </div>
                </div>

                <div className="prose max-w-none text-slate-600">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">About this Event</h3>
                    <p>
                        Join us for a day of health and wellness! The Community Health Fair will feature free health screenings, 
                        educational workshops, and fitness demonstrations. Meet local healthcare providers and learn about 
                        resources available in our constituency.
                    </p>
                    <p className="mt-4">
                        Activities include:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Blood pressure and glucose screenings</li>
                            <li>Nutrition counseling</li>
                            <li>Mental health awareness sessions</li>
                            <li>Yoga and aerobics classes</li>
                        </ul>
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
