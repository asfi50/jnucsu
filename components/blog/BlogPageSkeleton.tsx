import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BookOpen } from "lucide-react";

export default function BlogPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Call to Action Banner Skeleton */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 mb-8">
          <div className="h-6 bg-white/30 rounded animate-pulse mb-2 w-1/3"></div>
          <div className="h-4 bg-white/20 rounded animate-pulse mb-4 w-2/3"></div>
          <div className="h-10 bg-white/30 rounded animate-pulse w-32"></div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
            </div>
            <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Discover insights, stories, and thoughts from our student leaders
            and community members.
          </p>
        </div>

        {/* Search and Filters Skeleton */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post Skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
              {/* Featured Image Skeleton */}
              <div className="aspect-video bg-gray-300 animate-pulse"></div>

              <div className="p-6">
                {/* Featured Badge Skeleton */}
                <div className="h-6 bg-gray-300 rounded-full animate-pulse w-20 mb-4"></div>

                {/* Title Skeleton */}
                <div className="h-7 bg-gray-300 rounded animate-pulse mb-3 w-4/5"></div>
                <div className="h-7 bg-gray-300 rounded animate-pulse mb-4 w-3/5"></div>

                {/* Excerpt Skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
                </div>

                {/* Meta Info Skeleton */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-24"></div>
                      <div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-300 rounded-full animate-pulse w-16"></div>
                    <div className="h-6 bg-gray-300 rounded-full animate-pulse w-20"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Posts Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  {/* Post Image Skeleton */}
                  <div className="aspect-video bg-gray-300 animate-pulse"></div>

                  <div className="p-4">
                    {/* Tags Skeleton */}
                    <div className="flex space-x-2 mb-3">
                      <div className="h-5 bg-gray-300 rounded-full animate-pulse w-16"></div>
                      <div className="h-5 bg-gray-300 rounded-full animate-pulse w-20"></div>
                    </div>

                    {/* Title Skeleton */}
                    <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-4/5"></div>
                    <div className="h-5 bg-gray-300 rounded animate-pulse mb-3 w-3/5"></div>

                    {/* Excerpt Skeleton */}
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
                    </div>

                    {/* Meta Info Skeleton */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-300 rounded animate-pulse w-6"></div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-300 rounded animate-pulse w-6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Categories Skeleton */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-5 bg-gray-300 rounded animate-pulse mb-4 w-24"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-20"></div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-6"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Posts Skeleton */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-5 bg-gray-300 rounded animate-pulse mb-4 w-28"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="w-16 h-16 bg-gray-300 rounded animate-pulse flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter Skeleton */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-32"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse mb-4 w-full"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse mb-4 w-4/5"></div>
                <div className="h-10 bg-gray-300 rounded animate-pulse mb-2"></div>
                <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
