"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import {
  Building,
  MapPin,
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
  Map as MapIcon,
  Loader2,
  Navigation,
  Globe,
  Plus,
  ArrowRight,
} from "lucide-react";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LocationHierarchy } from "@/components/admin-dashboard/LocationHierarchy";
import {
  locationsService,
  LocationDashboardStatsResponse,
} from "@/lib/services/locations-service";
import { toast } from "sonner";

export default function LocationsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<
    LocationDashboardStatsResponse["data"] | null
  >(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await locationsService.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        } else {
          toast.error("Process Failure: Location synchronization interrupted");
        }
      } catch (error) {
        console.error("Failed to fetch location stats:", error);
        toast.error("System synchronization failure");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Metrics Data derived from stats
  const metrics = [
    {
      label: "Strategic Registry",
      count: stats?.total || 0,
      icon: MapIcon,
      color: "text-amber-500",
      bgColor: "bg-slate-950",
      description: "Unified Entity Volume",
    },
    {
      label: "Primary Communities",
      count: stats?.counts?.community || 0,
      icon: Building,
      color: "text-slate-950",
      bgColor: "bg-amber-500",
      description: "Root Classifications",
    },
    {
      label: "Suburb Matrix",
      count: stats?.counts?.suburb || 0,
      icon: Navigation,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      description: "Operational Sub-Units",
    },
  ];

  // Manage Locations Data
  const manageLocations = [
    {
      title: "Communities Hub",
      description: "Synthesize root geographical clusters",
      icon: Globe,
      color: "bg-slate-950",
      border: "border-slate-100",
      href: "/admin-dashboard/locations/communities",
    },
    {
      title: "Suburb Oversight",
      description: "Manage high-resolution suburb data",
      icon: MapPin,
      color: "bg-amber-500 text-slate-950",
      border: "border-amber-100",
      href: "/admin-dashboard/locations/suburbs",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <AdminHeader
        title="Oversight Locations"
        description="Master geographical registry and strategic regional classification hub"
        roleAbbr="MP"
        dropdownItems={[
          {
            label: "Suburb Matrix",
            href: "/admin-dashboard/locations/suburbs",
            icon: MapPin,
          },
          {
             label: "System Settings",
             href: "/admin-dashboard/system-settings",
             icon: Settings2,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-500 font-bold",
          },
        ]}
        actionButtons={[
          {
            label: "CommunitiesRegistry",
            href: "/admin-dashboard/locations/communities",
            icon: Building,
            className: "bg-slate-950 text-white hover:bg-slate-800 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest",
          },
        ]}
      />

      <div className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto w-full">
         {/* Title Section Cluster */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
            <div>
              <h2 className="text-3xl font-bold text-slate-950 tracking-tight">
                Geography Console
              </h2>
              <p className="text-slate-500 font-medium text-sm mt-0.5">
                Targeting logistical efficiency across {stats?.total || 0} regional nodes
              </p>
            </div>
          </div>
        </div>

        {/* Strategic Metrics Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="border-none shadow-md shadow-slate-200/40 rounded-3xl bg-white overflow-hidden group transition-all hover:shadow-xl">
               <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {metric.label}
                  </p>
                  <h3 className="text-3xl font-black text-slate-950 tracking-tighter">
                    {loading ? (
                       <div className="h-8 w-16 bg-slate-50 animate-pulse rounded-lg" />
                    ) : (
                      metric.count
                    )}
                  </h3>
                   <p className="text-[10px] font-bold text-slate-400 group-hover:text-amber-600 transition-colors uppercase tracking-wider">{metric.description}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${metric.bgColor} ${metric.color} shadow-lg group-hover:scale-110`}>
                   <metric.icon className="w-6 h-6 stroke-[2.5px]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tactical Management Registry */}
          <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl bg-white overflow-hidden">
             <div className="p-8 pb-4 border-b border-slate-50">
               <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black text-slate-950 tracking-tight">Access Points</h3>
               </div>
             </div>
              <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {manageLocations.map((item, index) => (
                  <Link key={index} href={item.href} className="group">
                    <div className={`h-full relative overflow-hidden rounded-2xl border ${item.border} p-6 transition-all hover:shadow-xl hover:translate-y-[-4px] bg-slate-50/30`}>
                      <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                           <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-950 text-base">{item.title}</h4>
                          <p className="text-xs font-medium text-slate-400 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                           Open Registry <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
          </Card>

          {/* Verification Ledger */}
          <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl bg-white overflow-hidden">
             <div className="p-8 pb-4 border-b border-slate-50">
               <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                  <h3 className="text-lg font-black text-slate-950 tracking-tight">Contextual Log</h3>
               </div>
             </div>
             <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synthesizing geographical log...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-50">
                          <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[40%]">Entity Identification</TableHead>
                          <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Classification</TableHead>
                          <TableHead className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-slate-50">
                        {stats?.recent_locations && stats.recent_locations.length > 0 ? (
                          stats.recent_locations.map((location) => (
                            <TableRow key={location.id} className="hover:bg-slate-50/50 transition-colors group">
                              <TableCell className="px-6 py-5 font-bold text-slate-950 text-sm">{location.name}</TableCell>
                              <TableCell className="px-6 py-5">
                                <Badge className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border shadow-xs ${
                                    location.type === "suburb" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                    location.type === "community" ? "bg-slate-900 text-slate-50 border-slate-800" :
                                    location.type === "cottage" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                    "bg-indigo-50 text-indigo-700 border-indigo-100"
                                }`}>
                                  {location.type.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-6 py-5 text-right text-slate-400 font-bold text-xs uppercase tracking-tighter">
                                {location.formatted_date}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-16">
                               <div className="flex flex-col items-center gap-3">
                                  <MapPin className="w-10 h-10 text-slate-100" />
                                  <p className="text-slate-400 font-bold italic">Process outcome: Zero geographical entries matched.</p>
                               </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Global Topology Matrix */}
        <div className="w-full">
          <LocationHierarchy counts={stats?.counts} />
        </div>
      </div>
    </div>
  );
}
