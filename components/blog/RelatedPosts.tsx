"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { blogService, BlogPost } from "@/lib/services/blog-service";
import { getImageUrl } from "@/lib/utils";
import { cleanupHtml } from "@/lib/utils";

interface RelatedPostsProps {
  currentId?: number | null;
  category?: string | null;
  limit?: number;
}

export default function RelatedPosts({
  currentId,
  category,
  limit = 3,
}: RelatedPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchRelated() {
      try {
        setLoading(true);
        const resp = await blogService.getAllPosts(1, 6);
        if (!resp.success || !resp.data.posts) {
          setPosts([]);
          return;
        }

        const all = resp.data.posts;

        // Prefer same-category posts excluding current
        let related = all.filter((p) => p.id !== currentId && p.category === category);

        // If not enough related, fill with other posts
        if (related.length < limit) {
          const others = all.filter((p) => p.id !== currentId && !related.find((r) => r.id === p.id));
          related = [...related, ...others].slice(0, limit);
        } else {
          related = related.slice(0, limit);
        }

        if (mounted) setPosts(related);
      } catch (e) {
        if (mounted) setPosts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchRelated();

    return () => {
      mounted = false;
    };
  }, [currentId, category, limit]);

  if (loading) return null;
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-16">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">Related articles</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/blog/${p.slug}`}
            className="block rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
            aria-label={`Read ${p.title}`}
          >
            <div className="h-28 overflow-hidden bg-slate-100">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getImageUrl(p.image)}
                  alt={p.title || "Related article"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No image</div>
              )}
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">{p.title}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cleanupHtml(p.excerpt || "")}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
