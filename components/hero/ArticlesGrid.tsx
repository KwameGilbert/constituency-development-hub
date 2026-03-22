"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { blogService, BlogPost } from "@/lib/services/blog-service";
import { Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { cleanupHtml } from "@/lib/utils";

function ArticlesGrid() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Try featured posts first, fall back to regular posts
        let response = await blogService.getFeaturedPosts(3);

        if (
          response.success &&
          response.data.posts &&
          response.data.posts.length > 0
        ) {
          setPosts(response.data.posts.slice(0, 3));
        } else {
          // Fall back to regular posts
          response = await blogService.getAllPosts(1, 3);
          if (
            response.success &&
            response.data.posts &&
            response.data.posts.length > 0
          ) {
            setPosts(response.data.posts);
          } else {
            setPosts([]);
          }
        }
      } catch {
        // API error - show empty state
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500">
              News & Blog
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Featured Articles
            </h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500">
            News & Blog
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Featured Articles
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              aria-label={`Read ${post.title}`}
              className="block rounded-2xl overflow-hidden"
            >
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg transition"
              >
                <div className="h-48 overflow-hidden relative bg-slate-100">
                  {post.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getImageUrl(post.image)}
                      alt={post.title || "Blog post"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                      <span>No image</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center gap-2">
                    {post.category && (
                      <span className="text-xs font-medium uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {cleanupHtml(post.excerpt || "")}
                  </p>
                  <span className="text-sm font-semibold text-red-600">
                    Read story →
                  </span>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 hover:text-red-600 transition-colors"
          >
            View all articles
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ArticlesGrid;
