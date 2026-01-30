import { Metadata } from "next";
import HomeClient from "./components/HomeClient";

export const metadata: Metadata = {
  title: "Home | Kofi Benteh Afful",
  description:
    "Welcome to the official portal of Kofi Benteh Afful, MP for Sefwi Wiawso. Explore initiatives, projects, and latest updates.",
};

export default function PortalPage() {
  return <HomeClient />;
}
