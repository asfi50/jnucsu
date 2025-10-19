import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Award } from "lucide-react";

export default function SubmitCandidateSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Submit Candidate Profile
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Register as a candidate for student elections and share your vision
            with the university community.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-4 w-40"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index}>
                    <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-24"></div>
                    <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Details Section */}
            <div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-4 w-32"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index}>
                    <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-20"></div>
                    <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Biography Section */}
            <div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-4 w-28"></div>
              <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
            </div>

            {/* Manifesto Section */}
            <div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-4 w-24"></div>
              <div className="h-40 bg-gray-300 rounded animate-pulse"></div>
            </div>

            {/* Experience Section */}
            <div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-4 w-28"></div>
              <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
            </div>

            {/* Achievements Section */}
            <div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-4 w-32"></div>
              <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
            </div>

            {/* Social Links Section */}
            <div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-4 w-32"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index}>
                    <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-20"></div>
                    <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Uploads Section */}
            <div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-4 w-36"></div>
              <div className="space-y-4">
                <div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-32"></div>
                  <div className="h-24 bg-gray-300 rounded-lg animate-pulse border-2 border-dashed"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-28"></div>
                  <div className="h-24 bg-gray-300 rounded-lg animate-pulse border-2 border-dashed"></div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse mt-0.5"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <div className="h-12 bg-gray-300 rounded-lg animate-pulse w-48"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
