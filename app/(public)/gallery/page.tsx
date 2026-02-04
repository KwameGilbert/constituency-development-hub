import { Metadata } from "next";
import { Suspense } from "react";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery - Our Moments",
  description:
    "Photo gallery of events, programs, and community development initiatives in Sefwi Wiawso Constituency.",
};

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      }
    >
      <GalleryClient />
    </Suspense>
  );
}
