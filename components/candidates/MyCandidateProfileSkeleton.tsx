import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MyCandidateProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Candidate Profile
            </h1>
            <p className="text-gray-600">
              Manage your candidate profile, track your campaign progress, and
              connect with voters.
            </p>
          </div>
          <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-32"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
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

                {/* Status Badge Skeleton */}
                <div className="h-6 bg-gray-300 rounded-full animate-pulse w-24 mx-auto"></div>
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
                <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-6 bg-gray-300 rounded animate-pulse mb-1 w-8"></div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-16"></div>
                    </div>
                    <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Profile Information Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-6 bg-gray-300 rounded animate-pulse w-40"></div>
                </div>
                <div className="h-8 bg-gray-300 rounded animate-pulse w-20"></div>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <div className="h-5 bg-gray-300 rounded animate-pulse mb-3 w-24"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse mb-1 w-16"></div>
                      <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse mb-1 w-16"></div>
                      <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse mb-1 w-20"></div>
                      <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse mb-1 w-24"></div>
                      <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div>
                  <div className="h-5 bg-gray-300 rounded animate-pulse mb-3 w-16"></div>
                  <div className="h-24 bg-gray-300 rounded animate-pulse"></div>
                </div>

                {/* Manifesto Section */}
                <div>
                  <div className="h-5 bg-gray-300 rounded animate-pulse mb-3 w-24"></div>
                  <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded animate-pulse w-40"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index}>
                    <div className="h-4 bg-gray-300 rounded animate-pulse mb-1 w-20"></div>
                    <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded animate-pulse w-32"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index}>
                    <div className="h-4 bg-gray-300 rounded animate-pulse mb-1 w-20"></div>
                    <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-6 bg-gray-300 rounded animate-pulse w-28"></div>
                </div>
                <div className="h-8 bg-gray-300 rounded animate-pulse w-32"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-300 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="h-12 bg-gray-300 rounded-lg animate-pulse flex-1"></div>
              <div className="h-12 bg-gray-300 rounded-lg animate-pulse flex-1"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
