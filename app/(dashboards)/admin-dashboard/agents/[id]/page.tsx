// COMMENTED OUT: Field Agents page - functionality moved to Users page (/admin-dashboard/users)
// To restore, uncomment the original code below and remove the placeholder.

export default function DisabledPage() {
  return null;
}

/*  ===== ORIGINAL CODE (commented out) =====
// "use client";
// 
// import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Pencil,
//   UserCircle,
//   ShieldAlert,
//   Settings2,
//   LogOut,
//   Mail,
//   Phone,
//   Calendar,
//   Clock,
//   User,
//   Eye,
// } from "lucide-react";
// import { use, useEffect, useState } from "react";
// import { agentService, AgentProfile } from "@/lib/services/agent-service";
// import { toast } from "sonner";
// import Link from "next/link";
// 
// export default function AgentDetailsPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = use(params);
//   const [agent, setAgent] = useState<AgentProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
// 
//   const handleVerify = async () => {
//     if (!agent) return;
//     try {
//       const response = await agentService.verifyAgent(agent.id);
//       if (response.success) {
//         toast.success("Agent verified successfully");
//         setAgent((prev) =>
//           prev ? { ...prev, user: { ...prev.user, status: "active" } } : null,
//         );
//       } else {
//         toast.error("Failed to verify agent");
//       }
//     } catch (error) {
//       toast.error("An error occurred during verification");
//     }
//   };
// 
//   useEffect(() => {
//     const fetchAgent = async () => {
//       try {
//         const response = await agentService.getAgentById(parseInt(id));
//         if (response.success && response.data.agent) {
//           setAgent(response.data.agent);
//         } else {
//           setError("Failed to fetch agent details");
//         }
//       } catch (err) {
//         setError("An error occurred while fetching agent details");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
// 
//     if (id) {
//       fetchAgent();
//     }
//   }, [id]);
// 
//   if (loading) {
//     return <div className="p-8">Loading agent details...</div>;
//   }
// 
//   if (error || !agent) {
//     return (
//       <div className="p-8 text-red-500">
//         Error: {error || "Agent not found"}
//       </div>
//     );
//   }
// 
//   return (
//     <div className="flex flex-col h-full bg-slate-50">
//       <AdminHeader
//         title="Agent Details"
//         description="View agent information and activity"
//         roleAbbr="MP"
//         userName="Admin.Rock"
//         userRoleLabel="MP"
//         dropdownItems={[
//           {
//             label: "Profile Settings",
//             icon: UserCircle,
//             href: "/admin-dashboard/profile",
//           },
//           {
//             label: "Audit Logs",
//             icon: ShieldAlert,
//             href: "/admin-dashboard/audit",
//           },
//           {
//             label: "System Settings",
//             icon: Settings2,
//             href: "/admin-dashboard/system-settings",
//           },
//           {
//             label: "Logout",
//             icon: LogOut,
//             href: "#",
//             className: "text-red-600 hover:text-red-700 hover:bg-red-50",
//           },
//         ]}
//         actionButtons={[
//           {
//             label: "Edit Agent",
//             href: `/admin-dashboard/agents/${id}/edit`,
//             icon: Pencil,
//             className: "bg-blue-600 hover:bg-blue-700 text-white",
//           },
//         ]}
//       />
//       <div className="flex-1 p-6 space-y-6 overflow-y-auto">
//         <div className="max-w-[1600px] mx-auto space-y-6">
// ...existing code...
//                 <div className="flex-1">
//                   <div className="flex items-start gap-4">
//                     <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 overflow-hidden">
//                       {agent.profile_image ? (
//                         <img
//                           src={agent.profile_image}
//                           alt={agent.user.name}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <User className="w-8 h-8" />
//                       )}
//                     </div>
//                     <div className="space-y-1">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {agent.user.name}
//                       </h2>
//                       <p className="text-gray-500">{agent.user.email}</p>
//                       <div className="flex gap-2 pt-1 items-center">
//                         <Badge
//                           variant="secondary"
//                           className={`text-xs ${agent.user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
//                         >
//                           {agent.user.status}
//                         </Badge>
//                         <Badge
//                           variant="outline"
//                           className="text-gray-500 border-gray-200"
//                         >
//                           Agent
//                         </Badge>
//                         <Badge
//                           variant="outline"
//                           className="text-blue-500 border-blue-200"
//                         >
//                           {agent.agent_code}
//                         </Badge>
//                         {agent.user.status !== "active" && (
//                           <Button
//                             size="sm"
//                             variant="default"
//                             onClick={handleVerify}
//                             className="h-6 text-xs px-2 bg-green-600 hover:bg-green-700 ml-2"
//                           >
//                             Verify Agent
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
// 
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-8 border-t border-gray-100">
//                 {/* Contact Information */}
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-gray-900">
//                     Contact Information
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-3 text-sm">
//                       <Mail className="w-4 h-4 text-gray-400" />
//                       <span className="text-gray-700">{agent.user.email}</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-sm">
//                       <Phone className="w-4 h-4 text-gray-400" />
//                       <span
//                         className={
//                           agent.user.phone
//                             ? "text-gray-700"
//                             : "text-gray-400 italic"
//                         }
//                       >
//                         {agent.user.phone || "No phone number"}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-3 text-sm">
//                       <Calendar className="w-4 h-4 text-gray-400" />
//                       <span className="text-gray-700">
//                         Joined {new Date(agent.created_at).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
// 
//                 {/* Location Assignment */}
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-gray-900">
//                     Location Assignment
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="text-sm text-gray-700">
//                       {agent.assigned_location ? (
//                         <div className="flex flex-col gap-1">
//                           <span className="font-medium">
//                             {agent.assigned_location}
//                           </span>
//                           {agent.assigned_communities && (
//                             <span className="text-xs text-gray-500">
//                               Communities: {agent.assigned_communities}
//                             </span>
//                           )}
//                         </div>
//                       ) : (
//                         <span className="italic text-gray-500">
//                           No location assigned
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
// 
//                 {/* Activity Statistics */}
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-gray-900">
//                     Activity Statistics
//                   </h3>
//                   {/* Assuming stats might come with agent data or separate call. 
//                                 For now displaying placeholder or real stats if added to AgentProfile interface */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="text-center p-3">
//                       <div className="text-2xl font-bold text-indigo-600">
//                         -
//                       </div>
//                       <div className="text-xs text-gray-500">Total Issues</div>
//                     </div>
//                     <div className="text-center p-3">
//                       <div className="text-2xl font-bold text-green-600">-</div>
//                       <div className="text-xs text-gray-500">Resolved</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
// 
//           {/* Recent Issues Managed - Could be a separate component fetching issues by this agent */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base font-semibold">
//                 Recent Issues
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-sm text-gray-500 italic p-4 text-center">
//                 Issues list integration pending...
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
// 
===== END ORIGINAL CODE ===== */