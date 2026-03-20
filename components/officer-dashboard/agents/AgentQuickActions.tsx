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
    <Card className="border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 pb-4">
        <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest pl-1 font-mono">
          Command Center
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-3">
        <Link href={`/officer-dashboard/agents/${agentId}/edit`}>
          <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-2xl border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all font-bold">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100">
              <Edit className="h-4 w-4" />
            </div>
            Update Agent Credentials
          </Button>
        </Link>
        
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 rounded-2xl border-rose-100 text-rose-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 transition-all font-bold"
            >
              <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-100">
                <UserX className="h-4 w-4" />
              </div>
              Revoke Access
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl border-slate-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-slate-900">Security Authorization Required</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 font-medium">
                This action will decommission the agent&apos;s operative status. They will lose all access to the constituency infrastructure immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel disabled={loading} className="rounded-xl font-bold border-slate-200">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeactivate();
                }}
                disabled={loading}
                className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600 text-white font-bold rounded-xl px-6"
              >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    "Confirm Deactivation"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Link href={`/officer-dashboard/issues?submitted_by_agent_id=${agentId}`}>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 rounded-2xl border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-100 transition-all font-bold"
            >
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100">
                <List className="h-4 w-4" />
              </div>
              Mission Intelligence
            </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
