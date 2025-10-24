"use client";

import BlogCard from "@/components/home/BlogCard";
import { BlogPost } from "@/lib/types/blogs.types";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BlogCardSkeleton } from "@/components/ui/SkeletonLoader";

interface RecentBlogData {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  views: number;
  likes: number;
  loves: number;
  totalReactions: number;
}

interface RecentBlogsSectionProps {
  initialData?: RecentBlogData[];
}

export default function RecentBlogsSection({
  initialData,
}: RecentBlogsSectionProps) {
  // Primary data source is server-side initialData
  const blogs = initialData || [];

  // Convert API blog data to BlogPost interface
  const convertApiBlogToInterface = (apiBlog: RecentBlogData): BlogPost => ({
    id: apiBlog.id,
    title: apiBlog.title,
    excerpt: apiBlog.excerpt,
    content: "", // Not needed for home page cards
    coverImage: apiBlog.thumbnail || "",
    author: {
      id: apiBlog.author.id,
      name: apiBlog.author.name,
      avatar: apiBlog.author.avatar || "",
      email: "", // Not available from API
    },
    tags: apiBlog.tags,
    publishedAt: apiBlog.publishedAt,
    readTime: Math.ceil(apiBlog.excerpt.length / 200), // Rough estimate
    views: apiBlog.views,
    likes: apiBlog.likes,
    is_reacted: false,
    is_featured: false,
  });

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Articles</h2>

      {!initialData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Articles Available
          </h3>
          <p className="text-gray-500">
            There are currently no articles to display. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} post={convertApiBlogToInterface(blog)} />
          ))}
        </div>
      )}

      {/* View all posts button */}
      {initialData && blogs.length > 0 && (
        <div className="mt-6 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-colors group"
          >
            <span>View all posts</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </section>
  );
}
