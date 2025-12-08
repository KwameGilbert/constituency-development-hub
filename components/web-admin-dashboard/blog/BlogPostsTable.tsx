import React from "react";
import { Star, ExternalLink, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "Sefwi Wiawso MCE and MP Collaborate to Reshape Road to Government Hospital Mortuary",
    date: "Jul 29, 2025",
    comments: 0,
    isFeatured: true,
    image: "/placeholder-news-1.jpg"
  },
  {
    id: 2,
    title: "Sefwi Wiawso MP and MCE Collaborate to Empower Youth Through Ghana Labor Exchange Program",
    date: "Jul 29, 2025",
    comments: 0,
    isFeatured: true,
    image: "/placeholder-news-2.jpg"
  },
  {
    id: 3,
    title: "Sefwi Dwinase Celebrates MCE's July 12th Birthday with Major Clean-Up Exercise, Upholding National Sanitation Vision",
    date: "Jul 29, 2025",
    comments: 0,
    isFeatured: true,
    image: "/placeholder-news-3.jpg"
  },
  {
    id: 4,
    title: "Sefwi Wiawso MCE Announces New Overseas Job Opportunities for Youth, Targeting Motorbike Specialists",
    date: "Jul 29, 2025",
    comments: 0,
    isFeatured: false,
    image: "/placeholder-news-4.jpg"
  },
  {
    id: 5,
    title: "Sefwi Wiawso MP Launches Digital Complaint and Feedback System to Boost Citizen Engagement.",
    date: "Jul 29, 2025",
    comments: 0,
    isFeatured: true,
    image: "/placeholder-news-5.jpg"
  },
  {
    id: 6,
    title: "Sefwi Wiawso Constituency Secures Approval for 10 KM Road Construction",
    date: "Jul 29, 2025",
    comments: 0,
    isFeatured: true,
    image: null
  },
  {
    id: 7,
    title: "Sefwi Wiawso MP Extends Open Invitation to Investors, Highlights Constituency's Rich Potential",
    date: "Jul 29, 2025",
    comments: 0,
    isFeatured: true,
    image: "/placeholder-news-6.jpg"
  },
  {
    id: 8,
    title: "Sefwi Wiawso MP Pledges Support for Local Artists, Met with Rising Star Supa Sandy",
    date: "Jul 29, 2025",
    comments: 0,
    isFeatured: true,
    image: "/placeholder-news-7.jpg"
  },
  {
    id: 9,
    title: "Ghana to Observe National Day of Prayer and Thanksgiving on July 1st",
    date: "Jul 29, 2025",
    comments: 0,
    isFeatured: true,
    image: "/placeholder-news-8.jpg"
  },
  {
    id: 10,
    title: "Sefwi Wiawso Set for Economic Boom as Asawinso Market to Be Transformed into 24-Hour Hub",
    date: "Jul 29, 2025",
    comments: 0,
    isFeatured: true,
    image: "/placeholder-news-9.jpg"
  },
];

export function BlogPostsTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">Post</th>
              <th className="px-6 py-4 font-medium w-32">Date</th>
              <th className="px-6 py-4 font-medium w-24 text-center">Comments</th>
              <th className="px-6 py-4 font-medium w-40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {blogPosts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-200">
                      {post.image ? (
                        <div className="w-full h-full bg-slate-200" /> 
                        // Using placeholder div since we don't have actual images
                        // <Image src={post.image} alt="" width={48} height={48} className="object-cover w-full h-full" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <span className="font-medium text-slate-900 line-clamp-2 max-w-xl">
                      {post.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                  {post.date}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center h-6 px-2 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                    {post.comments}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-yellow-500">
                      <Star className={`h-4 w-4 ${post.isFeatured ? "fill-yellow-500 text-yellow-500" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Link href={`/web-admin-dashboard/blog/${post.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-sm text-slate-500">Showing 1 to 10 of 11 posts</p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-violet-50 text-violet-600 border-violet-200">1</Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-50">2</Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-50">{">"}</Button>
        </div>
      </div>
    </div>
  );
}
