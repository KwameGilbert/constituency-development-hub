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
    <Card className="border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10 rounded-full scale-110" />
          <Avatar className="h-28 w-28 border-4 border-white shadow-xl relative z-10">
            <AvatarImage
              src={agent.profile_image || undefined}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-3xl font-bold">
              {agent.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-white ${status === "active" ? "bg-emerald-500" : "bg-slate-300"} z-20 shadow-sm`}
          />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
          {agent.user.name}
        </h2>
        <div className="flex items-center gap-2 mt-1 mb-4">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
            Operative
          </span>
          <span className="text-sm text-slate-400 font-mono">
            {agent.agent_code}
          </span>
        </div>

        <Badge
          variant="outline"
          className={`${statusClass} mb-8 capitalize px-4 py-1 rounded-full text-xs font-bold border`}
        >
          {agent.user.status}
        </Badge>

        <div className="w-full space-y-5 text-sm text-left border-t border-slate-100 pt-8">
          <div className="group">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-1 font-mono">
              Email Terminal
            </span>
            <span className="font-bold text-slate-700 break-all group-hover:text-indigo-600 transition-colors cursor-pointer">
              {agent.user.email}
            </span>
          </div>
          <div className="group">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-1 font-mono">
              Mobile Uplink
            </span>
            <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
              {agent.user.phone || "No secure line"}
            </span>
          </div>
          <div className="group">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-1 font-mono">
              Assigned Enclave
            </span>
            <span className="font-bold text-slate-700 flex items-center gap-2 group-hover:text-amber-600 transition-colors">
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
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
            <div>
              <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider mb-0.5 font-mono">
                Enrollment
              </span>
              <span className="font-bold text-slate-600 text-xs">
                {new Date(agent.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider mb-0.5 font-mono">
                Last Signal
              </span>
              <span className="font-bold text-slate-600 text-xs">
                {agent.last_active_at
                  ? new Date(agent.last_active_at).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric" },
                    )
                  : "No signals"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
