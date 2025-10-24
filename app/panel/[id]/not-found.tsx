import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Shield, Home } from "lucide-react";

export default function PanelNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="w-24 h-24 text-gray-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-400">?</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Panel Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            The political panel you&apos;re looking for doesn&apos;t exist or
            may have been removed.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/candidates"
              className="inline-flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Shield className="w-5 h-5" />
              <span>View All Candidates</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Looking for a specific panel?
            </h3>
            <p className="text-gray-600 text-sm">
              Political panels are groups of candidates running together. You
              can find individual candidates and their panel affiliations on the
              candidates page.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
