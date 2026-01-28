"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  History,
  BarChart3,
  Clock,
  User as UserIcon,
  LogIn,
  Shield,
  Loader2,
} from "lucide-react";
import { userService, User } from "@/lib/services/user-service";

export function UserProfile() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Role mapping for display
  const roleDisplayNames: Record<User["role"], string> = {
    admin: "Admin",
    web_admin: "Web Admin",
    officer: "Officer",
    agent: "Agent",
    task_force: "Task Force",
  };

  // Mock data for development when API is not available
  const mockUserData: Record<string, User> = {
    "1": {
      id: 1,
      name: "John Admin",
      email: "john.admin@kofibenteh.com",
      phone: "+233 24 123 4567",
      role: "admin",
      status: "active",
      location: "Accra Central",
      created_at: "2024-01-15T10:00:00Z",
      last_login: "2024-12-11T15:33:00Z",
    },
    "2": {
      id: 2,
      name: "Sarah Web Admin",
      email: "sarah.web@kofibenteh.com",
      phone: "+233 24 234 5678",
      role: "web_admin",
      status: "active",
      location: "Tema",
      created_at: "2024-02-20T09:30:00Z",
      last_login: "2024-12-10T14:22:00Z",
    },
    "3": {
      id: 3,
      name: "Michael Officer",
      email: "michael.officer@kofibenteh.com",
      phone: "+233 24 345 6789",
      role: "officer",
      status: "active",
      location: "Kumasi",
      created_at: "2024-03-10T11:15:00Z",
      last_login: "2024-12-09T16:45:00Z",
    },
    "4": {
      id: 4,
      name: "Emma Agent",
      email: "emma.agent@kofibenteh.com",
      phone: "+233 24 456 7890",
      role: "agent",
      status: "inactive",
      location: "Cape Coast",
      created_at: "2024-04-05T08:45:00Z",
      last_login: "2024-11-28T12:30:00Z",
    },
    "5": {
      id: 5,
      name: "David Task Force",
      email: "david.task@kofibenteh.com",
      phone: "+233 24 567 8901",
      role: "task_force",
      status: "active",
      location: "Takoradi",
      created_at: "2024-05-12T13:20:00Z",
      last_login: "2024-12-08T10:15:00Z",
    },
  };

  // Fetch user data with fallback to mock data
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await userService.getUserById(parseInt(userId));

        if (response.success && response.data.user) {
          setUser(response.data.user);
        } else {
          setError(response.message || "Failed to load user");
        }
      } catch (err) {
        console.warn("API not available, using mock data:", err);
        // Use mock data for the requested user ID
        const mockUser = mockUserData[userId];
        if (mockUser) {
          setUser(mockUser);
          setError(null);
        } else {
          setError("User not found");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading user profile...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center p-8 text-red-600">
        {error || "User not found"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: User Info & Activity Stats */}
      <div className="space-y-6">
        {/* User Info Card */}
        <Card>
          <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 bg-indigo-50 text-indigo-600 mb-4 ring-4 ring-white shadow-sm">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl font-bold bg-indigo-100 text-indigo-600">
                <UserIcon className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>

            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>

            <Badge
              variant="secondary"
              className="mt-2 bg-blue-50 text-blue-700 hover:bg-blue-50"
            >
              {roleDisplayNames[user.role]}
            </Badge>

            <Badge
              className={`mt-3 border-0 ${
                user.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.status}
            </Badge>

            <div className="w-full mt-8 space-y-4">
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-900">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-gray-900">
                    {user.phone}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-500">Member Since:</span>
                <span className="font-medium text-gray-900">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-500">Last Login:</span>
                <span className="font-medium text-gray-900">
                  {user.last_login
                    ? new Date(user.last_login).toLocaleString()
                    : "Never"}
                </span>
              </div>
              {user.location && (
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium text-gray-900">
                    {user.location}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Activity Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Total Activities
                </span>
              </div>
              <span className="text-lg font-bold text-gray-900">0</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded">
                  <History className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Last Activity
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {user.last_login
                  ? new Date(user.last_login).toLocaleString()
                  : "Never"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Activity History */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Activity History
            </CardTitle>
            <CardDescription>
              Recent activities performed by this user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8 pl-2">
              {/* Placeholder for activity history - would need separate API endpoint */}
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No activity history available</p>
                <p className="text-sm">
                  Activity tracking would be implemented with a separate API
                  endpoint
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button
                variant="secondary"
                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              >
                View All Activities
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
