"use client";

import Link from "next/link";
import { BookOpen, ArrowRight, Clock, User } from "lucide-react";
import { PolicyHero } from "./components/policies/PolicyHero";
import { BLOG_CATEGORY_ORDER, blogsGrouped, type BlogPost } from "@/lib/company-blogs-data";

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-100 bg-white overflow-hidden hover:border-brand-primary/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] transition-all"
    >
      <div className="sm:w-48 md:w-56 shrink-0 aspect-[16/10] sm:aspect-auto sm:min-h-[140px] relative overflow-hidden">
        <img
          src={post.coverImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800";
          }}
        />
      </div>
      <div className="flex-1 p-6 pt-5 sm:py-6 flex flex-col justify-center min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-2">{post.category}</p>
        <h3 className="text-lg font-semibold text-slate-800 tracking-tight group-hover:text-brand-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" aria-hidden />
            {post.author}
          </span>
          <span>{post.date}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {post.readMinutes} min read
          </span>
        </div>
        <span className="inline-flex items-center gap-2 mt-4 text-xs font-semibold uppercase tracking-widest text-brand-primary">
          Read article <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export default function BlogsPage() {
  const grouped = blogsGrouped();

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        icon={BookOpen}
        eyebrow="Insights · Blog"
        title={
          <>
            Notes on compliance,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-action">testing</span>, and food
            safety.
          </>
        }
        subtitle="Practical guides, regulatory shifts, and technical explainers from our network of food scientists and lab partners."
      />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-14">
        {BLOG_CATEGORY_ORDER.map((category) => {
          const posts = grouped[category];
          if (!posts || posts.length === 0) return null;

          return (
            <section key={category} className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-slate-200/80 pb-3">
                <h2 className="text-lg md:text-xl font-semibold text-slate-800 tracking-tight">{category}</h2>
                <span className="text-xs text-slate-400 font-medium">
                  {posts.length} {posts.length === 1 ? "article" : "articles"}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
