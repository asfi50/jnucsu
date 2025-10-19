"use client";

import { useRecentBlogs } from "@/hooks/use-home-blogs";
import BlogCard from "@/components/home/BlogCard";
import { BlogPost } from "@/lib/types/blogs.types";
import Link from "next/link";
import { ArrowRight, BookOpen, RefreshCw } from "lucide-react";
import { BlogCardSkeleton } from "@/components/ui/SkeletonLoader";
import { useState } from "react";

export default function RecentBlogsSection() {
  const { blogs: recentBlogs, loading, error, refetch } = useRecentBlogs(6);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await refetch();
    setIsRetrying(false);
  };

  // Convert API blog data to BlogPost interface
  interface ApiBlogData {
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
  }

  const convertApiBlogToInterface = (apiBlog: ApiBlogData): BlogPost => ({
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Unable to Load Articles
          </h3>
          <p className="text-gray-500 mb-4">
            We&apos;re having trouble loading the latest articles. Please try
            again.
          </p>
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 mx-auto disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
            />
            <span>{isRetrying ? "Retrying..." : "Try Again"}</span>
          </button>
        </div>
      ) : recentBlogs.length === 0 ? (
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
          {recentBlogs.map((blog) => (
            <BlogCard key={blog.id} post={convertApiBlogToInterface(blog)} />
          ))}
        </div>
      )}

      {/* View all posts button */}
      {!loading && !error && recentBlogs.length > 0 && (
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
