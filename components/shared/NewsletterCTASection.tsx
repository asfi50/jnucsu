"use client";

import { Mail, Users, Bell } from "lucide-react";
import NewsletterSubscription from "@/components/shared/NewsletterSubscription";

interface NewsletterCTASectionProps {
  className?: string;
  variant?: "default" | "compact" | "minimal";
}

export default function NewsletterCTASection({
  className = "",
  variant = "default",
}: NewsletterCTASectionProps) {
  if (variant === "compact") {
    return (
      <section
        className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6 ${className}`}
      >
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <Mail className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Stay in the Loop</h3>
            <p className="text-orange-100 text-sm mb-4">
              Get updates on elections, events, and important announcements.
            </p>
            <NewsletterSubscription
              variant="inline"
              placeholder="Your email address"
              className="max-w-md"
            />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "minimal") {
    return (
      <section
        className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}
      >
        <div className="text-center">
          <Bell className="w-8 h-8 text-orange-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Stay Updated
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Subscribe to get the latest news and updates
          </p>
          <NewsletterSubscription
            variant="inline"
            placeholder="Enter your email"
            className="max-w-sm mx-auto"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-8 ${className}`}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-orange-500 p-3 rounded-full">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Stay Connected with JnUCSU
        </h2>

        <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
          Be the first to know about election updates, candidate announcements,
          important events, and community news. Join our growing community of
          engaged students.
        </p>

        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-full mb-2">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900 text-lg block">
                500+
              </span>
              Active Subscribers
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-full mb-2">
              <Bell className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900 text-lg block">
                Weekly
              </span>
              Updates
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-full mb-2">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900 text-lg block">
                No
              </span>
              Spam
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <NewsletterSubscription
            variant="inline"
            placeholder="Enter your email to subscribe"
          />
        </div>

        <p className="text-xs text-gray-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
