import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, UserX, List } from "lucide-react";

export function AgentQuickActions({ agentId = "1" }: { agentId?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link href={`/officer-dashboard/agents/${agentId}/edit`}>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Edit className="h-4 w-4" />
            Edit Agent Details
          </Button>
        </Link>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <UserX className="h-4 w-4" />
          Deactivate Agent
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-blue-200"
        >
          <List className="h-4 w-4" />
          View All Issues
        </Button>
      </CardContent>
    </Card>
  );
}
