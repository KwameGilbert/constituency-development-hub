import React from "react";
import Link from "next/link";

const recentPosts = [
  {
    id: 1,
    title: "Sefwi Wiawso MCE and MP Collaborate to Reshape Road to Government Hospital Mortuary",
    date: "Jul 29, 2025",
  },
  {
    id: 2,
    title: "Sefwi Wiawso MP and MCE Collaborate to Empower Youth Through Ghana Labor Exchange Program",
    date: "Jul 29, 2025",
  },
  {
    id: 3,
    title: "Sefwi Dwinase Celebrates MCE's July 12th Birthday with Major Clean-Up Exercise, Upholding National Sanitation Vision",
    date: "Jul 29, 2025",
  },
  {
    id: 4,
    title: "Sefwi Wiawso MCE Announces New Overseas Job Opportunities for Youth, Targeting Motorbike Specialists",
    date: "Jul 29, 2025",
  },
  {
    id: 5,
    title: "Sefwi Wiawso MP Launches Digital Complaint and Feedback System to Boost Citizen Engagement.",
    date: "Jul 29, 2025",
  },
];

export function WebAdminRecentPosts() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Recent Blog Posts</h2>
        <Link href="/web-admin-dashboard/blog" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </Link>
      </div>
      <div className="divide-y divide-slate-50">
        {recentPosts.map((post) => (
          <div key={post.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-900 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500">{post.date}</p>
            </div>
            <Link
              href={`/web-admin-dashboard/blog/${post.id}/edit`}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
