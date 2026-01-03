"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { blogService, BlogPost } from "@/lib/services/blog-service";
import { Loader2, Calendar, Tag, ArrowLeft, Share2, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      
      try {
        setLoading(true);
        const response = await blogService.getPostBySlug(slug);
        if (response.success && response.data.post) {
          setPost(response.data.post);
        } else {
          setError("Article not found");
        }
      } catch {
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
          <p className="text-slate-600 mb-8">{error || "The article you're looking for doesn't exist."}</p>
          <Link href="/blog">
            <Button className="bg-amber-500 hover:bg-amber-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      {post.image && (
        <div className="relative h-[400px] lg:h-[500px] bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title || "Article image"}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <main className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Article Card */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`bg-white rounded-2xl shadow-xl ${post.image ? '-mt-32 relative' : 'mt-8'} p-8 lg:p-12`}
        >
          {/* Back Link */}
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-amber-600 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {post.category && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                <Tag className="h-3.5 w-3.5" />
                {post.category}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.published_at), "MMMM d, yyyy")}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              5 min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author */}
          {post.author && (
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100">
              <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{post.author}</p>
                <p className="text-sm text-slate-500">Author</p>
              </div>
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          {post.content ? (
            <div 
              className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-amber-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="text-slate-600 leading-relaxed space-y-4">
              <p>{post.excerpt}</p>
              <p className="text-slate-400 italic">
                Full article content coming soon...
              </p>
            </div>
          )}

          {/* Tags */}
          {(() => {
            const tags = Array.isArray(post.tags) 
              ? post.tags 
              : typeof post.tags === 'string' 
                ? JSON.parse(post.tags) 
                : [];
            
            return tags.length > 0 ? (
              <div className="mt-12 pt-8 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-slate-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">Share this article</p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.article>

        {/* Related Articles CTA */}
        <div className="my-16 text-center">
          <Link href="/blog">
            <Button variant="outline" className="rounded-full px-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View more articles
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default BlogPostPage;
