"use client";

import React from "react";
import Link from "next/link";
import { Building, MapPin, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LocationHierarchyProps {
  counts?: {
    community: number;
    suburb: number;
  };
}

export function LocationHierarchy({ counts }: LocationHierarchyProps) {
  const steps = [
    {
      id: 1,
      title: "Communities",
      description: "Main geographical areas in the constituency",
      count: counts?.community || 0,
      countLabel: "communities",
      href: "/admin-dashboard/locations",
      icon: Building,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      iconColor: "text-slate-950",
      align: "left",
    },
    {
      id: 2,
      title: "Suburbs",
      description: "Residential areas within communities",
      count: counts?.suburb || 0,
      countLabel: "suburbs",
      href: "/admin-dashboard/locations",
      icon: MapPin,
      color: "bg-slate-900",
      textColor: "text-slate-600",
      iconColor: "text-amber-500",
      align: "right",
    },
  ];

  return (
    <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm p-8">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-8 bg-amber-500 rounded-full" />
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
          Location Structure
        </h3>
      </div>

      <div className="relative max-w-4xl mx-auto py-4">
        {/* Connection Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-100 -translate-x-1/2 rounded-full" />

        <div className="space-y-16">
          {steps.map((step) => (
            <div
              key={step.id}
              className="relative flex items-center justify-between"
            >
              {/* Left Content */}
              <div
                className={`flex-1 flex ${step.align === "left" ? "justify-end pr-14 text-right" : "justify-start pl-14"}`}
              >
                {step.align === "left" ? (
                  <div className="space-y-1 group">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-[200px] ml-auto font-medium leading-relaxed">
                      {step.description}
                    </p>
                    <Link
                      href={step.href}
                      className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 mt-2 bg-amber-50 px-2.5 py-1 rounded-full transition-all"
                    >
                      Configure <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-600 tracking-tight">
                      {step.count.toLocaleString()} {step.countLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Central Pillar */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                <div
                  className={`
                    w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110
                    ${step.color} ${step.iconColor} ring-4 ring-white
                `}
                >
                  <step.icon className="w-5 h-5 stroke-[2.5px]" />
                </div>
              </div>

              {/* Right Content */}
              <div
                className={`flex-1 flex ${step.align === "left" ? "justify-start pl-14" : "justify-end pr-14 text-right"}`}
              >
                {step.align === "left" ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-600 tracking-tight">
                      {step.count.toLocaleString()} {step.countLabel}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1 group">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-[200px] font-medium leading-relaxed">
                      {step.description}
                    </p>
                    <Link
                      href={step.href}
                      className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 mt-2 bg-amber-50 px-2.5 py-1 rounded-full transition-all"
                    >
                      Configure <ChevronRight className="w-3 h-3 ml-1 text-amber-500" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
