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
    active: "bg-green-100 text-green-700 hover:bg-green-100",
    inactive: "bg-red-100 text-red-700 hover:bg-red-100",
    suspended: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    pending: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  };

  const status = agent.user.status as keyof typeof statusColors;
  const statusClass = statusColors[status] || statusColors.inactive;

  return (
    <Card>
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <div className="mb-4">
            <Avatar className="h-24 w-24">
                <AvatarImage src={agent.profile_image || undefined} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {agent.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
        </div>
        
        <h2 className="text-xl font-bold text-[#1e1b4b]">{agent.user.name}</h2>
        <p className="text-muted-foreground text-sm mb-2">{agent.agent_code}</p>
        
        <Badge className={`${statusClass} mb-6 capitalize`}>
          {agent.user.status}
        </Badge>

        <div className="w-full space-y-3 text-sm text-left">
          <div>
            <span className="text-muted-foreground block text-xs">Email</span>
            <span className="font-medium break-all">{agent.user.email}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">
              Phone
            </span>
            <span className="font-medium">{agent.user.phone || "Not provided"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">
              Location
            </span>
            <span className="font-medium flex items-center gap-1">
                {agent.assigned_location ? (
                    <>
                        <MapPin className="h-3 w-3" /> {agent.assigned_location}
                    </>
                ) : "Not Assigned"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">Joined</span>
            <span className="font-medium">
                {new Date(agent.created_at).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">
              Last Active
            </span>
            <span className="font-medium">
                {agent.last_active_at 
                    ? new Date(agent.last_active_at).toLocaleString() 
                    : "Never"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
