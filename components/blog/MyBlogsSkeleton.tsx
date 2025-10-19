import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MyBlogsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Blog Posts
            </h1>
            <p className="text-gray-600">
              Manage your blog posts, track their status, and create new
              content.
            </p>
          </div>
          <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-8 bg-gray-300 rounded animate-pulse mb-2 w-12"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-16"></div>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex space-x-8">
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className="h-5 bg-gray-300 rounded animate-pulse w-16"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {/* Status Badge Skeleton */}
                    <div className="h-6 bg-gray-300 rounded-full animate-pulse w-20"></div>
                    {/* Date Skeleton */}
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-24"></div>
                  </div>

                  {/* Title Skeleton */}
                  <div className="h-6 bg-gray-300 rounded animate-pulse mb-2 w-3/4"></div>

                  {/* Excerpt Skeleton */}
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
                  </div>

                  {/* Meta Info Skeleton */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-12"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-8"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-8"></div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Skeleton */}
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 mt-8">
          <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse mx-auto mb-4"></div>
          <div className="h-6 bg-gray-300 rounded animate-pulse mb-2 w-48 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse mb-6 w-64 mx-auto"></div>
          <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32 mx-auto"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
