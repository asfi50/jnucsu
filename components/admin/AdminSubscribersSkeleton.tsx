import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Users } from "lucide-react";

export default function AdminSubscribersSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Subscribers</h1>
          </div>
          <p className="text-gray-600">
            Manage newsletter subscribers and their preferences.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-8 bg-gray-300 rounded animate-pulse mb-2 w-12"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-20"></div>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-64"></div>
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-28"></div>
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-300 rounded animate-pulse w-24"></div>
              </div>
              <div className="flex space-x-8">
                <div className="h-5 bg-gray-300 rounded animate-pulse w-16"></div>
                <div className="h-5 bg-gray-300 rounded animate-pulse w-20"></div>
                <div className="h-5 bg-gray-300 rounded animate-pulse w-16"></div>
                <div className="h-5 bg-gray-300 rounded animate-pulse w-20"></div>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div>
                      <div className="h-5 bg-gray-300 rounded animate-pulse w-48 mb-1"></div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-8">
                    <div className="h-6 bg-gray-300 rounded-full animate-pulse w-16"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-20"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-16"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
          <div className="flex space-x-2">
            <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Bulk Actions Modal Placeholder */}
        <div className="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="h-6 bg-gray-300 rounded animate-pulse w-48 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse mb-6 w-full"></div>
            <div className="flex justify-end space-x-3">
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-20"></div>
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-24"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
