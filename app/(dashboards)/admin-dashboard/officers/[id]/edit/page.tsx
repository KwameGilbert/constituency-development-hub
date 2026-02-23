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
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
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
//   Loader2,
//   User,
//   Eye,
//   UserCircle,
//   ShieldAlert,
//   Settings2,
//   LogOut,
// } from "lucide-react";
// import Link from "next/link";
// import { useState, useEffect, use } from "react";
// import { useRouter } from "next/navigation";
// import {
//   officersService,
//   UpdateOfficerRequest,
//   Officer,
// } from "@/lib/services/officers-service";
// import { sectorsService, Sector } from "@/lib/services/sectors-service";
// import { locationsService, Location } from "@/lib/services/locations-service";
// import { toast } from "sonner";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";
// 
// export default function EditOfficerPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = use(params);
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [sectors, setSectors] = useState<Sector[]>([]);
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [officer, setOfficer] = useState<Officer | null>(null);
// 
//   const [formData, setFormData] = useState<UpdateOfficerRequest>({
//     name: "",
//     phone: "",
//     title: "",
//     department: "",
//     status: "active",
//     can_manage_projects: false,
//     can_manage_reports: false,
//     can_manage_events: false,
//     can_publish_content: false,
//     assigned_sectors: [],
//     assigned_locations: [],
//     bio: "",
//     office_location: "",
//   });
// 
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [officerRes, sectorsRes, locationsRes] = await Promise.all([
//           officersService.getOfficer(id),
//           sectorsService.getSectors(),
//           locationsService.getLocations(),
//         ]);
// 
//         if (sectorsRes.success) setSectors(sectorsRes.data.sectors);
//         if (locationsRes.success) setLocations(locationsRes.data.locations);
// 
//         if (officerRes.success) {
//           const officerData = officerRes.data.officer;
//           setOfficer(officerData);
//           setFormData({
//             name: officerData.user?.name || "",
//             phone: officerData.user?.phone || "",
//             title: officerData.title || "",
//             department: officerData.department || "",
//             status: officerData.user?.status || "active",
//             can_manage_projects: officerData.can_manage_projects || false,
//             can_manage_reports: officerData.can_manage_reports || false,
//             can_manage_events: officerData.can_manage_events || false,
//             can_publish_content: officerData.can_publish_content || false,
//             assigned_sectors: officerData.assigned_sectors || [],
//             assigned_locations: officerData.assigned_locations || [],
//             bio: officerData.bio || "",
//             office_location: officerData.office_location || "",
//           });
//         }
//       } catch (error) {
//         console.error("Failed to fetch initial data", error);
//         toast.error("Failed to load officer data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);
// 
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };
// 
//   const handleSelectChange = (
//     key: keyof UpdateOfficerRequest,
//     value: string,
//   ) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };
// 
//   const handleSectorChange = (sectorId: string, checked: boolean) => {
//     setFormData((prev) => {
//       const current = prev.assigned_sectors || [];
//       const updated = checked
//         ? [...current, sectorId]
//         : current.filter((id) => id !== sectorId);
//       return { ...prev, assigned_sectors: updated };
//     });
//   };
// 
//   const handleLocationChange = (locationName: string, checked: boolean) => {
//     setFormData((prev) => {
//       const current = prev.assigned_locations || [];
//       const updated = checked
//         ? [...current, locationName]
//         : current.filter((loc) => loc !== locationName);
//       return { ...prev, assigned_locations: updated };
//     });
//   };
// 
//   const handleCheckboxChange = (
//     key: keyof UpdateOfficerRequest,
//     checked: boolean,
//   ) => {
//     setFormData((prev) => ({ ...prev, [key]: checked }));
//   };
// 
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
// 
//     try {
//       const response = await officersService.updateOfficer(id, formData);
//       if (response.success) {
//         toast.success("Officer updated successfully");
//         router.push("/admin-dashboard/officers");
//       } else {
//         toast.error(response.message || "Failed to update officer");
//       }
//     } catch (error) {
//       // Safe error check
//       const errorMessage =
//         error instanceof Error ? error.message : "An error occurred";
//       toast.error(errorMessage);
//     } finally {
//       setSubmitting(false);
//     }
//   };
// 
//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-slate-50">
//         <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
//       </div>
//     );
//   }
// 
//   return (
//     <div className="flex flex-col h-full bg-slate-50">
//       <AdminHeader
//         title="Edit Officer"
//         description="Update officer information"
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
//             label: "View Officer",
//             href: `/admin-dashboard/officers/${id}`,
//             icon: Eye,
//             className: "bg-indigo-600 hover:bg-indigo-700 text-white",
//           },
//         ]}
//       />
//       <div className="flex-1 p-6 space-y-6 overflow-y-auto">
//         <div className="max-w-4xl mx-auto">
//           <form onSubmit={handleSubmit}>
//             <Card className="border-t-4 border-t-indigo-900">
//               <CardHeader>
//                 <div className="flex items-center gap-2">
//                   <CardTitle className="text-xl text-gray-900">
//                     Edit Officer: {officer?.user?.name}
//                   </CardTitle>
//                 </div>
//                 <CardDescription>
//                   Update agent details and permissions
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-8 pt-6">
//                 Header for Form
//                 <div className="flex justify-between items-center bg-indigo-50 text-indigo-900 p-4 rounded-lg border border-indigo-100">
//                   <h3 className="font-semibold text-sm uppercase tracking-wider">
//                     Basic Information
//                   </h3>
//                   <User className="w-5 h-5 text-indigo-400" />
//                 </div>
// 
//                 Personal Information
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">
//                       Full Name <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       id="name"
//                       placeholder="Enter officer name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-gray-700">
//                       Email Address
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={officer?.user?.email}
//                       disabled
//                       className="bg-gray-100 cursor-not-allowed"
//                     />
//                     <p className="text-xs text-gray-500">
//                       Email cannot be changed
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="phone">Phone Number</Label>
//                     <Input
//                       id="phone"
//                       type="tel"
//                       inputMode="numeric"
//                       placeholder="Enter phone number"
//                       value={formData.phone}
//                       onChange={(e) => {
//                         const filtered = e.target.value.replace(/[^0-9+]/g, '');
//                         setFormData((prev) => ({ ...prev, phone: filtered }));
//                       }}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="status">Status</Label>
//                     <Select
//                       value={formData.status}
//                       onValueChange={(val) => handleSelectChange("status", val)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="active">Active</SelectItem>
//                         <SelectItem value="inactive">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
// 
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="title">Job Title</Label>
//                     <Input
//                       id="title"
//                       placeholder="e.g. Project Manager"
//                       value={formData.title}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="department">Department</Label>
//                     <Select
//                       value={formData.department}
//                       onValueChange={(val) =>
//                         handleSelectChange("department", val)
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Department" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Infrastructure">
//                           Infrastructure
//                         </SelectItem>
//                         <SelectItem value="Health">Health</SelectItem>
//                         <SelectItem value="Education">Education</SelectItem>
//                         <SelectItem value="Social Welfare">
//                           Social Welfare
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
// 
//                 Checkboxes for Permissions
//                 <div className="space-y-4 pt-4 border-t border-gray-100">
//                   <h3 className="font-semibold text-gray-900">Permissions</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="can_manage_projects"
//                         checked={formData.can_manage_projects}
//                         onCheckedChange={(checked) =>
//                           handleCheckboxChange(
//                             "can_manage_projects",
//                             checked as boolean,
//                           )
//                         }
//                       />
//                       <Label htmlFor="can_manage_projects">
//                         Can Manage Projects
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="can_manage_reports"
//                         checked={formData.can_manage_reports}
//                         onCheckedChange={(checked) =>
//                           handleCheckboxChange(
//                             "can_manage_reports",
//                             checked as boolean,
//                           )
//                         }
//                       />
//                       <Label htmlFor="can_manage_reports">
//                         Can Manage Reports
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="can_manage_events"
//                         checked={formData.can_manage_events}
//                         onCheckedChange={(checked) =>
//                           handleCheckboxChange(
//                             "can_manage_events",
//                             checked as boolean,
//                           )
//                         }
//                       />
//                       <Label htmlFor="can_manage_events">
//                         Can Manage Events
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="can_publish_content"
//                         checked={formData.can_publish_content}
//                         onCheckedChange={(checked) =>
//                           handleCheckboxChange(
//                             "can_publish_content",
//                             checked as boolean,
//                           )
//                         }
//                       />
//                       <Label htmlFor="can_publish_content">
//                         Can Publish Content
//                       </Label>
//                     </div>
//                   </div>
//                 </div>
// 
//                 Sectors Assignment
//                 <div className="space-y-4 pt-4 border-t border-gray-100">
//                   <h3 className="font-semibold text-gray-900">
//                     Assign Sectors
//                   </h3>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {sectors.map((sector) => (
//                       <div
//                         key={sector.id}
//                         className="flex items-center space-x-2"
//                       >
//                         <Checkbox
//                           id={`sector-${sector.id}`}
//                           checked={(formData.assigned_sectors || []).includes(
//                             String(sector.id),
//                           )}
//                           onCheckedChange={(checked) =>
//                             handleSectorChange(
//                               String(sector.id),
//                               checked as boolean,
//                             )
//                           }
//                         />
//                         <Label htmlFor={`sector-${sector.id}`}>
//                           {sector.name}
//                         </Label>
//                       </div>
//                     ))}
//                     {sectors.length === 0 && (
//                       <p className="text-sm text-gray-500 italic">
//                         No sectors available
//                       </p>
//                     )}
//                   </div>
//                 </div>
// 
//                 Locations Assignment
//                 <div className="space-y-4 pt-4 border-t border-gray-100">
//                   <h3 className="font-semibold text-gray-900">
//                     Assign Locations
//                   </h3>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-2 border rounded-md">
//                     {locations.map((location) => (
//                       <div
//                         key={location.id}
//                         className="flex items-center space-x-2"
//                       >
//                         <Checkbox
//                           id={`loc-${location.id}`}
//                           checked={(formData.assigned_locations || []).includes(
//                             location.name,
//                           )}
//                           onCheckedChange={(checked) =>
//                             handleLocationChange(
//                               location.name,
//                               checked as boolean,
//                             )
//                           }
//                         />
//                         <Label
//                           htmlFor={`loc-${location.id}`}
//                           className="truncate"
//                           title={location.name}
//                         >
//                           {location.name}
//                         </Label>
//                       </div>
//                     ))}
//                     {locations.length === 0 && (
//                       <p className="text-sm text-gray-500 italic">
//                         No locations available
//                       </p>
//                     )}
//                   </div>
//                 </div>
// 
//                 <div className="space-y-2 pt-4 border-t border-gray-100">
//                   <Label htmlFor="bio">Bio / Notes</Label>
//                   <Textarea
//                     id="bio"
//                     placeholder="Additional notes about this officer..."
//                     value={formData.bio || ""}
//                     onChange={handleChange}
//                   />
//                 </div>
// 
//                 Footer Actions
//                 <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
//                   <Button
//                     variant="outline"
//                     asChild
//                     className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
//                   >
//                     <Link href="/admin-dashboard/officers">Cancel</Link>
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
//                     disabled={submitting}
//                   >
//                     {submitting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       "Update Officer"
//                     )}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
// 
// ===== END ORIGINAL CODE =====