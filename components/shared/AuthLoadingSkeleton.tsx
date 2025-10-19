import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AuthLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          {/* Pulse Animation Icon */}
          <div className="w-16 h-16 bg-orange-500 rounded-full animate-pulse mx-auto mb-4 opacity-60"></div>

          {/* Loading Text */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-300 rounded animate-pulse w-32 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse w-24 mx-auto"></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
