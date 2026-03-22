"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Book,
  HelpCircle,
  Headphones,
  Wrench,
  PlayCircle,
  FileText,
  Users,
  BarChart,
  Phone,
  Mail,
  AlertTriangle,
  Lightbulb,
  Send,
} from "lucide-react";

export function HelpSections() {
  return (
    <div className="space-y-8">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TopCard
          icon={<Book className="h-6 w-6 text-blue-600" />}
          title="User Guide"
          description="Complete documentation"
          bgColor="bg-blue-50"
        />
        <TopCard
          icon={<HelpCircle className="h-6 w-6 text-green-600" />}
          title="FAQs"
          description="Common questions"
          bgColor="bg-green-50"
        />
        <TopCard
          icon={<Headphones className="h-6 w-6 text-purple-600" />}
          title="Contact Support"
          description="Get direct help"
          bgColor="bg-purple-50"
        />
        <TopCard
          icon={<Wrench className="h-6 w-6 text-orange-600" />}
          title="Troubleshooting"
          description="Solve common issues"
          bgColor="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <PlayCircle className="h-6 w-6 text-[#1e1b4b]" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This system helps you efficiently manage issues, oversee agents,
                and generate comprehensive reports.
              </p>
              <div>
                <h4 className="font-semibold mb-2">System Overview</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  As an officer, you can:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>Review and approve issues submitted by field agents</li>
                  <li>Manage agent accounts and monitor their performance</li>
                  <li>Generate detailed reports and analytics</li>
                  <li>Track issue resolution progress and trends</li>
                  <li>Communicate with agents and provide feedback</li>
                </ul>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md flex gap-3">
                <div className="mt-0.5">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-sm text-blue-700">
                  Your dashboard provides real-time insights into system
                  performance. Check it regularly for updates and pending tasks.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Officer Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Book className="h-6 w-6 text-[#1e1b4b]" />
                Officer Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold text-base">
                          Using the Dashboard
                        </div>
                        <div className="text-xs text-muted-foreground font-normal">
                          Overview of key metrics and quick actions
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    The dashboard provides a comprehensive overview of your
                    system activities:
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold text-base">
                          Managing Issues
                        </div>
                        <div className="text-xs text-muted-foreground font-normal">
                          Review, approve, and track issue resolution
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Issue management involves several key steps:
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Users className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold text-base">
                          Agent Management
                        </div>
                        <div className="text-xs text-muted-foreground font-normal">
                          Oversee agent accounts and performance
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Effective agent management includes:
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <BarChart className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold text-base">
                          Reports & Analytics
                        </div>
                        <div className="text-xs text-muted-foreground font-normal">
                          Generate insights and performance reports
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    The reporting system provides comprehensive analytics:
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <HelpCircle className="h-6 w-6 text-[#1e1b4b]" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger className="font-medium">
                    How do I approve or reject an issue?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Navigate to the Issues section, click on the issue you want
                    to review, and use the status update options to approve or
                    reject with comments explaining your decision.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger className="font-medium">
                    Can I modify agent assignments?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, you can edit agent profiles to change their electoral
                    area assignments, contact information, and account status
                    through the Agent Management section.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger className="font-medium">
                    How do I generate monthly reports?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Go to the Reports section, select your desired date range
                    and filters, then use the export options to generate reports
                    in PDF or Excel format.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4">
                  <AccordionTrigger className="font-medium">
                    What should I do if an agent reports duplicate issues?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Review both issues carefully, merge information if
                    necessary, reject the duplicate with an explanation, and
                    provide feedback to the agent to prevent future duplicates.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-8">
          {/* Contact Support Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Headphones className="h-6 w-6 text-[#1e1b4b]" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Subject <span className="text-red-500">*</span>
                </label>
                <Input placeholder="Brief description of your issue" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="account">Account Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">
                      Medium - Standard issue
                    </SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Please describe your issue in detail..."
                  className="min-h-[100px]"
                />
              </div>
              <Button className="w-full bg-[#1e1b4b] hover:bg-[#1e1b4b]/90 gap-2">
                <Send className="h-4 w-4" />
                Submit Ticket
              </Button>
            </CardContent>
          </Card>

          {/* Support Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Phone Support</div>
                  <div className="text-sm text-muted-foreground">
                    +233 30 212 3456
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Mon-Fri, 8am-5pm
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="bg-green-100 p-2 rounded-full">
                  <Mail className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Email Support</div>
                  <div className="text-sm text-muted-foreground">
                    support@swma.gov.gh
                  </div>
                  <div className="text-xs text-muted-foreground">
                    24-48 hour response
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Emergency</div>
                  <div className="text-sm text-muted-foreground">
                    +233 30 212 3457
                  </div>
                  <div className="text-xs text-muted-foreground">
                    24/7 for critical issues
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 items-start">
                <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Review issues promptly to maintain system efficiency
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Use filters to quickly find specific issues or agents
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Generate regular reports to track performance trends
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Provide clear feedback when rejecting issues
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TopCard({
  icon,
  title,
  description,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}
