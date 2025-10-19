import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";

export default function UserProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 text-gray-300">
            <ArrowLeft className="w-4 h-4" />
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar Skeleton */}
            <div className="w-32 h-32 bg-gray-300 rounded-full animate-pulse flex-shrink-0"></div>

            <div className="flex-1 text-center md:text-left">
              {/* Name Skeleton */}
              <div className="h-8 bg-gray-300 rounded animate-pulse mb-2 w-48 mx-auto md:mx-0"></div>

              {/* Email Skeleton */}
              <div className="h-5 bg-gray-300 rounded animate-pulse mb-3 w-56 mx-auto md:mx-0"></div>

              {/* Bio Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6 mx-auto md:mx-0"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-4/5 mx-auto md:mx-0"></div>
              </div>

              {/* Join Date Skeleton */}
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32 mx-auto md:mx-0 mb-4"></div>

              {/* Action Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center md:justify-start">
                <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
                <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-300 rounded animate-pulse mx-auto mb-3"></div>
                <div className="h-8 bg-gray-300 rounded animate-pulse mb-2 w-12 mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-20 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tab Headers Skeleton */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex space-x-8">
              <div className="h-5 bg-gray-300 rounded animate-pulse w-20"></div>
              <div className="h-5 bg-gray-300 rounded animate-pulse w-24"></div>
              <div className="h-5 bg-gray-300 rounded animate-pulse w-20"></div>
            </div>
          </div>

          {/* Tab Content Skeleton */}
          <div className="p-6">
            {/* Blog Posts Section */}
            <div className="space-y-6">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-6 last:border-b-0"
                >
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    {/* Post Image Skeleton */}
                    <div className="w-full md:w-48 h-32 bg-gray-300 rounded-lg animate-pulse flex-shrink-0"></div>

                    <div className="flex-1">
                      {/* Tags Skeleton */}
                      <div className="flex space-x-2 mb-2">
                        <div className="h-5 bg-gray-300 rounded-full animate-pulse w-16"></div>
                        <div className="h-5 bg-gray-300 rounded-full animate-pulse w-20"></div>
                      </div>

                      {/* Title Skeleton */}
                      <div className="h-6 bg-gray-300 rounded animate-pulse mb-2 w-4/5"></div>

                      {/* Excerpt Skeleton */}
                      <div className="space-y-2 mb-3">
                        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
                      </div>

                      {/* Meta Info Skeleton */}
                      <div className="flex items-center space-x-4">
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-20"></div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-300 rounded animate-pulse w-6"></div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-300 rounded animate-pulse w-6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State Skeleton */}
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-2 w-48 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
