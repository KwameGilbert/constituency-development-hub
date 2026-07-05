import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AgentStatsCardsProps {
  stats?: {
    total: number;
    pending: number;
    resolved: number;
    rejected: number;
  };
}

import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";

export function AgentStatsCards({ stats }: AgentStatsCardsProps) {
  const cards = [
    {
      label: "Total Reports",
      value: stats?.total ?? 0,
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
    },
    {
      label: "Resolved",
      value: stats?.resolved ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
    },
    {
      label: "Rejected",
      value: stats?.rejected ?? 0,
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className={`border border-slate-100 shadow-sm rounded-xl overflow-hidden bg-white hover:shadow-md transition-all duration-300 group`}
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center gap-3">
              <div
                className={`p-2 rounded-xl ${card.bgColor} ${card.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <card.icon className="h-5 w-5" />
              </div>
              <div className="text-center space-y-0.5">
                <h3
                  className={`text-2xl font-bold text-slate-900 tracking-tight`}
                >
                  {card.value.toLocaleString()}
                </h3>
                <p className="text-xs font-semibold text-slate-950">
                  {card.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
