import type { Metadata } from "next";
import BlogDetailPage from "@/views/user/BlogDetailPage";
import { getBlogBySlug } from "@/lib/company-blogs-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) {
    return {
      title: "Article Not Found | Litmus Blog",
    };
  }
  return {
    title: `${post.title} | Litmus Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <BlogDetailPage slug={slug} />;
}
