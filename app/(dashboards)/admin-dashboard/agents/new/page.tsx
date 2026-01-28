"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { agentService } from "@/lib/services/agent-service";
import { locationsService, Location } from "@/lib/services/locations-service";
import { toast } from "sonner";

export default function AddAgentPage() {
  const router = useRouter();
  // const { toast } = useToast(); // Removed
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    mainCommunity: "",
    smallerCommunity: "",
    suburb: "",
    cottage: "",
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await locationsService.getLocations({ limit: 100 });
        if (response.success && response.data) {
          setLocations(response.data.locations);
        }
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };
    fetchLocations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare FormData for API
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);

      // Assign location - prioritization logic could go here
      // For now sending the main selection as 'assigned_location'
      data.append("assigned_location", formData.mainCommunity);
      if (formData.smallerCommunity)
        data.append("assigned_communities", formData.smallerCommunity);

      const response = await agentService.createAgent(data);

      if (response.success) {
        toast.success("Success", {
          description: "Agent created successfully",
        });
        router.push("/admin-dashboard/agents");
      } else {
        toast.error("Error", {
          description: response.message || "Failed to create agent",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Add New Agent"
        description="Create a new agent account"
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
            label: "Back to Agents",
            href: "/admin-dashboard/agents",
            icon: ArrowLeft,
            className: "bg-gray-100 text-gray-700 hover:bg-gray-200",
          },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">
          <Card className="border-none shadow-sm">
            <CardContent className="space-y-8 p-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter agent name"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Location Assignment */}
              <div className="space-y-4">
                <h3 className="text-gray-900 font-semibold text-lg">
                  Location Assignment
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mainCommunity" className="text-gray-700">
                      Main Community <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(val) =>
                        handleSelectChange("mainCommunity", val)
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select Main Community" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id.toString()}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Other dropdowns can remain static or be enhanced later */}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  asChild
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Link href="/admin-dashboard/agents">Cancel</Link>
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-8"
                >
                  {loading ? "Adding..." : "Add Agent"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
