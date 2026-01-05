import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Hon. Kofi Benteh Afful",
  description: "Biography, career, and parliamentary mandate of Hon. Kofi Benteh Afful, Member of Parliament for Sefwi Wiawso.",
};

export default function AboutPage() {
  return <AboutClient />;
}
