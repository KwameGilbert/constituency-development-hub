import { Metadata, ResolvingMetadata } from "next";
import { blogService } from "@/lib/services/blog-service";
import BlogPostClient from "./BlogPostClient";
import JsonLd from "@/components/seo/JsonLd";
import { getImageUrl } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;

  // Default metadata
  const defaultTitle = "Blog Post | Kofi Benteh Afful";
  const defaultDesc =
    "Read the latest news and updates from Hon. Kofi Benteh Afful.";

  try {
    const response = await blogService.getPostBySlug(slug);

    if (response.success && response.data.post) {
      const post = response.data.post;
      const previousImages = (await parent).openGraph?.images || [];

      return {
        title: post.title,
        description: post.excerpt || defaultDesc,
        openGraph: {
          title: post.title,
          description: post.excerpt || defaultDesc,
          images: post.image
            ? [getImageUrl(post.image), ...previousImages]
            : previousImages,
          type: "article",
          siteName: "Hon. Kofi Benteh Afful - Office of the MP",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://kofibenteh.com"}/blog/${slug}`,
          publishedTime: post.published_at,
          modifiedTime: post.published_at,
          authors: post.author ? [post.author] : ["Hon. Kofi Benteh Afful"],
          tags: (() => {
            try {
              const rawTags = post.tags as any;
              if (Array.isArray(rawTags)) return rawTags;
              if (typeof rawTags === "string") {
                // Handle both JSON arrays and simple comma-separated strings
                if (rawTags.startsWith("[")) return JSON.parse(rawTags);
                return rawTags.split(",").map((t: string) => t.trim());
              }
            } catch (e) {
              console.error("Failed to parse tags for metadata:", e);
            }
            return [];
          })(),
          locale: "en_GH",
        },
        twitter: {
          card: "summary_large_image",
          title: post.title,
          description: post.excerpt || defaultDesc,
          images: post.image ? [getImageUrl(post.image)] : undefined,
          site: "@kofibenteh",
          creator: post.author
            ? `@${post.author.replace(/\s+/g, "")}`
            : "@kofibenteh",
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch blog post metadata:", error);
  }

  return {
    title: defaultTitle,
    description: defaultDesc,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  let initialPost = null;

  try {
    const response = await blogService.getPostBySlug(slug);
    if (response.success && response.data.post) {
      initialPost = response.data.post;
    }
  } catch (error) {
    console.error("Failed to fetch blog post for rendering:", error);
  }

  const jsonLd = initialPost
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: initialPost.title,
        image: initialPost.image ? [getImageUrl(initialPost.image)] : [],
        datePublished: initialPost.published_at,
        dateModified: initialPost.published_at,
        author: {
          "@type": "Person",
          name: initialPost.author || "Kofi Benteh Afful",
        },
      }
    : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <BlogPostClient slug={slug} initialPost={initialPost} />
    </>
  );
}
