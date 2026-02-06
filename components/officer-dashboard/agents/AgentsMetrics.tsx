"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, FileText } from "lucide-react";
import { agentService } from "@/lib/services/agent-service";

export function AgentsMetrics() {
  const [stats, setStats] = useState({
    total_agents: 0,
    active_agents: 0,
    inactive_agents: 0,
    issues_handled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await agentService.getStatistics();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch agent stats:", error);
        // Silently fail or minimal toast, as metrics failing shouldn't block the page
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Agents */}
      <Card>
        <CardContent className="px-3 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Agents
            </p>
            <h3 className="text-2xl font-bold text-[#1e1b4b]">
              {loading ? "-" : stats.total_agents}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Active Agents */}
      <Card>
        <CardContent className="px-3 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg text-green-600">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Active Agents
            </p>
            <h3 className="text-2xl font-bold text-[#1e1b4b]">
              {loading ? "-" : stats.active_agents}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Inactive Agents */}
      <Card>
        <CardContent className="px-3 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg text-red-600">
            <UserX className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Inactive Agents
            </p>
            <h3 className="text-2xl font-bold text-[#1e1b4b]">
              {loading ? "-" : stats.inactive_agents}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Issues Handled */}
      <Card>
        <CardContent className="px-3 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Issues Handled
            </p>
            <h3 className="text-2xl font-bold text-[#1e1b4b]">
              {loading ? "-" : stats.issues_handled}
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
