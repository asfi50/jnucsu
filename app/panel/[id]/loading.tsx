import { Shield } from "lucide-react";

export default function PanelDetailsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Panel Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-8 h-8 text-gray-300 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
          </div>

          {/* Mission/Vision Skeleton */}
          <div className="space-y-4">
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <div className="h-5 bg-orange-200 rounded animate-pulse w-16 mb-2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-orange-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-orange-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="h-5 bg-blue-200 rounded animate-pulse w-12 mb-2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-blue-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-blue-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="sm:w-64">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="hidden lg:flex rounded-lg border border-gray-300 overflow-hidden">
              <div className="h-10 w-16 bg-gray-200 animate-pulse"></div>
              <div className="h-10 w-16 bg-gray-100 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
        </div>

        {/* Members Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar Skeleton */}
                  <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>

                  {/* Name Skeleton */}
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-1"></div>

                  {/* Position Skeleton */}
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-3"></div>

                  {/* Details Skeleton */}
                  <div className="space-y-2 mb-4 w-full">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-28 mx-auto"></div>
                  </div>

                  {/* Bio Skeleton */}
                  <div className="space-y-2 mb-4 w-full">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/5"></div>
                  </div>

                  {/* Button Skeleton */}
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-4 bg-gray-700 rounded animate-pulse w-48 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
