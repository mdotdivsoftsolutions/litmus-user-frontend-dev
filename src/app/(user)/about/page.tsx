import type { Metadata } from "next";
import AboutPage from "@/views/user/AboutPage";

export const metadata: Metadata = {
  title: "About Us | Litmus Testing Network",
  description: "Learn about Litmus - India's unified testing marketplace connecting businesses and consumers with accredited testing laboratories.",
};

export default function Page() {
  return <AboutPage />;
}