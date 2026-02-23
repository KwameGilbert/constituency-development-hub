// COMMENTED OUT: Officers page - functionality moved to Users page (/admin-dashboard/users)
// To restore, uncomment the original code below and remove the placeholder.

export default function DisabledPage() {
  return null;
}

/*  ===== ORIGINAL CODE (commented out) =====
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
//   ArrowLeft,
//   UserPlus,
//   UserCircle,
//   ShieldAlert,
//   Settings2,
//   LogOut,
//   Loader2,
//   User,
// } from "lucide-react";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   officersService,
//   CreateOfficerRequest,
// } from "@/lib/services/officers-service";
// import { sectorsService, Sector } from "@/lib/services/sectors-service";
// import { locationsService, Location } from "@/lib/services/locations-service";
// import { toast } from "sonner";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";
// 
// export default function AddOfficerPage() {
//   const router = useRouter();
//   const [submitting, setSubmitting] = useState(false);
//   const [sectors, setSectors] = useState<Sector[]>([]);
//   const [locations, setLocations] = useState<Location[]>([]);
// 
//   const [formData, setFormData] = useState<CreateOfficerRequest>({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     title: "",
//     department: "",
//     status: "active",
//     can_manage_projects: true,
//     can_manage_reports: true,
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
//         const [sectorsRes, locationsRes] = await Promise.all([
//           sectorsService.getSectors(),
//           locationsService.getLocations(),
//         ]);
// 
//         if (sectorsRes.success) setSectors(sectorsRes.data.sectors);
//         if (locationsRes.success) setLocations(locationsRes.data.locations);
//       } catch (error) {
//         console.error("Failed to fetch initial data", error);
//         toast.error("Failed to load options");
//       }
//     };
//     fetchData();
//   }, []);
// 
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };
// 
//   const handleSelectChange = (key: string, value: string) => {
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
//   const handleCheckboxChange = (key: string, checked: boolean) => {
//     setFormData((prev) => ({ ...prev, [key]: checked }));
//   };
// 
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
// 
//     try {
//       const response = await officersService.createOfficer(formData);
//       if (response.success) {
//         toast.success("Officer created successfully");
//         if (response.data.generated_password) {
//           toast.message(
//             `Password generated: ${response.data.generated_password}`,
//             {
//               duration: 10000,
//             },
//           );
//         }
//         router.push("/admin-dashboard/officers");
//       } else {
//         toast.error(response.message || "Failed to create officer");
//       }
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "An error occurred";
//       toast.error(errorMessage);
//     } finally {
//       setSubmitting(false);
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
//             label: "Back to Dashboard",
//             href: "/admin-dashboard/officers",
//             icon: ArrowLeft,
//             className:
//               "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm",
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
//                     New Officer
//                   </CardTitle>
//                 </div>
//                 <CardDescription>
//                   Create a new officer account and assign permissions
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-8">
// ...existing code...
//                 </div>
// 
//                 {/* Personal Information */}
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
//                     <Label htmlFor="email">
//                       Email Address <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="Enter email address"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="password">Password</Label>
//                     <Input
//                       id="password"
//                       type="password"
//                       placeholder="Enter password (optional)"
//                       value={formData.password || ""}
//                       onChange={handleChange}
//                     />
//                     <p className="text-xs text-gray-500">
//                       Leave blank to auto-generate
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
//                 {/* Checkboxes for Permissions */}
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
//                 {/* Sectors Assignment */}
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
//                 {/* Locations Assignment */}
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
//                     value={formData.bio}
//                     onChange={handleChange}
//                   />
//                 </div>
// 
//                 {/* Footer Actions */}
//                 <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
//                   <Button
//                     type="button"
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
//                       <UserPlus className="w-4 h-4" />
//                     )}
//                     Create Officer
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
===== END ORIGINAL CODE ===== */
