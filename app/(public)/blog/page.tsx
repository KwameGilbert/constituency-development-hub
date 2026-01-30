import { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "News & Articles",
  description:
    "Stay informed about the latest developments, news, and community stories from Sefwi Wiawso Constituency.",
};

export default function BlogPage() {
  return <BlogClient />;
}
