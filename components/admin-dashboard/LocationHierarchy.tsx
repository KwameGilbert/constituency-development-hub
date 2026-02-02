import React from "react";
import Link from "next/link";
import { Building, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

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
      href: "/admin-dashboard/locations/communities",
      icon: Building,
      color: "bg-indigo-600",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-200",
      ringColor: "ring-indigo-100",
      linkText: "Manage Communities",
      align: "left",
    },
    {
      id: 2,
      title: "Suburbs",
      description: "Residential areas within communities",
      count: counts?.suburb || 0,
      countLabel: "suburbs",
      href: "/admin-dashboard/locations/suburbs",
      icon: MapPin,
      color: "bg-green-600",
      textColor: "text-green-600",
      borderColor: "border-green-200",
      ringColor: "ring-green-100",
      linkText: "Manage Suburbs",
      align: "right",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
      <h3 className="text-lg font-bold text-gray-900 mb-12">
        Location Hierarchy
      </h3>

      <div className="relative max-w-4xl mx-auto">
        {/* Vertical Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-indigo-100 -translate-x-1/2 rounded-full" />

        <div className="space-y-12">
          {steps.map((step) => (
            <div
              key={step.id}
              className="relative flex items-center justify-between"
            >
              {/* Left Side */}
              <div
                className={`flex-1 flex ${step.align === "left" ? "justify-end pr-12 text-right" : "justify-start pl-12"}`}
              >
                {step.align === "left" ? (
                  // Text Content on Left
                  <div className="space-y-2">
                    <h4 className={`text-xl font-bold ${step.textColor}`}>
                      {step.title}
                    </h4>
                    <p className="text-gray-500 max-w-xs ml-auto">
                      {step.description}
                    </p>
                    <Link
                      href={step.href}
                      className={`inline-flex items-center text-sm font-medium ${step.textColor} hover:underline mt-2`}
                    >
                      {step.linkText} <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                ) : (
                  // Status/Count on Left (for Right aligned steps)
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2
                      className={`w-5 h-5 ${step.textColor.replace("text-", "text-emerald-500") /* Status icon is green in mock usually, but let's stick to theme or default green success if implies valid */} text-green-500`}
                    />
                    <span className="font-medium text-gray-600">
                      {step.count} {step.countLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Center Node */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm
                    ${step.color} ring-4 ring-white
                `}
                >
                  {step.id}
                </div>
              </div>

              {/* Right Side */}
              <div
                className={`flex-1 flex ${step.align === "left" ? "justify-start pl-12" : "justify-end pr-12 text-right"}`}
              >
                {step.align === "left" ? (
                  // Status on Right (for Left aligned steps)
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-600">
                      {step.count} {step.countLabel}
                    </span>
                  </div>
                ) : (
                  // Text Content on Right (for Right aligned steps)
                  <div className="space-y-2">
                    <h4 className={`text-xl font-bold ${step.textColor}`}>
                      {step.title}
                    </h4>
                    <p className="text-gray-500 max-w-xs ml-auto">
                      {step.description}
                    </p>
                    <Link
                      href={step.href}
                      className={`inline-flex items-center text-sm font-medium ${step.textColor} hover:underline mt-2`}
                    >
                      {step.linkText} <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
