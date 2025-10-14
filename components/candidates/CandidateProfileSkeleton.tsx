import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";

export default function CandidateProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 text-gray-300">
            <ArrowLeft className="w-4 h-4" />
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              {/* Profile Picture Skeleton */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gray-300 rounded-full animate-pulse mx-auto mb-4"></div>
                  {/* Status Badge Skeleton */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                </div>

                {/* Name Skeleton */}
                <div className="h-7 bg-gray-300 rounded animate-pulse mb-2 w-3/4 mx-auto"></div>

                {/* Position Skeleton */}
                <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-1/2 mx-auto"></div>

                {/* Department Skeleton */}
                <div className="h-4 bg-gray-300 rounded animate-pulse mb-4 w-2/3 mx-auto"></div>
              </div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="h-8 bg-gray-300 rounded animate-pulse mb-2 w-12 mx-auto"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-16 mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="h-8 bg-gray-300 rounded animate-pulse mb-2 w-12 mx-auto"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-16 mx-auto"></div>
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="space-y-3">
                <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>

              {/* Contact Info Skeleton */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-40"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-36"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section Skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded animate-pulse w-24"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-4/5"></div>
              </div>
            </div>

            {/* Manifesto Section Skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded animate-pulse w-32"></div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
                </div>
              </div>
            </div>

            {/* Gallery Section Skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded animate-pulse w-28"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-300 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Blog Posts Section Skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded animate-pulse w-36"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-4/5"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4 mb-2"></div>
                    <div className="flex space-x-4">
                      <div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-300 rounded-full animate-pulse w-16"></div>
                        <div className="h-6 bg-gray-300 rounded-full animate-pulse w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section Skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded animate-pulse w-40"></div>
              </div>
              <div className="space-y-4">
                {[1, 2].map((index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-32"></div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
