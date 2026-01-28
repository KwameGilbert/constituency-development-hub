import { Metadata } from "next";
import YouthClient from "./YouthClient";

export const metadata: Metadata = {
  title: "Youth Registration",
  description:
    "Register for the Sefwi Wiawso Youth Skills Acceleration Program and other employment opportunities.",
};

export default function YouthPage() {
  return <YouthClient />;
}
