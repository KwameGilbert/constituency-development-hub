import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export function AgentProfileCard() {
    return (
        <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-[#1e1b4b]">Agent.Rock</h2>
                <p className="text-muted-foreground text-sm mb-2">Field Agent</p>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-6">Active</Badge>

                <div className="w-full space-y-3 text-sm text-left">
                    <div>
                        <span className="text-muted-foreground block text-xs">Email</span>
                        <span className="font-medium">agent.rock@kofibenteh.com</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block text-xs">Location</span>
                        <span className="font-medium">Not Assigned</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block text-xs">Joined</span>
                        <span className="font-medium">Sep 28, 2025</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block text-xs">Last Login</span>
                        <span className="font-medium">Nov 30, 2025 22:33</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
