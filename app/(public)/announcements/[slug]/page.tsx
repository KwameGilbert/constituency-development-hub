import { Metadata, ResolvingMetadata } from "next";
import { announcementsService } from "@/lib/services/announcements-service";
import AnnouncementDetailClient from "./AnnouncementDetailClient";
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

  const defaultTitle = "Announcement | Constituency Development Hub";
  const defaultDesc = "Read important updates and notices from the constituency.";

  try {
    const response = await announcementsService.getAnnouncementBySlug(slug);

    if (response.success && response.data.announcement) {
      const announcement = response.data.announcement;
      const previousImages = (await parent).openGraph?.images || [];

      return {
        title: announcement.title,
        description: defaultDesc,
        openGraph: {
          title: announcement.title,
          description: defaultDesc,
          images: announcement.image_url
            ? [getImageUrl(announcement.image_url), ...previousImages]
            : previousImages,
          type: "article",
        },
        twitter: {
          card: "summary_large_image",
          title: announcement.title,
          description: defaultDesc,
          images: announcement.image_url
            ? [getImageUrl(announcement.image_url)]
            : undefined,
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch announcement metadata:", error);
  }

  return {
    title: defaultTitle,
    description: defaultDesc,
  };
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let initialAnnouncement = null;

  try {
    const response = await announcementsService.getAnnouncementBySlug(slug);
    if (response.success && response.data.announcement) {
      initialAnnouncement = response.data.announcement;
    }
  } catch (error) {
    console.error("Failed to fetch announcement for rendering:", error);
  }

  return (
    <AnnouncementDetailClient
      slug={slug}
      initialAnnouncement={initialAnnouncement}
    />
  );
}
