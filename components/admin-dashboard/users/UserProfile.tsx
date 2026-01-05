"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, BarChart3, Clock, User, LogIn, Shield } from "lucide-react";

export function UserProfile() {
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
                    <User className="w-10 h-10" />
                </AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-bold text-gray-900">Admin.Rock</h2>
            
            <Badge variant="secondary" className="mt-2 bg-blue-50 text-blue-700 hover:bg-blue-50">
                Member of Parliament
            </Badge>
            
            <Badge className="mt-3 bg-green-100 text-green-700 hover:bg-green-100 border-0">
                Active
            </Badge>
            
            <div className="w-full mt-8 space-y-4">
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium text-gray-900">admin.rock@kofibenteh.com</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">Member Since:</span>
                    <span className="font-medium text-gray-900">Sep 2025</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">Last Login:</span>
                    <span className="font-medium text-gray-900">Dec 11, 2025 15:33</span>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* User Activity Stats */}
        <Card>
           <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">User Activity</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded">
                        <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Total Activities</span>
                </div>
                <span className="text-lg font-bold text-gray-900">23</span>
             </div>
             
             <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded">
                        <History className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Last Activity</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">Dec 11, 2025 15:33</span>
             </div>
           </CardContent>
        </Card>
      </div>

      {/* Right Column: Activity History */}
      <div className="lg:col-span-2">
         <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Activity History</CardTitle>
                <CardDescription>Recent activities performed by this user</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8 pl-2">
                    {/* Activity Item 1 */}
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 z-10">
                                <History className="w-4 h-4" />
                            </div>
                            <div className="flex-1 w-0.5 bg-gray-200 my-1"></div>
                        </div>
                        <div className="pb-8">
                            <h4 className="text-sm font-semibold text-gray-900">Admin session regenerated</h4>
                            <p className="text-sm text-gray-500 mt-0.5">Administrator session ID regenerated for security</p>
                            <span className="text-xs text-gray-400 mt-2 block">Dec 11, 2025 15:33</span>
                        </div>
                    </div>

                    {/* Activity Item 2 */}
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 z-10">
                                <History className="w-4 h-4" />
                            </div>
                            <div className="flex-1 w-0.5 bg-gray-200 my-1"></div>
                        </div>
                        <div className="pb-8">
                            <h4 className="text-sm font-semibold text-gray-900">Admin login</h4>
                            <p className="text-sm text-gray-500 mt-0.5">Administrator (mp) logged into admin dashboard</p>
                            <span className="text-xs text-gray-400 mt-2 block">Dec 11, 2025 15:33</span>
                        </div>
                    </div>

                    {/* Activity Item 3 */}
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 z-10">
                                <History className="w-4 h-4" />
                            </div>
                            <div className="flex-1 w-0.5 bg-gray-200 my-1"></div>
                        </div>
                        <div className="pb-8">
                            <h4 className="text-sm font-semibold text-gray-900">Admin session regenerated</h4>
                            <p className="text-sm text-gray-500 mt-0.5">Administrator session ID regenerated for security</p>
                            <span className="text-xs text-gray-400 mt-2 block">Dec 10, 2025 17:25</span>
                        </div>
                    </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                    <Button variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                        View All Activities
                    </Button>
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
