import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { User } from "lucide-react";

export default function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          </div>
          <p className="text-gray-600">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-300 rounded animate-pulse w-40"></div>
            <div className="h-8 bg-gray-300 rounded animate-pulse w-20"></div>
          </div>

          <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-32"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse mb-4 w-48"></div>
                <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <div key={index}>
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-24"></div>
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Bio Section */}
            <div>
              <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-16"></div>
              <div className="h-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse mt-2 w-40"></div>
            </div>

            {/* Contact Information */}
            <div>
              <div className="h-5 bg-gray-300 rounded animate-pulse mb-4 w-40"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index}>
                    <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-20"></div>
                    <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <div className="h-5 bg-gray-300 rounded animate-pulse mb-4 w-32"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index}>
                    <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-24"></div>
                    <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Settings */}
            <div>
              <div className="h-5 bg-gray-300 rounded animate-pulse mb-4 w-48"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-36"></div>
                      <div className="h-3 bg-gray-300 rounded animate-pulse w-48"></div>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <div className="h-12 bg-gray-300 rounded-lg animate-pulse flex-1"></div>
              <div className="h-12 bg-gray-300 rounded-lg animate-pulse w-32"></div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-6 bg-gray-300 rounded animate-pulse mb-6 w-32"></div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-40"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-56"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-36"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-48"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-28"></div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>

      <Footer />
    </div>
  );
}
