import React from "react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TaskForceReports, TeamMember } from "@/lib/services/task-force-service";

interface ReportPrintLayoutProps {
  reports: TaskForceReports | null;
  teamMembers: TeamMember[];
  velocityData: { date: string; assessments: number; resolved: number }[];
  dateRange: { from: Date | undefined; to: Date | undefined };
  notes: string;
  automatedInsights: string[];
  mpName?: string;
  constituency?: string;
}

const COLORS = {
  primary: "#7e22ce",
  secondary: "#a855f7",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  neutral: "#94a3b8",
};

export function ReportPrintLayout({
  reports,
  teamMembers,
  velocityData,
  dateRange,
  notes,
  automatedInsights,
  mpName = "Hon. Kofi Benteh Afful",
  constituency = "Sefwi Wiawso Constituency",
}: ReportPrintLayoutProps) {
  if (!reports) return null;

  const resolutionRate = reports.total_issues
    ? Math.round((reports.resolved_issues / reports.total_issues) * 100)
    : 0;

  // Status Data for Pie Chart
  const statusData = [
    { name: "Pending", value: reports.status_distribution.assigned_to_task_force || 0, color: COLORS.info },
    {
      name: "In Progress",
      value: (reports.status_distribution.assessment_in_progress || 0) + (reports.status_distribution.resolution_in_progress || 0),
      color: "#f97316",
    },
    { name: "Resolved", value: reports.status_distribution.resolved || 0, color: COLORS.success },
    { name: "Closed", value: reports.status_distribution.closed || 0, color: "#166534" },
  ].filter((item) => item.value > 0);

  return (
    <div className="hidden print:block font-sans text-gray-900 bg-white">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          .no-break {
            break-inside: avoid;
          }
        }
      `}</style>

      {/* --- PAGE 1: COVER & EXECUTIVE SUMMARY --- */}
      <div className="page-break flex flex-col justify-between h-[250mm]">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-1">
                Office of the Member of Parliament
              </h2>
              <h1 className="text-3xl font-extrabold text-gray-900">{constituency}</h1>
              <p className="text-lg font-medium text-gray-700 mt-1">{mpName}</p>
            </div>
            <div className="text-right">
              <div className="bg-gray-900 text-white px-4 py-1 inline-block text-sm font-bold uppercase tracking-wider mb-2">
                Official Report
              </div>
              <p className="text-sm text-gray-500">Task Force Field Verification</p>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="my-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Field Verification Report</h1>
          <p className="text-xl text-gray-600">
             Period: {dateRange.from ? format(dateRange.from, "MMMM d, yyyy") : "N/A"} -{" "}
            {dateRange.to ? format(dateRange.to, "MMMM d, yyyy") : "N/A"}
          </p>
          <p className="text-sm text-gray-400 mt-2">Generated on {format(new Date(), "PPP p")}</p>
        </div>

        {/* Executive Summary */}
        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 flex-grow mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Executive Summary</h3>
          <p className="text-justify leading-relaxed text-gray-800 text-lg">
            This report summarizes the field verification activities conducted within {constituency} for
            the selected period. Attempts were made to assess a total of <span className="font-bold">{reports.total_issues}</span> reported issues across various sectors.
            Currently, <span className="font-bold">{reports.resolved_issues}</span> issues have been successfully resolved,
            resulting in an overall resolution efficiency of <span className="font-bold">{resolutionRate}%</span>.
          </p>
          <p className="text-justify leading-relaxed text-gray-800 text-lg mt-4">
            {resolutionRate > 80
              ? "The Task Force has demonstrated high efficiency in addressing community concerns promptly."
              : resolutionRate < 50
              ? "Immediate attention is required to improve the resolution turnover rate and address the backlog of pending assessments."
              : "Steady progress is being made, though accelerated efforts are recommended to clear pending items."}
             {" "}Active monitoring continues for outstanding items categorized under follow-up.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 flex justify-between text-xs text-gray-400">
          <span>Task Force Dashboard</span>
          <span>Page 1</span>
        </div>
      </div>

      {/* --- PAGE 2: KEY METRICS & INSIGHTS --- */}
      <div className="page-break h-[250mm] flex flex-col">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Key Metrics & Insights</h2>

        {/* Metrics Table */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-3 text-left">Metric</th>
                <th className="border border-gray-300 p-3 text-right">Count</th>
                <th className="border border-gray-300 p-3 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3 font-medium">Total Issues</td>
                <td className="border border-gray-300 p-3 text-right">{reports.total_issues}</td>
                <td className="border border-gray-300 p-3 text-gray-500 text-sm">Valid reports received</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-medium">Resolved</td>
                <td className="border border-gray-300 p-3 text-right">{reports.resolved_issues}</td>
                <td className="border border-gray-300 p-3 text-gray-500 text-sm">Successfully closed</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-medium">Under Follow-up</td>
                <td className="border border-gray-300 p-3 text-right">
                    {(reports.status_distribution.assessment_in_progress || 0) + (reports.status_distribution.resolution_in_progress || 0)}
                </td>
                <td className="border border-gray-300 p-3 text-gray-500 text-sm">Active investigation/work</td>
              </tr>
              <tr className="bg-gray-50 font-bold">
                <td className="border border-gray-300 p-3">Resolution Rate</td>
                <td className="border border-gray-300 p-3 text-right">{resolutionRate}%</td>
                <td className="border border-gray-300 p-3 text-gray-500 text-sm">Target &gt; 75%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Priority Breakdown (simulated as Category Breakdown since data availability varies) */}
        <div className="mb-8 break-inside-avoid">
            <h3 className="text-lg font-bold mb-4">Priority Breakdown</h3>
            <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-3 text-left">Priority Level</th>
                <th className="border border-gray-300 p-3 text-right">Count</th>
                <th className="border border-gray-300 p-3 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
                {Object.entries(reports.priority_distribution).map(([key, value]) => (
                    <tr key={key}>
                        <td className="border border-gray-300 p-3 capitalize">{key}</td>
                        <td className="border border-gray-300 p-3 text-right">{value}</td>
                        <td className="border border-gray-300 p-3 text-right">
                            {reports.total_issues ? Math.round((value / reports.total_issues) * 100) : 0}%
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>

         {/* Footer */}
         <div className="mt-auto border-t border-gray-200 pt-4 flex justify-between text-xs text-gray-400">
          <span>Task Force Dashboard</span>
          <span>Page 2</span>
        </div>
      </div>

       {/* --- PAGE 3: ACTIVITY & STATUS ANALYSIS --- */}
       <div className="page-break h-[250mm] flex flex-col">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Activity & Status Analysis</h2>

        <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Chart 1: Status Distribution */}
             <div className="break-inside-avoid">
                <h3 className="text-lg font-bold mb-2">Status Distribution</h3>
                <div className="h-[250px] border border-gray-200 rounded p-4 flex items-center justify-center">
                    {/* Recharts can be tricky in print, but using a simple Pie with fixed dimensions usually works */}
                     <PieChart width={300} height={250}>
                        <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                             {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                     </PieChart>
                </div>
                <p className="mt-2 text-sm text-gray-600 italic">
                    Figure 1: Current distribution of issue statuses.
                </p>
            </div>

             {/* Chart 2: Activity Trend (Velocity) */}
             <div className="break-inside-avoid">
                <h3 className="text-lg font-bold mb-2">Activity Trend (Last 30 Days)</h3>
                <div className="h-[250px] border border-gray-200 rounded p-4">
                     <BarChart width={300} height={220} data={velocityData.slice(0, 7)}> {/* Show only last 7 days for cleanliness in print */}
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Bar dataKey="assessments" name="New" fill={COLORS.primary} />
                        <Bar dataKey="resolved" name="Resolved" fill={COLORS.success} />
                     </BarChart>
                </div>
                 <p className="mt-2 text-sm text-gray-600 italic">
                    Figure 2: Daily volume of new vs resolved assessments (Recent sample).
                </p>
            </div>
        </div>

        <div className="mb-8">
            <h3 className="text-lg font-bold mb-2">Workload Analysis</h3>
            <p className="text-gray-800 leading-relaxed">
                The current workload indicates a {resolutionRate > 50 ? "healthy" : "challenging"} balance between incoming reports and resolutions.
                The status distribution shows that {reports.status_distribution.assigned_to_task_force} issues are currently pending initial assessment.
                Resource allocation should prioritize high-impact areas identified in the priority breakdown.
            </p>
        </div>

         {/* Footer */}
         <div className="mt-auto border-t border-gray-200 pt-4 flex justify-between text-xs text-gray-400">
          <span>Task Force Dashboard</span>
          <span>Page 3</span>
        </div>
       </div>

        {/* --- PAGE 4: TEAM PERFORMANCE (INTERNAL) --- */}
        <div className="page-break h-[250mm] flex flex-col">
          <div className="flex justify-between items-center border-b pb-2 mb-6">
            <h2 className="text-2xl font-bold">Team Performance</h2>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 uppercase border border-red-200">
                Internal Use Only
            </span>
          </div>

          <table className="w-full border-collapse border border-gray-300 text-sm mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Officer</th>
                <th className="border border-gray-300 p-2 text-left">Role</th>
                <th className="border border-gray-300 p-2 text-center">Assessed</th>
                <th className="border border-gray-300 p-2 text-center">Resolved</th>
                <th className="border border-gray-300 p-2 text-center">Efficiency</th>
                <th className="border border-gray-300 p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
                {teamMembers.slice(0, 15).map((member) => ( // Limit to fit on page
                  <tr key={member.id}>
                    <td className="border border-gray-300 p-2 font-medium">{member.name}</td>
                    <td className="border border-gray-300 p-2 text-gray-600">{member.title || "Officer"}</td>
                    <td className="border border-gray-300 p-2 text-center">{member.assessments_completed}</td>
                    <td className="border border-gray-300 p-2 text-center">{member.resolutions_completed}</td>
                    <td className="border border-gray-300 p-2 text-center">{member.completion_rate}%</td>
                    <td className="border border-gray-300 p-2 text-center capitalize">{member.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          
          <div className="bg-blue-50 p-4 border border-blue-100 rounded mb-4">
             <h3 className="font-bold text-blue-900 mb-2">Automated System Insights</h3>
             <ul className="list-disc pl-5 space-y-1 text-blue-800 text-sm">
                {automatedInsights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
                ))}
             </ul>
          </div>

           {/* Footer */}
         <div className="mt-auto border-t border-gray-200 pt-4 flex justify-between text-xs text-gray-400">
          <span>Task Force Dashboard</span>
          <span className="text-red-400">CONFIDENTIAL – INTERNAL USE ONLY</span>
          <span>Page 4</span>
        </div>
        </div>

        {/* --- PAGE 5: NOTES & SIGN-OFF --- */}
        <div className="flex flex-col h-[250mm]">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Notes & Sign-off</h2>

            <div className="mb-8">
                <h3 className="text-lg font-bold mb-2">Officer Notes & Interpretation</h3>
                <div className="border border-gray-300 rounded p-4 min-h-[150px] bg-gray-50 text-gray-800 whitespace-pre-wrap">
                    {notes || "No additional notes provided."}
                </div>
            </div>

            <div className="mb-12">
                <h3 className="text-lg font-bold mb-2">Recommendations</h3>
                <div className="border border-gray-300 rounded p-4 min-h-[150px] bg-white text-gray-800">
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Maintain regular monitoring of high-priority tickets.</li>
                        <li>Ensure all field officers sync their devices daily to update resolution status.</li>
                        {resolutionRate < 60 && <li>Urgent review of resource allocation is recommended to improve resolution rate.</li>}
                        <li>[ ] Review Pending</li>
                        <li>[ ] Approve Budget</li>
                    </ul>
                </div>
            </div>

            <div className="mt-auto mb-12">
                <div className="grid grid-cols-2 gap-12">
                    <div>
                        <div className="border-b border-gray-400 h-12 w-full mb-2"></div>
                        <p className="font-bold">Task Force Coordinator</p>
                        <p className="text-xs text-gray-500">Signature</p>
                    </div>
                    <div>
                        <div className="border-b border-gray-400 h-12 w-full mb-2"></div>
                        <p className="font-bold">Date</p>
                        <p className="text-xs text-gray-500">DD / MM / YYYY</p>
                    </div>
                </div>
            </div>

             {/* Footer */}
             <div className="border-t border-gray-200 pt-4 flex justify-between text-xs text-gray-400">
                <span>Task Force Dashboard</span>
                <span>Page 5</span>
            </div>
        </div>

    </div>
  );
}
