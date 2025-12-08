import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Hourglass,
  ThumbsUp,
  Loader2,
  CheckCircle,
} from "lucide-react";

const metrics = [
  {
    label: "Total Issues",
    value: "2",
    icon: FileText,
    color: "text-slate-600",
    bgColor: "bg-slate-100",
  },
  {
    label: "Pending",
    value: "0",
    icon: Hourglass,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    label: "Approved",
    value: "1",
    icon: ThumbsUp,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  {
    label: "In Progress",
    value: "0",
    icon: Loader2,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    label: "Resolved",
    value: "0",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
];

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {metrics.map((metric) => (
        <Card key={metric.label} className="border-none shadow-sm">
          <CardContent className="px-4 py-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </p>
              <h3 className="text-xl font-bold">{metric.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
