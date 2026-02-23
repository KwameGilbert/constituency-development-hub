// COMMENTED OUT: Field Agents page - functionality moved to Users page (/admin-dashboard/users)
// To restore, uncomment the original code below and remove the placeholder.

export default function DisabledPage() {
  return null;
}

/*  ===== ORIGINAL CODE (commented out) =====
// "use client";
// 
// import { useState, useEffect, use } from "react";
// import { useRouter } from "next/navigation";
// import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   ArrowLeft,
//   UserCircle,
//   ShieldAlert,
//   Settings2,
//   LogOut,
//   Eye,
//   Key,
// } from "lucide-react";
// import Link from "next/link";
// import { agentService } from "@/lib/services/agent-service";
// import { locationsService, Location } from "@/lib/services/locations-service";
// import { toast } from "sonner";
// 
// export default function EditAgentPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = use(params);
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [locations, setLocations] = useState<Location[]>([]);
// 
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     status: "",
//     mainCommunity: "",
//     smallerCommunity: "",
//     suburb: "",
//     cottage: "",
//   });
// 
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [agentRes, locationsRes] = await Promise.all([
//           agentService.getAgentById(parseInt(id)),
//           locationsService.getLocations({ limit: 100 }),
//         ]);
// 
//         if (locationsRes.success && locationsRes.data) {
//           setLocations(locationsRes.data.locations);
//         }
// 
//         if (agentRes.success && agentRes.data.agent) {
//           const agent = agentRes.data.agent;
//           setFormData({
//             name: agent.user.name,
//             email: agent.user.email,
//             phone: agent.user.phone || "",
//             status: agent.user.status,
//             mainCommunity: agent.assigned_location || "", // Simplified mapping
//             smallerCommunity: agent.assigned_communities || "",
//             suburb: "",
//             cottage: "",
//           });
//         } else {
//           toast.error("Error", {
//             description: "Failed to fetch agent details",
//           });
//         }
//       } catch (error) {
//         console.error("Failed to load data", error);
//         toast.error("Error", {
//           description: "An unexpected error occurred while loading data",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
// 
//     if (id) {
//       fetchData();
//     }
//   }, [id]);
// 
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };
// 
//   const handleSelectChange = (key: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };
// 
//   const handleSubmit = async () => {
//     setSaving(true);
//     try {
//       // Prepare update payload
//       const payload = {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         status: formData.status,
//         assigned_location: formData.mainCommunity,
//         assigned_communities: formData.smallerCommunity,
//       };
// 
//       const response = await agentService.updateAgent(parseInt(id), payload);
// 
//       if (response.success) {
//         toast.success("Success", { description: "Agent updated successfully" });
//         router.push("/admin-dashboard/agents");
//       } else {
//         toast.error("Error", {
//           description: response.message || "Failed to update agent",
//         });
//       }
//     } catch (error: any) {
//       toast.error("Error", {
//         description: error.message || "An unexpected error occurred",
//       });
//     } finally {
//       setSaving(false);
//     }
//   };
// 
//   if (loading) {
//     return <div className="p-8">Loading...</div>;
//   }
// 
//   return (
//     <div className="flex flex-col h-full bg-slate-50">
//       <AdminHeader
//         title="Edit Agent"
//         description="Update agent information"
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
//             label: "View Agent",
//             href: `/admin-dashboard/agents/${id}`,
//             icon: Eye,
//             className: "bg-indigo-600 hover:bg-indigo-700 text-white",
//           },
//         ]}
//       />
//       <div className="flex-1 p-6 space-y-6 overflow-y-auto">
//         <div className="max-w-4xl mx-auto">
//           <Card className="border-t-4 border-t-red-900 border-none shadow-sm">
//             <CardContent className="space-y-8 pt-6 p-8">
// ...existing code...
//                     <Input
//                       id="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       placeholder="Enter agent name"
//                       className="bg-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-gray-700">
//                       Email Address <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="Enter email address"
//                       className="bg-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="phone" className="text-gray-700">
//                       Phone Number <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       id="phone"
//                       type="tel"
//                       inputMode="numeric"
//                       value={formData.phone}
//                       onChange={(e) => {
//                         const filtered = e.target.value.replace(/[^0-9+]/g, '');
//                         setFormData((prev) => ({ ...prev, phone: filtered }));
//                       }}
//                       placeholder="Enter phone number"
//                       className="bg-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="status" className="text-gray-700">
//                       Status <span className="text-red-500">*</span>
//                     </Label>
//                     <Select
//                       value={formData.status}
//                       onValueChange={(val) => handleSelectChange("status", val)}
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Select Status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="active">Active</SelectItem>
//                         <SelectItem value="inactive">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>
// 
//               {/* Location Assignment */}
//               <div className="space-y-4">
//                 <h3 className="text-gray-900 font-semibold text-lg border-b border-gray-100 pb-2">
//                   Location Assignment
//                 </h3>
// 
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="mainCommunity" className="text-gray-700">
//                       Main Community <span className="text-red-500">*</span>
//                     </Label>
//                     <Select
//                       value={formData.mainCommunity}
//                       onValueChange={(val) =>
//                         handleSelectChange("mainCommunity", val)
//                       }
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Select Main Community" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {locations.map((loc) => (
//                           <SelectItem key={loc.id} value={loc.id.toString()}>
//                             {loc.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>
// 
//               {/* Footer Actions */}
//               <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
//                 <Button
//                   variant="outline"
//                   asChild
//                   className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
//                 >
//                   <Link href="/admin-dashboard/agents">Cancel</Link>
//                 </Button>
//                 <Button
//                   onClick={handleSubmit}
//                   disabled={saving}
//                   className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
//                 >
//                   {saving ? "Updating..." : "Update Agent"}
//                 </Button>
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