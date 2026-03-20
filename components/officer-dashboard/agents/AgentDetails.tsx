"use client";

import React, { useEffect, useState } from "react";
import { AgentProfileCard } from "./AgentProfileCard";
import { AgentQuickActions } from "./AgentQuickActions";
import { AgentStatsCards } from "./AgentStatsCards";
import { AgentStatusDistribution } from "./AgentStatusDistribution";
import { AgentRecentIssues } from "./AgentRecentIssues";
import { 
    agentService, 
    AgentProfile, 
    AgentStatistics, 
    RecentIssue 
} from "@/lib/services/agent-service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AgentDetails({ agentId = "1" }: { agentId?: string }) {
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [stats, setStats] = useState<AgentStatistics | null>(null);
  const [recentIssues, setRecentIssues] = useState<RecentIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgent() {
      try {
        if (!agentId) return;
        const response = await agentService.getAgentById(parseInt(agentId));
        if (response.success && response.data.agent) {
          setAgent(response.data.agent);
          setStats(response.data.issue_stats || null);
          setRecentIssues(response.data.recent_issues || []);
        } else {
            toast.error("Failed to fetch agent details");
        }
      } catch (error) {
        console.error("Error fetching agent:", error);
        toast.error("An error occurred while loading agent details");
      } finally {
        setLoading(false);
      }
    }

    fetchAgent();
  }, [agentId]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading agent details...</span>
        </div>
    );
  }

  if (!agent) {
      return (
          <div className="flex items-center justify-center h-96">
              <p className="text-muted-foreground">Agent not found</p>
          </div>
      );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">Mission Profile</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Operative Intelligence</h2>
          <p className="text-sm text-slate-500 font-medium">Detailed performance telemetry and field credentials für <span className="text-indigo-600 font-bold">{agent.user.name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile and Actions */}
        <div className="space-y-8">
          <AgentProfileCard agent={agent} />
          <AgentQuickActions agentId={agentId} />
        </div>

        {/* Right Column: Stats, Charts, Issues */}
        <div className="lg:col-span-2 space-y-8">
          <AgentStatsCards stats={{
              total: agent.reports_submitted,
              pending: stats?.pending || 0,
              resolved: stats?.resolved || 0,
              rejected: stats?.rejected || 0
          }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AgentStatusDistribution stats={stats} />
            <AgentRecentIssues issues={recentIssues} />
          </div>
        </div>
      </div>
    </div>
  );
}
