"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import {
  officerReportsService,
  AgentPerformance,
} from "@/lib/services/officer-reports-service";

export function TopAgentPerformance() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<AgentPerformance[]>([]);

  useEffect(() => {
    async function fetchAgentPerformance() {
      try {
        const response = await officerReportsService.getAgentPerformance(10);
        if (response.success) {
          setAgents(response.data.agents);
        }
      } catch (error) {
        console.error("Failed to fetch agent performance:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAgentPerformance();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-[#1e1b4b]">
          Top Agent Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : agents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No agent data available
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">
                  Agent
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">
                  Issues Submitted
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">
                  Resolved
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">
                  Resolution Rate
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">
                  Avg Resolution Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium text-[#1e1b4b]">
                    {agent.name}
                  </TableCell>
                  <TableCell>{agent.issues_submitted}</TableCell>
                  <TableCell>{agent.issues_resolved}</TableCell>
                  <TableCell>{agent.resolution_rate}%</TableCell>
                  <TableCell>{agent.avg_resolution_time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
