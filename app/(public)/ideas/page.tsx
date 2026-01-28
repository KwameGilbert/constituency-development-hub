import { Metadata } from "next";
import IdeasClient from "./IdeasClient";

export const metadata: Metadata = {
  title: "Community Ideas | Constituency Development Hub",
  description:
    "Explore and vote on ideas submitted by the community to improve our constituency.",
};

export default function IdeasPage() {
  return <IdeasClient />;
}
