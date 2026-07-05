import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { AgentProfile } from "@/lib/services/agent-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AgentProfileCardProps {
  agent?: AgentProfile;
}

export function AgentProfileCard({ agent }: AgentProfileCardProps) {
  if (!agent) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center h-64 justify-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  const statusColors = {
    active:
      "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
    inactive: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200",
    suspended: "bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200",
    pending: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
  };

  const status = agent.user.status as keyof typeof statusColors;
  const statusClass = statusColors[status] || statusColors.inactive;

  return (
    <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
      <CardContent className="p-3 flex flex-col items-center text-center">
        <div className="relative mb-3">
          <Avatar className="h-16 w-16 border-2 border-slate-100 shadow-sm relative z-10">
            <AvatarImage
              src={agent.profile_image || undefined}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-xl font-bold">
              {agent.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white ${status === "active" ? "bg-emerald-500" : "bg-slate-300"} z-20 shadow-sm`}
          />
        </div>

        <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
          {agent.user.name}
        </h2>
        <div className="flex items-center gap-1.5 mt-0.5 mb-1.5">
          <span className="text-[9px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
            Agent
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {agent.agent_code}
          </span>
        </div>

        <Badge
          variant="outline"
          className={`${statusClass} mb-3.5 capitalize px-2 py-0 rounded-full text-[9px] font-bold border`}
        >
          {agent.user.status}
        </Badge>

        <div className="w-full space-y-2.5 text-xs text-left border-t border-slate-100 pt-3">
          <div className="group">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider mb-0.5">
              Email
            </span>
            <span className="font-semibold text-slate-700 break-all transition-colors">
              {agent.user.email}
            </span>
          </div>
          <div className="group">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider mb-0.5">
              Phone
            </span>
            <span className="font-semibold text-slate-700">
              {agent.user.phone || "No secure line"}
            </span>
          </div>
          <div className="group">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider mb-0.5">
              Assigned Location
            </span>
            <span className="font-semibold text-slate-700 flex items-center gap-1.5 transition-colors">
              {agent.assigned_location ? (
                <>
                  <MapPin className="h-3.5 w-3.5 text-amber-500" />{" "}
                  {agent.assigned_location}
                </>
              ) : (
                <span className="text-slate-300 font-medium">Unassigned</span>
              )}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50">
            <div>
              <span className="text-slate-400 block text-[9px] font-semibold uppercase tracking-wider mb-0.5">
                Enrollment
              </span>
              <span className="font-semibold text-slate-600 text-xs">
                {new Date(agent.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[9px] font-semibold uppercase tracking-wider mb-0.5">
                Last Active
              </span>
              <span className="font-semibold text-slate-600 text-xs">
                {agent.last_active_at
                  ? new Date(agent.last_active_at).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric" },
                    )
                  : "Never"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
