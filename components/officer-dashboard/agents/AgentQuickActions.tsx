"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, UserX, List, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { agentService } from "@/lib/services/agent-service";
import { toast } from "sonner";

export function AgentQuickActions({ agentId = "1" }: { agentId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDeactivate = async () => {
    try {
      setLoading(true);
      if (!agentId) return;
      
      const response = await agentService.deactivateAgent(parseInt(agentId));
      
      if (response.success) {
        toast.success("Agent deactivated successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(response.message || "Failed to deactivate agent");
      }
    } catch (error) {
      console.error("Deactivation error:", error);
      toast.error("An error occurred while deactivating the agent");
    } finally {
      setLoading(false);
    }
  };

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
        
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <UserX className="h-4 w-4" />
              Deactivate Agent
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will deactivate the agent&apos;s account. They will no longer be able to log in or submit reports.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeactivate();
                }}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
              >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deactivating...
                    </>
                ) : (
                    "Deactivate"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Link href={`/officer-dashboard/issues?submitted_by_agent_id=${agentId}`}>
            <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-blue-200"
            >
            <List className="h-4 w-4" />
            View All Issues
            </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
