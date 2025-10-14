import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Bell } from "lucide-react";

export default function NotificationsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                Notifications
              </h1>
            </div>
            <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
          </div>
          <p className="text-gray-600">
            Stay updated with the latest activities and announcements.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex space-x-8">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="h-5 bg-gray-300 rounded animate-pulse w-16"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start space-x-4">
                {/* Icon Skeleton */}
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse flex-shrink-0"></div>

                <div className="flex-1">
                  {/* Title and Time */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-5 bg-gray-300 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-20 ml-4"></div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2 mb-3">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center space-x-4">
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-24"></div>
                    <div className="h-6 bg-gray-300 rounded-full animate-pulse w-16"></div>
                  </div>
                </div>

                {/* Read Status Indicator */}
                <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse flex-shrink-0"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <div className="h-12 bg-gray-300 rounded-lg animate-pulse w-40 mx-auto"></div>
        </div>

        {/* Empty State Alternative */}
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 mt-8">
          <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse mx-auto mb-4"></div>
          <div className="h-6 bg-gray-300 rounded animate-pulse mb-2 w-48 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-64 mx-auto"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
