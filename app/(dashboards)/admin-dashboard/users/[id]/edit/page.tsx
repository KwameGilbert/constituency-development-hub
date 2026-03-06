"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Save,
  UserX,
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
  ChevronsUpDown,
  Check,
  User,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Link from "next/link";
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

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [communities, setCommunities] = useState<Location[]>([]);
  const [suburbs, setSuburbs] = useState<Location[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  const [selectedSuburb, setSelectedSuburb] = useState<string>("");
  const [communityOpen, setCommunityOpen] = useState(false);
  const [suburbOpen, setSuburbOpen] = useState(false);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [loadingSuburbs, setLoadingSuburbs] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [prefillCommunityName, setPrefillCommunityName] = useState("");
  const [prefillSuburbName, setPrefillSuburbName] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [initialRole, setInitialRole] = useState<string>("");
  const [initialStatus, setInitialStatus] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
    department: "",
    role: "",
    status: "active",
  });

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoadingCommunities(true);
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
        setLoadingCommunities(false);
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = Number(id);
      if (!Number.isFinite(userId)) {
        return;
      }

      try {
        setLoadingUser(true);
        const response = await usersService.getUserById(userId);
        if (!response.success) {
          toast.error(response.message || "Failed to load user details");
          return;
        }

        const user = response.data.user as typeof response.data.user & {
          bio?: string;
          role_profile?: { department?: string };
          created_at?: string;
          last_login?: string;
          last_login_at?: string;
        };

        setFormData({
          fullName: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          department: user.role_profile?.department || "",
          role: user.role || "",
          status: user.status || "active",
        });
        setInitialRole(user.role || "");
        setInitialStatus(user.status || "active");

        const location = user.location?.trim();
        if (!location) {
          return;
        }

        const parts = location
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean);

        setPrefillCommunityName(parts[0] ?? "");
        setPrefillSuburbName(parts[1] ?? "");
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to load user details");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [id]);

  const fetchSuburbs = async (parentId: number, suburbNameToPrefill?: string) => {
    try {
      setLoadingSuburbs(true);
      const response = await locationsService.getLocations({
        type: "suburb",
        parent_id: parentId,
        status: "active",
        limit: 100,
      });

      if (response.success) {
        setSuburbs(response.data.locations);

        if (suburbNameToPrefill) {
          const matchedSuburb = response.data.locations.find(
            (suburb) => suburb.name.toLowerCase() === suburbNameToPrefill.toLowerCase()
          );
          if (matchedSuburb) {
            setSelectedSuburb(matchedSuburb.id.toString());
          }
        }
      }
    } catch (error) {
      console.error("Error fetching suburbs:", error);
      toast.error("Failed to load suburbs");
    } finally {
      setLoadingSuburbs(false);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    const userId = Number(id);
    if (!Number.isFinite(userId)) {
      toast.error("Invalid user id");
      return;
    }

    const locations: string[] = [];
    if (selectedCommunity) {
      const community = communities.find(
        (item) => item.id.toString() === selectedCommunity
      );
      if (community) locations.push(community.name);
    }
    if (selectedSuburb) {
      const suburb = suburbs.find((item) => item.id.toString() === selectedSuburb);
      if (suburb) locations.push(suburb.name);
    }

    try {
      setSubmitting(true);

      await usersService.updateUser(userId, {
        name: formData.fullName,
        email: formData.email,
        password: formData.newPassword || undefined,
        phone: formData.phone || undefined,
        location: locations.join(", ") || undefined,
      });

      if (formData.role !== initialRole) {
        await usersService.updateUserRole(userId, { role: formData.role });
      }

      if (formData.status !== initialStatus) {
        await usersService.updateUserStatus(userId, {
          status: formData.status,
        });
      }

      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));

      toast.success("User updated successfully");
      router.push(`/admin-dashboard/users/${id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!prefillCommunityName || communities.length === 0 || selectedCommunity) {
      return;
    }

    const matchedCommunity = communities.find(
      (community) => community.name.toLowerCase() === prefillCommunityName.toLowerCase()
    );

    if (!matchedCommunity) {
      return;
    }

    setSelectedCommunity(matchedCommunity.id.toString());
    fetchSuburbs(matchedCommunity.id, prefillSuburbName || undefined);
  }, [prefillCommunityName, prefillSuburbName, communities, selectedCommunity]);

  if (loadingUser) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
        <span className="text-gray-600">Loading user details...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Edit User"
        description="Modify user accounts"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
          {
            label: "Back to Profile",
            href: `/admin-dashboard/users/${id}`,
            icon: ArrowLeft,
          },
          { label: "Deactivate User", icon: UserX, className: "text-gray-700" },
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
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Card className="border-t-4 border-t-red-900">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">User Information</CardTitle>
              <CardDescription>
                Update user profile, role assignment, and location details.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-8">
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
                  <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="e.g. +233 20 123 4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-700">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    readOnly
                    className="bg-gray-50 text-gray-500"
                    placeholder="No department"
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
                  <Label htmlFor="status" className="text-gray-700">Account Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold border-b border-gray-100 pb-2">
                  <Lock className="w-4 h-4" />
                  <h3>Password Reset</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-700">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Leave blank to keep current password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Minimum 8 characters
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold border-b border-gray-100 pb-2">
                  <MapPin className="w-4 h-4" />
                  <h3>Location Assignment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <Label htmlFor="mainCommunity" className="text-gray-700">Main Community</Label>
                <Popover open={communityOpen} onOpenChange={setCommunityOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={communityOpen}
                      className="w-full justify-between font-normal"
                      disabled={loadingCommunities}
                    >
                      {selectedCommunity
                        ? communities.find((community) => community.id.toString() === selectedCommunity)?.name
                        : loadingCommunities
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
                <Label htmlFor="suburb" className="text-gray-700">Suburb</Label>
                <Popover open={suburbOpen} onOpenChange={setSuburbOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={suburbOpen}
                      className="w-full justify-between font-normal"
                      disabled={!selectedCommunity || loadingSuburbs || suburbs.length === 0}
                    >
                      {selectedSuburb
                        ? suburbs.find((suburb) => suburb.id.toString() === selectedSuburb)?.name
                        : !selectedCommunity
                          ? "Select main community first"
                          : loadingSuburbs
                            ? "Loading..."
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

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                <Button variant="outline" asChild>
                  <Link href={`/admin-dashboard/users/${id}`}>
                    Cancel
                  </Link>
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                  <Save className="w-4 h-4" />
                  {submitting ? "Saving..." : "Save Changes"}
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
