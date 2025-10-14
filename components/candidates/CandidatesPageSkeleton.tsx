import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Users } from "lucide-react";

export default function CandidatesPageSkeleton() {
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
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Student Candidates
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Meet the student candidates running for positions at Jagannath
            University.
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

        {/* Candidates Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Candidate Avatar Skeleton */}
              <div className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse mx-auto"></div>
                  {/* Status Badge Skeleton */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                </div>

                {/* Name Skeleton */}
                <div className="h-6 bg-gray-300 rounded animate-pulse mb-2 w-3/4 mx-auto"></div>

                {/* Position Skeleton */}
                <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-1/2 mx-auto"></div>

                {/* Department Skeleton */}
                <div className="h-4 bg-gray-300 rounded animate-pulse mb-4 w-2/3 mx-auto"></div>

                {/* Stats Skeleton */}
                <div className="flex justify-center space-x-6 mb-4">
                  <div className="text-center">
                    <div className="h-6 bg-gray-300 rounded animate-pulse mb-1 w-8 mx-auto"></div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-12"></div>
                  </div>
                  <div className="text-center">
                    <div className="h-6 bg-gray-300 rounded animate-pulse mb-1 w-8 mx-auto"></div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-12"></div>
                  </div>
                </div>

                {/* Action Button Skeleton */}
                <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
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

      <Footer />
    </div>
  );
}
