"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  UserPlus,
  User,
  MapPin,
  Lock,
  Info,
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { locationsService, Location } from "@/lib/services/locations-service";
import { usersService } from "@/lib/services/users-service";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function AddUserPage() {
  const router = useRouter();
  
  // Location state
  const [communities, setCommunities] = useState<Location[]>([]);
  const [suburbs, setSuburbs] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  const [selectedSuburb, setSelectedSuburb] = useState<string>("");
  const [communityOpen, setCommunityOpen] = useState(false);
  const [suburbOpen, setSuburbOpen] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    status: "active",
    password: "",
    confirmPassword: "",
  });

  // Fetch main communities on mount
  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await locationsService.getLocations({
        type: "community",
        status: "active",
        limit: 100,
      });
      
      if (response.success) {
        setCommunities(response.data.locations);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
      toast.error("Failed to load communities");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuburbs = async (parentId: number) => {
    try {
      const response = await locationsService.getLocations({
        type: "suburb",
        parent_id: parentId,
        status: "active",
        limit: 100,
      });
      
      if (response.success) {
        setSuburbs(response.data.locations);
      }
    } catch (error) {
      console.error("Error fetching suburbs:", error);
      toast.error("Failed to load suburbs");
    }
  };

  const handleCommunityChange = (value: string) => {
    setSelectedCommunity(value);
    setSelectedSuburb("");
    setSuburbs([]);
    
    if (value) {
      fetchSuburbs(parseInt(value));
    }
  };

  const handleSuburbChange = (value: string) => {
    setSelectedSuburb(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.role || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // Build location string from selected locations
    const locations = [];
    if (selectedCommunity) {
      const community = communities.find(c => c.id.toString() === selectedCommunity);
      if (community) locations.push(community.name);
    }
    if (selectedSuburb) {
      const suburb = suburbs.find(s => s.id.toString() === selectedSuburb);
      if (suburb) locations.push(suburb.name);
    }

    try {
      setSubmitting(true);
      
      const userData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        location: locations.join(", ") || undefined,
        status: formData.status,
      };

      const response = await usersService.createUser(userData);

      if (response.success) {
        toast.success("User created successfully!");
        router.push("/admin-dashboard/users");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to create user");
      }
    } catch (error: unknown) {
      console.error("Error creating user:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create user";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Add New User"
        description="Create a new system user account"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
          {
            label: "Profile Settings",
            href: "/admin-dashboard/profile",
            icon: UserCircle,
          },
          {
            label: "Audit Logs",
            href: "/admin-dashboard/audit",
            icon: ShieldAlert,
          },
          {
            label: "System Settings",
            href: "/admin-dashboard/system-settings",
            icon: Settings2,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-600 focus:text-red-600 focus:bg-red-50",
          },
        ]}
        actionButtons={[
          {
            label: "Back to Users",
            href: "/admin-dashboard/users",
            icon: ArrowLeft,
            className:
              "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm",
          },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Card className="border-t-4 border-t-red-900">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">
                User Information
              </CardTitle>
              <CardDescription>
                Fill in the details to create a new user account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold border-b border-gray-100 pb-2">
                  <User className="w-4 h-4" />
                  <h3>Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="fullName" 
                      placeholder="Enter full name" 
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">
                      Phone Number
                    </Label>
                    <Input 
                      id="phone" 
                      placeholder="e.g. +233 20 123 4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-gray-700">
                      Department
                    </Label>
                    <Input
                      id="department"
                      placeholder="e.g. Community Relations"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-700">
                      User Role <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.role}
                      onValueChange={(value) => handleSelectChange("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="web_admin">Web Admin</SelectItem>
                        <SelectItem value="task_force">Task Force</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="officer">Officer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700">
                      Account Status
                    </Label>
                    <Select 
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                      defaultValue="active"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location Assignment */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold border-b border-gray-100 pb-2">
                  <MapPin className="w-4 h-4" />
                  <h3>Location Assignment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mainCommunity" className="text-gray-700">
                      Main Community
                    </Label>
                    <Popover open={communityOpen} onOpenChange={setCommunityOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={communityOpen}
                          className="w-full justify-between font-normal"
                          disabled={loading}
                        >
                          {selectedCommunity
                            ? communities.find((community) => community.id.toString() === selectedCommunity)?.name
                            : loading
                              ? "Loading..."
                              : "Select Main Community"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search main community..." />
                          <CommandList>
                            <CommandEmpty>No community found.</CommandEmpty>
                            <CommandGroup>
                              {communities.map((community) => (
                                <CommandItem
                                  key={community.id}
                                  value={community.name}
                                  onSelect={() => {
                                    handleCommunityChange(community.id.toString());
                                    setCommunityOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedCommunity === community.id.toString() ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {community.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suburb" className="text-gray-700">
                      Suburb
                    </Label>
                    <Popover open={suburbOpen} onOpenChange={setSuburbOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={suburbOpen}
                          className="w-full justify-between font-normal"
                          disabled={!selectedCommunity || suburbs.length === 0}
                        >
                          {selectedSuburb
                            ? suburbs.find((suburb) => suburb.id.toString() === selectedSuburb)?.name
                            : !selectedCommunity
                              ? "Select main community first"
                              : suburbs.length === 0
                                ? "No suburbs"
                                : "Select Suburb"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search suburbs..." />
                          <CommandList>
                            <CommandEmpty>No suburb found.</CommandEmpty>
                            <CommandGroup>
                              {suburbs.map((suburb) => (
                                <CommandItem
                                  key={suburb.id}
                                  value={suburb.name}
                                  onSelect={() => {
                                    handleSuburbChange(suburb.id.toString());
                                    setSuburbOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedSuburb === suburb.id.toString() ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {suburb.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Security Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold border-b border-gray-100 pb-2">
                  <Lock className="w-4 h-4" />
                  <h3>Security Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password (min. 8 characters)"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-[10px] text-gray-400">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Info Alert */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-blue-900">
                    Important Information
                  </h4>
                  <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                    <li>The user will receive login credentials via email</li>
                    <li>They can change their password after first login</li>
                    <li>Make sure the role assignment is correct</li>
                    <li>You can modify these details later if needed</li>
                  </ul>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                <Button
                  variant="outline"
                  asChild
                  className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                >
                  <Link href="/admin-dashboard/users">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-900 hover:bg-indigo-800 text-white gap-2"
                  disabled={submitting}
                >
                  <UserPlus className="w-4 h-4" />
                  {submitting ? "Creating..." : "Create User"}
                </Button>
              </div>
            </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
