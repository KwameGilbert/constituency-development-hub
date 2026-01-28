"use client";

import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import {
  HelpCircle,
  MessageCircle,
  FileText,
  Send,
  LifeBuoy,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HelpSections } from "@/components/officer-dashboard/help/HelpSections";

export default function HelpPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Help & Support"
        description="Get assistance, view documentation, and contact support"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <HelpSections />
      </div>
    </div>
  );
}
