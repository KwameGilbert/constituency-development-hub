import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the office of Hon. Kofi Benteh Afful for inquiries, concerns, and suggestions.",
};

export default function ContactPage() {
  return <ContactClient />;
}
