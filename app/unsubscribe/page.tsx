"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/components/ui/ToastProvider";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const { showToast } = useToast();

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast({
        type: "warning",
        title: "Email Required",
        message: "Please enter your email address",
      });
      return;
    }

    setIsUnsubscribing(true);

    try {
      const response = await fetch(
        `/api/subscribers?email=${encodeURIComponent(email.trim())}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsUnsubscribed(true);
        showToast({
          type: "success",
          title: "Successfully Unsubscribed",
          message: "You have been removed from our newsletter",
        });
      } else {
        showToast({
          type: "error",
          title: "Unsubscribe Failed",
          message: data.message || "Failed to unsubscribe. Please try again.",
        });
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      showToast({
        type: "error",
        title: "Network Error",
        message: "Failed to connect. Please check your internet connection.",
      });
    } finally {
      setIsUnsubscribing(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {!isUnsubscribed ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="bg-orange-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-orange-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Unsubscribe from Newsletter
                  </h1>
                  <p className="text-gray-600">
                    We&apos;re sorry to see you go. Enter your email address to
                    unsubscribe from our newsletter.
                  </p>
                </div>

                {/* Unsubscribe Form */}
                <form onSubmit={handleUnsubscribe} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        disabled={isUnsubscribing}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUnsubscribing || !email.trim()}
                    className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    {isUnsubscribing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Unsubscribing...</span>
                      </>
                    ) : (
                      <span>Unsubscribe</span>
                    )}
                  </button>
                </form>

                {/* Alternative */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-900 mb-1">
                          Before you unsubscribe
                        </h3>
                        <p className="text-sm text-blue-700">
                          You can also update your email preferences or
                          frequency instead of completely unsubscribing. This
                          helps you stay informed about important updates while
                          reducing email volume.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Successfully Unsubscribed
                </h1>
                <p className="text-gray-600 mb-6">
                  You have been successfully removed from our newsletter. You
                  will no longer receive emails from us.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {email}
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/"
                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors text-center"
                  >
                    Return to Homepage
                  </Link>
                  <p className="text-xs text-gray-500">
                    Changed your mind? You can always subscribe again from our
                    website.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Having trouble?{" "}
              <a
                href="/contact"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Contact us
              </a>{" "}
              for assistance.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
