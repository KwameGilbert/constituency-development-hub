"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronUp,
  RotateCcw,
  Search,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { agentService, AgentProfile } from "@/lib/services/agent-service";
import { toast } from "sonner";

export function AllAgents() {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedVerified, setSelectedVerified] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const params: { location?: string; verified?: boolean } = {};
      if (selectedLocation !== "all") params.location = selectedLocation;
      if (selectedVerified !== "all")
        params.verified = selectedVerified === "verified";

      const response = await agentService.getAllAgents(params);
      if (response.success && response.data.agents) {
        let filteredAgents = response.data.agents;

        // Client-side search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredAgents = filteredAgents.filter(
            (agent) =>
              agent.user?.name?.toLowerCase().includes(query) ||
              agent.user?.email?.toLowerCase().includes(query) ||
              agent.agent_code?.toLowerCase().includes(query),
          );
        }

        setAgents(filteredAgents);
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  }, [selectedLocation, selectedVerified, searchQuery]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedLocation("all");
    setSelectedVerified("all");
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const response = await agentService.deleteAgent(id);
      if (response.success) {
        toast.success("Agent deleted successfully");
        fetchAgents();
      } else {
        toast.error(response.message || "Failed to delete agent");
      }
    } catch (error) {
      console.error("Failed to delete agent:", error);
      toast.error("Failed to delete agent");
    } finally {
      setDeletingId(null);
    }
  }

  function getStatusBadge(status: string) {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-700 hover:bg-green-100",
      pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      inactive: "bg-gray-100 text-gray-700 hover:bg-gray-100",
      suspended: "bg-red-100 text-red-700 hover:bg-red-100",
    };
    return colors[status?.toLowerCase()] || colors.pending;
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold leading-none tracking-tight">
            Filter Agents
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowFilters(!showFilters)}
          >
            <ChevronUp
              className={`h-4 w-4 transition-transform ${!showFilters ? "rotate-180" : ""}`}
            />
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Search</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name, email, or agent code..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchAgents()}
                />
                <Button onClick={() => fetchAgents()} className="gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Verification Status
                </label>
                <Select
                  value={selectedVerified}
                  onValueChange={setSelectedVerified}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleResetFilters}
              >
                <RotateCcw className="h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="ml-3 text-gray-500">Loading agents...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No agents found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="text-sm">
                  <TableHead>AGENT</TableHead>
                  <TableHead>CONTACT INFO</TableHead>
                  <TableHead>AGENT CODE</TableHead>
                  <TableHead>LOCATION</TableHead>
                  <TableHead>REPORTS</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>VERIFIED</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-indigo-100 text-indigo-600">
                          <AvatarImage src={agent.profile_image || undefined} />
                          <AvatarFallback>
                            {agent.user?.name?.charAt(0) || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {agent.user?.name || "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{agent.user?.email}</span>
                        <span className="text-muted-foreground">
                          {agent.user?.phone || "No phone"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {agent.agent_code}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {agent.assigned_location || "Not Assigned"}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {agent.reports_submitted || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusBadge(agent.user?.status || "pending")} border-0`}
                      >
                        {agent.user?.status || "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          agent.id_verified
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {agent.id_verified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/officer-dashboard/agents/${agent.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link
                          href={`/officer-dashboard/agents/${agent.id}/edit`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                {agent.user?.name}? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(agent.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deletingId === agent.id}
                              >
                                {deletingId === agent.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
