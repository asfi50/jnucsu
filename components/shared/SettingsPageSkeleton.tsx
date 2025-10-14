import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Settings } from "lucide-react";

export default function SettingsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-300 rounded animate-pulse mb-6 w-32"></div>

            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-48"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse mb-4 w-64"></div>
                <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <div key={index}>
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-24"></div>
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-16"></div>
              <div className="h-24 bg-gray-300 rounded animate-pulse"></div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-300 rounded animate-pulse mb-6 w-24"></div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-32"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-48"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-28"></div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-40"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-56"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-300 rounded animate-pulse mb-6 w-32"></div>

            <div className="space-y-6">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-40"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-56"></div>
                  </div>
                  <div className="w-12 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-40"></div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-300 rounded animate-pulse mb-6 w-20"></div>

            <div className="space-y-6">
              {[1, 2].map((index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-36"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-52"></div>
                  </div>
                  <div className="w-12 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <div className="h-6 bg-gray-300 rounded animate-pulse mb-6 w-28"></div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-32"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-48"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
