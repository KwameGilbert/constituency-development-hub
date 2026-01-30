import { Metadata } from "next";
import AnnouncementsClient from "./AnnouncementsClient";

export const metadata: Metadata = {
  title: "Announcements | Constituency Development Hub",
  description:
    "Stay updated with the latest news and announcements from the constituency.",
};

export default function AnnouncementsPage() {
  return <AnnouncementsClient />;
}
