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
    <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <CardTitle className="text-xs font-semibold text-slate-700">
          Agent Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2.5 space-y-1.5">
        <Link href={`/officer-dashboard/agents/${agentId}/edit`}>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-8 rounded-md border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all font-medium text-[11px]"
          >
            <div className="p-0.5 bg-indigo-50 text-indigo-600 rounded">
              <Edit className="h-3.5 w-3.5" />
            </div>
            Edit Agent Profile
          </Button>
        </Link>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-8 rounded-md border-rose-100 text-rose-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 transition-all font-medium text-[11px]"
            >
              <div className="p-0.5 bg-rose-50 text-rose-600 rounded">
                <UserX className="h-3.5 w-3.5" />
              </div>
              Deactivate Agent
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-xl border-slate-200 max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-bold text-slate-900">
                Deactivate Field Agent
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 text-xs leading-normal">
                Are you sure you want to deactivate this agent? They will lose access to field tools immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 mt-2">
              <AlertDialogCancel
                disabled={loading}
                className="rounded-lg font-medium border-slate-200 text-xs h-9 px-4"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeactivate();
                }}
                disabled={loading}
                className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600 text-white font-medium rounded-lg text-xs h-9 px-4 border-0 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Deactivating...
                  </>
                ) : (
                  "Deactivate"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Link
          href={`/officer-dashboard/issues?submitted_by_agent_id=${agentId}`}
        >
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-8 rounded-md border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-100 transition-all font-medium text-[11px]"
          >
            <div className="p-0.5 bg-amber-50 text-amber-600 rounded">
              <List className="h-3.5 w-3.5" />
            </div>
            View Submitted Reports
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
