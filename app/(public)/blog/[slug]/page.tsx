import { Metadata, ResolvingMetadata } from "next";
import { blogService, BlogPost } from "@/lib/services/blog-service";
import BlogPostClient from "./BlogPostClient";
import JsonLd from "@/components/seo/JsonLd";
import { getImageUrl, cleanupHtml } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const defaultTitle = "Blog Post | Kofi Benteh Afful";
  const defaultDesc =
    "Read the latest news and updates from Hon. Kofi Benteh Afful.";

  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    if (!slug) return { title: defaultTitle, description: defaultDesc };

    const response = await blogService.getPostBySlug(slug);

    if (response?.success && response?.data?.post) {
      const post = response.data.post;
      let previousImages: string[] = [];
      try {
        const parentMeta = await parent;
        previousImages = (parentMeta?.openGraph?.images as string[]) || [];
      } catch {
        // Ignore parent metadata errors
      }

      const title = post.title || defaultTitle;
      const description = post.excerpt ? cleanupHtml(post.excerpt) : defaultDesc;
      const authorName =
        typeof post.author === "string" && post.author.trim()
          ? post.author
          : "Hon. Kofi Benteh Afful";

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: post.image
            ? [getImageUrl(post.image), ...previousImages]
            : previousImages,
          type: "article",
          siteName: "Hon. Kofi Benteh Afful - Office of the MP",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://kofibenteh.com"}/blog/${slug}`,
          publishedTime: post.published_at,
          modifiedTime: post.published_at,
          authors: [authorName],
          locale: "en_GH",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: post.image ? [getImageUrl(post.image)] : undefined,
          site: "@kofibenteh",
          creator: "@kofibenteh",
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
  let slug = "";
  let initialPost: BlogPost | null = null;

  try {
    const resolvedParams = await params;
    slug = resolvedParams?.slug || "";
    if (slug) {
      const response = await blogService.getPostBySlug(slug);
      if (response?.success && response?.data?.post) {
        initialPost = response.data.post;
      }
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
          name:
            typeof initialPost.author === "string" && initialPost.author.trim()
              ? initialPost.author
              : "Kofi Benteh Afful",
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
