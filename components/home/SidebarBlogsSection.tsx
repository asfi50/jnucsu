"use client";

import BlogCard from "@/components/home/BlogCard";
import { BlogPost } from "@/lib/types/blogs.types";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { SidebarBlogSkeleton } from "@/components/ui/SkeletonLoader";

interface SidebarBlogsSectionProps {
  initialFeaturedBlog?: BlogPost | null;
  initialTrendingBlogs?: RecentBlogData[];
}

// Import RecentBlogData type
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

export default function SidebarBlogsSection({
  initialFeaturedBlog = null,
  initialTrendingBlogs,
}: SidebarBlogsSectionProps) {
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

  // Use server-side data for trending blogs
  const trendingBlogs = initialTrendingBlogs || [];

  return (
    <>
      {/* Featured Blog */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Featured Article</h2>
          <Link
            href="/blog"
            className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 transition-colors group"
          >
            <span>View blog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {initialFeaturedBlog ? (
          <BlogCard post={initialFeaturedBlog} featured />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No featured article available</p>
          </div>
        )}
      </section>

      {/* Trending Posts */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Trending Posts
        </h3>

        {!initialTrendingBlogs ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <SidebarBlogSkeleton key={index} />
            ))}
          </div>
        ) : trendingBlogs.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No trending posts available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trendingBlogs.map((blog) => (
              <BlogCard key={blog.id} post={convertApiBlogToInterface(blog)} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
