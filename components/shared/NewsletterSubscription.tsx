"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface NewsletterSubscriptionProps {
  className?: string;
  variant?: "default" | "inline";
  placeholder?: string;
  titleColor?: string;
  title?: string;
  description?: string;
}

export default function NewsletterSubscription({
  className = "",
  titleColor = "text-white",
  variant = "default",
  placeholder = "Enter your email",
  title = "Stay Updated",
  description = "Get the latest news about student leadership, events, and community updates.",
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast({
        type: "warning",
        title: "Email Required",
        message: "Please enter your email address",
      });
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast({
          type: "success",
          title: "Successfully Subscribed!",
          message: "Thank you for subscribing to our newsletter",
        });
        setEmail("");
      } else {
        showToast({
          type: "error",
          title: "Subscription Failed",
          message: data.message || "Failed to subscribe. Please try again.",
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      showToast({
        type: "error",
        title: "Network Error",
        message: "Failed to connect. Please check your internet connection.",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubscribe} className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
            disabled={isSubscribing}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubscribing || !email.trim()}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center min-w-[100px]"
        >
          {isSubscribing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send className="w-4 h-4 mr-1" />
              Subscribe
            </>
          )}
        </button>
      </form>
    );
  }

  return (
    <div className={className}>
      <h3 className={`${titleColor} font-semibold text-lg mb-4`}>{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>

      <form onSubmit={handleSubscribe} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder-gray-500 text-sm"
            disabled={isSubscribing}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubscribing || !email.trim()}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          {isSubscribing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Subscribe</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
