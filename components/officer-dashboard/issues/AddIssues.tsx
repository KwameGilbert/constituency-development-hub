"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AddIssues() {
    const [activeTab, setActiveTab] = useState("issue-details");

    const handleNext = (nextTab: string) => {
        setActiveTab(nextTab);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-8">
                    <TabsTrigger value="issue-details">Issue Details</TabsTrigger>
                    <TabsTrigger value="constituent-details">Constituent Details</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>

                {/* Tab 1: Issue Details */}
                <TabsContent value="issue-details" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="Issue Title" required>
                            <Input placeholder="" />
                        </FormItem>
                        <FormItem label="Issue Type" required>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="type1">Type 1</SelectItem>
                                    <SelectItem value="type2">Type 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    </div>

                    <FormItem label="Description" required>
                        <Textarea className="min-h-[100px]" />
                    </FormItem>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="Category" required>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cat1">Category 1</SelectItem>
                                    <SelectItem value="cat2">Category 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                        <FormItem label="Severity" required>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="Sector" required>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Sector" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sec1">Sector 1</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                        <FormItem label="Subsector">
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Subsector (Optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sub1">Subsector 1</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    </div>

                    <FormItem label="People Affected (Approx.)">
                        <Input placeholder="e.g., 100" />
                    </FormItem>

                    <FormItem label="Additional Notes">
                        <Textarea />
                    </FormItem>

                    <div className="flex justify-between items-center pt-4">
                        <p className="text-sm text-red-500">* Required fields</p>
                        <Button onClick={() => handleNext("constituent-details")} className="bg-[#1e1b4b] hover:bg-[#1e1b4b]/90">
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </TabsContent>

                {/* Tab 2: Constituent Details */}
                <TabsContent value="constituent-details" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="Constituent Name" required>
                            <Input />
                        </FormItem>
                        <FormItem label="Phone Number" required>
                            <Input />
                        </FormItem>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="Email Address">
                            <Input />
                        </FormItem>
                        <FormItem label="Gender">
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    </div>

                    <FormItem label="Home Address">
                        <Input />
                    </FormItem>

                    <div className="flex justify-between items-center pt-4">
                        <p className="text-sm text-red-500">* Required fields</p>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => handleNext("issue-details")}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>
                            <Button onClick={() => handleNext("location")} className="bg-[#1e1b4b] hover:bg-[#1e1b4b]/90">
                                Next <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* Tab 3: Location */}
                <TabsContent value="location" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="Main Community" required>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Main Community" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="com1">Community 1</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                        <FormItem label="Smaller Community">
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Smaller Community (Optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scom1">Smaller Community 1</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="Suburb">
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Suburb (Optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sub1">Suburb 1</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                        <FormItem label="Specific Location Details">
                            <Input placeholder="e.g., 'In front of Building 5'" />
                        </FormItem>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        <p className="text-sm text-red-500">* Required fields</p>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => handleNext("constituent-details")}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>
                            <Button className="bg-[#1e1b4b] hover:bg-[#1e1b4b]/90">
                                <Plus className="mr-2 h-4 w-4" /> Submit Issue
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function FormItem({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}
