import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tasks = [
  {
    id: "aeda",
    title: "Broken Streetlight",
    location: "Sefwi Asafo, Sefwi Asawinso",
    status: "Rejected",
    category: "Health",
    date: "2025-10-01",
  },
  {
    id: "t6r6",
    title: "Pothole on Main Road",
    location: "Sefwi Boako",
    status: "Approved",
    category: "Economic Empowerment",
    date: "2025-09-28",
  },
  {
    id: "b7c8",
    title: "Water Leakage",
    location: "Zone B",
    status: "Pending",
    category: "Infrastructure",
    date: "2025-09-25",
  },
];

export function RecentTasks() {
  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          View all →
        </a>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ISSUE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead className="text-right">DATE</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">
                      {task.id}
                    </span>
                    <span className="text-xs text-slate-500">
                      {task.location}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      task.status === "Approved"
                        ? "bg-indigo-100 text-indigo-700 border-none"
                        : task.status === "Rejected"
                        ? "bg-red-100 text-red-700 border-none"
                        : "bg-orange-100 text-orange-700 border-none"
                    }
                  >
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500">
                  {task.category}
                </TableCell>
                <TableCell className="text-right text-slate-500">
                  {task.date}
                </TableCell>
                <TableCell className="text-right">
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    View
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
