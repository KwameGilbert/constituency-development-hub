// COMMENTED OUT: Officers page - functionality moved to Users page (/admin-dashboard/users)
// To restore, uncomment the original code below and remove the placeholder.

export default function DisabledPage() {
  return null;
}

//  ===== ORIGINAL CODE (commented out) =====
// "use client";
// 
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
//   Loader2,
// } from "lucide-react";
// import Link from "next/link";
// import { useState, useEffect, useCallback } from "react";
// import { officersService, Officer } from "@/lib/services/officers-service";
// import { toast } from "sonner";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// 
// export default function OfficersPage() {
//   const [officers, setOfficers] = useState<Officer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [officerToDelete, setOfficerToDelete] = useState<Officer | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);
// 
//   const fetchOfficers = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await officersService.getOfficers();
//       if (response.success) {
//         setOfficers(response.data.officers);
//       }
//     } catch (error) {
//       console.error("Failed to load officers", error);
//       toast.error("Failed to load officers list");
//     } finally {
//       setLoading(false);
//     }
//   }, []);
// 
//   useEffect(() => {
//     fetchOfficers();
//   }, [fetchOfficers]);
// 
//   const handleDelete = async () => {
//     if (!officerToDelete) return;
// 
//     setIsDeleting(true);
//     try {
//       const response = await officersService.deleteOfficer(officerToDelete.id);
//       if (response.success) {
//         toast.success("Officer deleted successfully");
//         fetchOfficers();
//         setOfficerToDelete(null);
//       } else {
//         toast.error(response.message || "Failed to delete officer");
//       }
//     } catch (error) {
//       // Safe error handling similar to previous fix
//       const errorMessage =
//         error instanceof Error ? error.message : "An error occurred";
//       toast.error(errorMessage);
//     } finally {
//       setIsDeleting(false);
//     }
//   };
// 
//   const filteredOfficers = officers.filter((officer) => {
//     const searchLower = searchQuery.toLowerCase();
//     return (
//       (officer.user?.name || "").toLowerCase().includes(searchLower) ||
//       officer.user?.email.toLowerCase().includes(searchLower) ||
//       (officer.user?.phone || "").toLowerCase().includes(searchLower)
//     );
//   });
// 
//   const activeOfficers = filteredOfficers.filter(
//     (o) => o.user?.status === "active",
//   );
//   const inactiveOfficers = filteredOfficers.filter(
//     (o) => o.user?.status !== "active",
//   );
// 
//   const formatDate = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       });
//     } catch {
//       return dateString;
//     }
//   };
// 
//   return (
//     <div className="flex flex-col h-full bg-slate-50">
//       <AdminHeader
//         title="Officer Management"
//         description="Manage all system officers"
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
//             label: "Add New Officer",
//             href: "/admin-dashboard/officers/new",
//             icon: Plus,
//             className: "bg-indigo-900 hover:bg-indigo-800 text-white",
//           },
//         ]}
//       />
// 
//       <div className="flex-1 p-6 space-y-6 overflow-y-auto">
//         <div className="max-w-[1600px] mx-auto space-y-6">
//           Filters and Search
//           <Card className="p-4 bg-white">
//             <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
//               <div className="space-y-1">
//                 <h3 className="font-semibold text-gray-700">Officers</h3>
//                 <p className="text-sm text-gray-500">
//                   Total: {filteredOfficers.length} officers
//                 </p>
//               </div>
//               <div className="flex flex-1 w-full md:w-auto gap-3 items-center justify-end">
//                 <div className="relative w-full md:w-96">
//                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
//                   <Input
//                     placeholder="Search officers by name, email or phone..."
//                     className="pl-9 bg-gray-50 border-gray-200"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-800"
//                   >
//                     All ({filteredOfficers.length})
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="hover:bg-gray-200 text-gray-600"
//                   >
//                     Active ({activeOfficers.length})
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="hover:bg-gray-200 text-gray-600"
//                   >
//                     Inactive ({inactiveOfficers.length})
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </Card>
// 
//           Officers Table
//           <Card className="bg-white overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm text-left">
//                 <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
//                   <tr>
//                     <th className="px-6 py-4">NAME</th>
//                     <th className="px-6 py-4">CONTACT INFO</th>
//                     <th className="px-6 py-4">LOCATION/ROLE</th>
//                     <th className="px-6 py-4">STATUS</th>
//                     <th className="px-6 py-4">JOINED</th>
//                     <th className="px-6 py-4 text-right">ACTIONS</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {loading ? (
//                     <tr>
//                       <td
//                         colSpan={6}
//                         className="px-6 py-12 text-center text-gray-500"
//                       >
//                         <div className="flex items-center justify-center gap-2">
//                           <Loader2 className="w-5 h-5 animate-spin" />
//                           Loading officers...
//                         </div>
//                       </td>
//                     </tr>
//                   ) : filteredOfficers.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={6}
//                         className="px-6 py-12 text-center text-gray-500"
//                       >
//                         No officers found
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredOfficers.map((officer) => (
//                       <tr
//                         key={officer.id}
//                         className="hover:bg-gray-50/50 transition-colors group"
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold overflow-hidden">
//                               {officer.profile_image ? (
//                                 <img
//                                   src={officer.profile_image}
//                                   alt={officer.user?.name}
//                                   className="w-full h-full object-cover"
//                                 />
//                               ) : (
//                                 (officer.user?.name || "O").charAt(0)
//                               )}
//                             </div>
//                             <div>
//                               <div className="font-medium text-gray-900">
//                                 {officer.user?.name}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {officer.title || "Officer"}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-gray-600">
//                           <div className="flex flex-col">
//                             <span>{officer.user?.email}</span>
//                             <span className="text-xs text-gray-400">
//                               {officer.user?.phone || "-"}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-gray-600">
//                           <div className="flex flex-col">
//                             <span
//                               className="max-w-[200px] truncate"
//                               title={
//                                 officer.assigned_locations?.join(", ") || ""
//                               }
//                             >
//                               {officer.assigned_locations?.length
//                                 ? officer.assigned_locations[0] +
//                                   (officer.assigned_locations.length > 1
//                                     ? ` +${officer.assigned_locations.length - 1}`
//                                     : "")
//                                 : "Unassigned"}
//                             </span>
//                             <span className="text-xs text-gray-400">
//                               {officer.department || "General"}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <Badge
//                             className={`border-none px-3 py-1 font-normal ${
//                               officer.user?.status === "active"
//                                 ? "bg-green-100 text-green-700 hover:bg-green-200"
//                                 : "bg-red-100 text-red-700 hover:bg-red-200"
//                             }`}
//                           >
//                             {officer.user?.status || "Unknown"}
//                           </Badge>
//                         </td>
//                         <td className="px-6 py-4 text-gray-600">
//                           {formatDate(officer.created_at)}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center justify-end gap-2">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
//                               asChild
//                             >
//                               <Link
//                                 href={`/admin-dashboard/officers/${officer.id}`}
//                               >
//                                 <Eye className="w-4 h-4" />
//                               </Link>
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
//                               asChild
//                             >
//                               <Link
//                                 href={`/admin-dashboard/officers/${officer.id}/edit`}
//                               >
//                                 <Edit className="w-4 h-4" />
//                               </Link>
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
//                               onClick={() => setOfficerToDelete(officer)}
//                             >
//                               <UserX className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </Card>
//         </div>
//       </div>
// 
//       <AlertDialog
//         open={!!officerToDelete}
//         onOpenChange={(open) => !open && setOfficerToDelete(null)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Officer Account</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete{" "}
//               <strong>{officerToDelete?.user?.name}</strong>? This action
//               prevents them from accessing the system. If they have assigned
//               agents, you cannot delete them.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               className="bg-red-600 hover:bg-red-700 text-white"
//               disabled={isDeleting}
//             >
//               {isDeleting ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 "Delete Officer"
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
// 
// ===== END ORIGINAL CODE =====
