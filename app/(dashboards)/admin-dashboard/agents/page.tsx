// COMMENTED OUT: Field Agents page - functionality moved to Users page (/admin-dashboard/users)
// To restore, uncomment the original code below and remove the placeholder.

export default function DisabledPage() {
  return null;
}

/*  ===== ORIGINAL CODE (commented out) =====
// "use client";
// 
// import { useState, useEffect } from "react";
// import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import {
//   Search,
//   Plus,
//   Eye,
//   Edit,
//   UserX,
//   UserCircle,
//   ShieldAlert,
//   Settings2,
//   LogOut,
// } from "lucide-react";
// import Link from "next/link";
// import { agentService, AgentProfile } from "@/lib/services/agent-service";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";
// 
// interface AgentsData {
//   agents: AgentProfile[];
//   summary: {
//     total: number;
//     active: number;
//     inactive: number;
//   };
// }
// 
// const getStatusColor = (status: string) => {
//   return status?.toLowerCase() === "active"
//     ? "bg-green-100 text-green-700 hover:bg-green-200"
//     : "bg-red-100 text-red-700 hover:bg-red-200";
// };
// 
// export default function AgentsPage() {
//   const [agentsData, setAgentsData] = useState<AgentsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "active" | "inactive"
//   >("all");
// 
//   const handleDelete = async (id: number) => {
//     try {
//       const response = await agentService.deleteAgent(id);
//       if (response.success) {
//         toast.success("Agent deleted successfully");
//         // Update local state
//         if (agentsData) {
//           const updatedAgents = agentsData.agents.filter((a) => a.id !== id);
//           setAgentsData({
//             ...agentsData,
//             agents: updatedAgents,
//             summary: {
//               ...agentsData.summary,
//               total: agentsData.summary.total - 1,
//               active: updatedAgents.filter((a) => a.user.status === "active")
//                 .length,
//               inactive: updatedAgents.filter((a) => a.user.status !== "active")
//                 .length,
//             },
//           });
//         }
//       } else {
//         toast.error("Failed to delete agent", {
//           description: response.message,
//         });
//       }
//     } catch (error: any) {
//       toast.error("An error occurred", {
//         description: error.message || "Unknown error",
//       });
//     }
//   };
// 
//   useEffect(() => {
//     const fetchAgents = async () => {
//       try {
//         const response = await agentService.getAllAgents();
//         if (response.success && response.data.agents) {
//           const agents = response.data.agents;
// 
//           const summary = response.data.summary || {
//             total: agents.length,
//             active: agents.filter((a) => a.user?.status === "active").length,
//             inactive: agents.filter((a) => a.user?.status !== "active").length,
//           };
// 
//           setAgentsData({
//             agents,
//             summary,
//           });
//         }
//       } catch (err) {
//         setError("Failed to load agents data");
//         console.error("Error fetching agents:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
// 
//     fetchAgents();
//   }, []);
// 
//   const filteredAgents =
//     agentsData?.agents.filter((agent) => {
//       const matchesSearch =
//         agent.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         agent.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (agent.user.phone && agent.user.phone.includes(searchTerm));
// 
//       const matchesStatus =
//         statusFilter === "all" || agent.user.status === statusFilter;
// 
//       return matchesSearch && matchesStatus;
//     }) || [];
// 
//   if (loading) {
//     return (
//       <div className="flex flex-col h-full bg-slate-50">
//         <AdminHeader
//           title="Agent Management"
//           description="Manage all system agents"
//           roleAbbr="MP"
//           userName="Admin.Rock"
//           userRoleLabel="MP"
//           dropdownItems={[
//             {
//               label: "Profile Settings",
//               href: "/admin-dashboard/profile",
//               icon: UserCircle,
//             },
//             {
//               label: "Audit Logs",
//               href: "/admin-dashboard/audit",
//               icon: ShieldAlert,
//             },
//             {
//               label: "System Settings",
//               href: "/admin-dashboard/system-settings",
//               icon: Settings2,
//             },
//             {
//               label: "Logout",
//               icon: LogOut,
//               className: "text-red-600 focus:text-red-600 focus:bg-red-50",
//             },
//           ]}
//           actionButtons={[
//             {
//               label: "Add New Agent",
//               href: "/admin-dashboard/agents/new",
//               icon: Plus,
//               className: "bg-indigo-900 hover:bg-indigo-800 text-white",
//             },
//           ]}
//         />
// 
//         <div className="flex-1 p-6 space-y-6 overflow-y-auto">
//           <div className="max-w-[1600px] mx-auto space-y-6">
//             <Card className="p-4 bg-white">
//               <div className="animate-pulse space-y-4">
//                 <div className="h-6 bg-gray-200 rounded w-48"></div>
//                 <div className="h-4 bg-gray-200 rounded w-32"></div>
//               </div>
//             </Card>
//             <Card className="bg-white overflow-hidden">
//               <div className="animate-pulse">
//                 <div className="h-12 bg-gray-200 rounded mb-4"></div>
//                 <div className="space-y-3">
//                   {[1, 2, 3].map((i) => (
//                     <div key={i} className="h-16 bg-gray-200 rounded"></div>
//                   ))}
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     );
//   }
// 
//   if (error || !agentsData) {
//     return (
//       <div className="flex flex-col h-full bg-slate-50">
//         <AdminHeader
//           title="Agent Management"
//           description="Manage all system agents"
//           roleAbbr="MP"
//           userName="Admin.Rock"
//           userRoleLabel="MP"
//           dropdownItems={[
//             {
//               label: "Profile Settings",
//               href: "/admin-dashboard/profile",
//               icon: UserCircle,
//             },
//             {
//               label: "Audit Logs",
//               href: "/admin-dashboard/audit",
//               icon: ShieldAlert,
//             },
//             {
//               label: "System Settings",
//               href: "/admin-dashboard/system-settings",
//               icon: Settings2,
//             },
//             {
//               label: "Logout",
//               icon: LogOut,
//               className: "text-red-600 focus:text-red-600 focus:bg-red-50",
//             },
//           ]}
//           actionButtons={[
//             {
//               label: "Add New Agent",
//               href: "/admin-dashboard/agents/new",
//               icon: Plus,
//               className: "bg-indigo-900 hover:bg-indigo-800 text-white",
//             },
//           ]}
//         />
// 
//         <div className="flex-1 p-6 space-y-6 overflow-y-auto">
//           <div className="max-w-[1600px] mx-auto space-y-6">
//             <Card className="p-4 bg-white">
//               <div className="text-center text-red-600 py-8">
//                 {error || "No agents data available"}
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     );
//   }
// 
//   return (
//     <div className="flex flex-col h-full bg-slate-50">
//       <AdminHeader
//         title="Agent Management"
//         description="Manage all system agents"
//         roleAbbr="MP"
//         userName="Admin.Rock"
//         userRoleLabel="MP"
//         dropdownItems={[
//           {
//             label: "Profile Settings",
//             href: "/admin-dashboard/profile",
//             icon: UserCircle,
//           },
//           {
//             label: "Audit Logs",
//             href: "/admin-dashboard/audit",
//             icon: ShieldAlert,
//           },
//           {
//             label: "System Settings",
//             href: "/admin-dashboard/system-settings",
//             icon: Settings2,
//           },
//           {
//             label: "Logout",
//             icon: LogOut,
//             className: "text-red-600 focus:text-red-600 focus:bg-red-50",
//           },
//         ]}
//         actionButtons={[
//           {
//             label: "Add New Agent",
//             href: "/admin-dashboard/agents/new",
//             icon: Plus,
//             className: "bg-indigo-900 hover:bg-indigo-800 text-white",
//           },
//         ]}
//       />
// 
//       <div className="flex-1 p-6 space-y-6 overflow-y-auto">
//         <div className="max-w-[1600px] mx-auto space-y-6">
//           {/* Filters and Search */}
//           <Card className="p-4 bg-white">
//             <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
//               <div className="space-y-1">
//                 <h3 className="font-semibold text-gray-700">Agents</h3>
//                 <p className="text-sm text-gray-500">
//                   Total: {agentsData.summary.total} agents
//                 </p>
//               </div>
//               <div className="flex flex-1 w-full md:w-auto gap-3 items-center justify-end">
//                 <div className="relative w-full md:w-96">
//                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
//                   <Input
//                     placeholder="Search by name, email or phone..."
//                     className="pl-9 bg-gray-50 border-gray-200"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//                 <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className={
//                       statusFilter === "all"
//                         ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-800"
//                         : "hover:bg-gray-200 text-gray-600"
//                     }
//                     onClick={() => setStatusFilter("all")}
//                   >
//                     All ({agentsData.summary.total})
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className={
//                       statusFilter === "active"
//                         ? "bg-green-100 text-green-700 hover:bg-green-200"
//                         : "hover:bg-gray-200 text-gray-600"
//                     }
//                     onClick={() => setStatusFilter("active")}
//                   >
//                     Active ({agentsData.summary.active})
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className={
//                       statusFilter === "inactive"
//                         ? "bg-red-100 text-red-700 hover:bg-red-200"
//                         : "hover:bg-gray-200 text-gray-600"
//                     }
//                     onClick={() => setStatusFilter("inactive")}
//                   >
//                     Inactive ({agentsData.summary.inactive})
//                   </Button>
//                 </div>
//                 <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
//                   Search
//                 </Button>
//               </div>
//             </div>
//           </Card>
// 
//           {/* Agents Table */}
//           <Card className="bg-white overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm text-left">
//                 <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
//                   <tr>
//                     <th className="px-6 py-4">AGENT</th>
//                     <th className="px-6 py-4">LOCATION</th>
//                     <th className="px-6 py-4">STATUS</th>
//                     <th className="px-6 py-4 text-right">ACTIONS</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {filteredAgents.map((agent) => (
//                     <tr
//                       key={agent.id}
//                       className="hover:bg-gray-50/50 transition-colors group"
//                     >
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold overflow-hidden">
//                             {agent.profile_image ? (
//                               <img
//                                 src={agent.profile_image}
//                                 alt={agent.user.name}
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               <UserCircle className="w-6 h-6" />
//                             )}
//                           </div>
//                           <div className="flex flex-col">
//                             <span className="font-medium text-gray-900">
//                               {agent.user.name}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               {agent.user.email}
//                             </span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-gray-900">
//                           {agent.assigned_location || "Unassigned"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col gap-1">
//                           <Badge
//                             className={`${getStatusColor(agent.user.status)} border-none px-2 py-0.5 w-fit font-normal`}
//                           >
//                             {agent.user.status === "active"
//                               ? "Active"
//                               : "Inactive"}
//                           </Badge>
//                           <span className="text-xs text-gray-500">
//                             Code: {agent.agent_code}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center justify-end gap-2">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 bg-indigo-50"
//                             asChild
//                           >
//                             <Link href={`/admin-dashboard/agents/${agent.id}`}>
//                               <Eye className="w-4 h-4" />
//                             </Link>
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-blue-50"
//                             asChild
//                           >
//                             <Link
//                               href={`/admin-dashboard/agents/${agent.id}/edit`}
//                             >
//                               <Edit className="w-4 h-4" />
//                             </Link>
//                           </Button>
// 
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 bg-red-50"
//                               >
//                                 <UserX className="w-4 h-4" />
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>
//                                   Are you absolutely sure?
//                                 </AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   This action cannot be undone. This will
//                                   permanently delete the agent account and
//                                   remove their data from the servers.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   className="bg-red-600 hover:bg-red-700"
//                                   onClick={() => handleDelete(agent.id)}
//                                 >
//                                   Delete Agent
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
// 
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 bg-yellow-50"
//                           >
//                             <Settings2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
// 
===== END ORIGINAL CODE ===== */
