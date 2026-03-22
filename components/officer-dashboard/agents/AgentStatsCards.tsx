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
      label: "Total Dispatch",
      value: stats?.total ?? 0,
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
    },
    {
      label: "Active Review",
      value: stats?.pending ?? 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
    },
    {
      label: "Mission Success",
      value: stats?.resolved ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
    },
    {
      label: "Failed Ops",
      value: stats?.rejected ?? 0,
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className={`border-slate-200/60 shadow-lg shadow-slate-200/40 rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 group`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div
                className={`p-3 rounded-2xl ${card.bgColor} ${card.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <card.icon className="h-6 w-6" />
              </div>
              <div className="text-center space-y-1">
                <h3
                  className={`text-3xl font-black ${card.color} tracking-tighter`}
                >
                  {card.value.toLocaleString()}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
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
