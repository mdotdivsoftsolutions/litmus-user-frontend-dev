import type { Metadata } from "next";
import BlogsPage from "@/views/user/BlogsPage";

export const metadata: Metadata = {
  title: "Insights & Food Safety Blog | Litmus",
  description: "Practical guides, regulatory shifts, and technical explainers from our network of food scientists and lab partners.",
};

export default function Page() {
  return <BlogsPage />;
}