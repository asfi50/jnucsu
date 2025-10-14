import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";

export default function BlogPostSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 text-gray-300">
            <ArrowLeft className="w-4 h-4" />
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Article Header Skeleton */}
        <header className="mb-8">
          {/* Featured Image Skeleton */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-gray-300 animate-pulse"></div>

          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-6 w-16 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-6 w-14 bg-gray-300 rounded-full animate-pulse"></div>
          </div>

          {/* Title Skeleton */}
          <div className="mb-4">
            <div className="h-8 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="h-8 bg-gray-300 rounded animate-pulse w-3/4"></div>
          </div>

          {/* Excerpt Skeleton */}
          <div className="mb-6">
            <div className="h-5 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="h-5 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="h-5 bg-gray-300 rounded animate-pulse w-2/3"></div>
          </div>

          {/* Author and Meta Info Skeleton */}
          <div className="flex items-center justify-between py-4 border-y border-gray-200">
            <div className="flex items-center space-x-4">
              {/* Author Avatar Skeleton */}
              <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
              <div>
                {/* Author Name Skeleton */}
                <div className="h-5 w-32 bg-gray-300 rounded animate-pulse mb-2"></div>
                <div className="flex items-center space-x-4">
                  {/* Date Skeleton */}
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                  {/* Reading Time Skeleton */}
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Social Actions Skeleton */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 py-2">
                <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-1 py-2">
                <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </header>

        {/* Article Content Skeleton */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="space-y-4">
            {/* Paragraph skeletons */}
            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>

            <div className="my-6"></div>

            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse w-4/5"></div>

            <div className="my-6"></div>

            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>

            <div className="my-6"></div>

            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse w-2/3"></div>

            <div className="my-6"></div>

            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
          </div>
        </div>

        {/* Article Footer Skeleton */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </footer>

        {/* Comments Section Skeleton */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          {/* Comments Header Skeleton */}
          <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-6"></div>

          {/* Comment Form Skeleton */}
          <div className="mb-8">
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-20 bg-gray-300 rounded-lg animate-pulse mb-3"></div>
                <div className="flex justify-end">
                  <div className="h-8 w-28 bg-gray-300 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex space-x-4 items-start">
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-3 w-16 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  );
}
