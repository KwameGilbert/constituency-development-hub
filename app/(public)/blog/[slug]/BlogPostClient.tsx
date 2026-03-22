"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { blogService, BlogPost } from "@/lib/services/blog-service";
import {
  Loader2,
  Calendar,
  Tag,
  ArrowLeft,
  Share2,
  Clock,
  User,
  X,
  Check,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/utils";
import SanitizedHtml from "@/components/ui/SanitizedHtml";
import { cleanupHtml } from "@/lib/utils";
import RelatedPosts from "@/components/blog/RelatedPosts";

interface BlogPostClientProps {
  initialPost?: BlogPost | null;
  slug: string;
}

export default function BlogPostClient({
  initialPost,
  slug,
}: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(initialPost || null);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState<string | null>(initialPost ? null : null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const sharePopupRef = useRef<HTMLDivElement>(null);

  // Get the current URL for sharing
  const getShareUrl = useCallback(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  }, []);

  // Share to different platforms
  const shareToFacebook = useCallback(() => {
    const url = encodeURIComponent(getShareUrl());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "width=600,height=400",
    );
  }, [getShareUrl]);

  const shareToTwitter = useCallback(() => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(post?.title || "Check out this article");
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
      "width=600,height=400",
    );
  }, [getShareUrl, post?.title]);

  const shareToWhatsApp = useCallback(() => {
    const text = encodeURIComponent(
      `${post?.title || "Check out this article"} - ${getShareUrl()}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }, [getShareUrl, post?.title]);

  // copyToClipboard must be defined before shareToInstagram to avoid stale closure
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = getShareUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [getShareUrl]);

  const shareToInstagram = useCallback(() => {
    // Instagram doesn't have a direct share URL, so we copy to clipboard and open Instagram
    copyToClipboard();
    window.open("https://www.instagram.com/", "_blank");
  }, [copyToClipboard]);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sharePopupRef.current &&
        !sharePopupRef.current.contains(event.target as Node)
      ) {
        setShowSharePopup(false);
      }
    }

    if (showSharePopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSharePopup]);

  useEffect(() => {
    async function fetchPost() {
      if (initialPost) return; // Don't fetch if we have initial data
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
  }, [slug, initialPost]);

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
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-slate-600 mb-8">
            {error || "The article you're looking for doesn't exist."}
          </p>
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
            src={getImageUrl(post.image)}
            alt={post.title || "Article image"}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Article Card */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`bg-white rounded-2xl shadow-xl ${post.image ? "-mt-32 relative" : "mt-8"} p-8 lg:p-12`}
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
                {(() => {
                  try {
                    const date = new Date(post.published_at);
                    if (isNaN(date.getTime())) return "Recently Published";
                    return format(date, "MMMM d, yyyy");
                  } catch (e) {
                    return "Recently Published";
                  }
                })()}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <Clock className="h-4 w-4" />5 min read
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
              {cleanupHtml(post.excerpt)}
            </p>
          )}

          {/* Content */}
          {post.content ? (
            <SanitizedHtml
              html={post.content}
              className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-amber-600 prose-img:rounded-xl"
            />
          ) : (
            <div className="text-slate-600 leading-relaxed space-y-4">
              <p>{cleanupHtml(post.excerpt || "")}</p>
              <p className="text-slate-400 italic">
                Full article content coming soon...
              </p>
            </div>
          )}

          {/* Tags */}
          {(() => {
            const tags = (() => {
              try {
                const rawTags = post.tags as any;
                if (Array.isArray(rawTags)) return rawTags;
                if (typeof rawTags === "string") {
                  if (rawTags.startsWith("[")) return JSON.parse(rawTags);
                  return rawTags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                }
              } catch (e) {
                console.warn("Malformed tags:", post.tags);
              }
              return [];
            })();

            return tags.length > 0 ? (
              <div className="mt-12 pt-8 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Tags
                </h3>
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
          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between relative">
            <p className="text-sm text-slate-500">Share this article</p>
            <div className="relative" ref={sharePopupRef}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setShowSharePopup(!showSharePopup)}
              >
                <Share2 className="h-4 w-4" />
              </Button>

              {/* Share Popup */}
              <AnimatePresence>
                {showSharePopup && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full right-0 mb-3 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 min-w-[280px] z-50"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-slate-900">
                        Share this article
                      </h4>
                      <button
                        onClick={() => setShowSharePopup(false)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Image Preview */}
                    {post?.image && (
                      <div className="mb-4 rounded-lg overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getImageUrl(post.image)}
                          alt={post.title || "Article preview"}
                          className="w-full h-24 object-cover"
                        />
                      </div>
                    )}

                    {/* Title Preview */}
                    <p className="text-sm text-slate-700 font-medium mb-4 line-clamp-2">
                      {post?.title}
                    </p>

                    {/* Social Media Icons */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {/* Facebook */}
                      <button
                        onClick={shareToFacebook}
                        className="w-12 h-12 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                        title="Share on Facebook"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </button>

                      {/* WhatsApp */}
                      <button
                        onClick={shareToWhatsApp}
                        className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20BD5C] text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                        title="Share on WhatsApp"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </button>

                      {/* Twitter/X */}
                      <button
                        onClick={shareToTwitter}
                        className="w-12 h-12 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                        title="Share on X (Twitter)"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </button>

                      {/* Instagram */}
                      <button
                        onClick={shareToInstagram}
                        className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white flex items-center justify-center transition-opacity shadow-md hover:shadow-lg"
                        title="Share on Instagram (copies link)"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </button>
                    </div>

                    {/* Copy Link Button */}
                    <button
                      onClick={copyToClipboard}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                        copied
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span className="font-medium">Link copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="font-medium">Copy link</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.article>

        {/* Related Articles */}
        <RelatedPosts currentId={post.id} category={post.category} />

        {/* View more CTA */}
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
