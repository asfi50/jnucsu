"use client";

import { useEffect, useState } from "react";

interface LoadingSpinnerProps {
  showText?: boolean;
  customText?: string;
}

const LoadingSpinner = ({
  showText = true,
  customText,
}: LoadingSpinnerProps) => {
  const [textIndex, setTextIndex] = useState(0);
  const [dots, setDots] = useState(".");

  // Default messages that rotate
  const defaultMessages = [
    "Thinking...",
    "Summoning some magic...",
    "Consulting the stars...",
    "Crunching the numbers...",
    "Brewing up results...",
    "Almost there...",
    "Just a moment...",
  ];

  // Animate dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  // Rotate messages
  useEffect(() => {
    if (!showText || customText) return;

    const messageInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % defaultMessages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, [showText, customText, defaultMessages.length]);

  const displayText =
    customText || (showText ? defaultMessages[textIndex] : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Modern Gradient Spinner */}
        <div className="relative">
          {/* Outer gradient ring */}
          <div className="w-20 h-20 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 animate-spin"></div>
            <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-900"></div>
          </div>

          {/* Inner floating dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-12 h-12">
              <div
                className="absolute w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full animate-ping"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="absolute w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-ping top-0 right-0"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <div
                className="absolute w-2 h-2 bg-pink-500 dark:bg-pink-400 rounded-full animate-ping bottom-0 right-0"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="absolute w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-ping bottom-0 left-0"
                style={{ animationDelay: "0.9s" }}
              ></div>
            </div>
          </div>

          {/* Glowing effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 dark:from-orange-400/20 dark:via-red-400/20 dark:to-pink-400/20 animate-pulse"></div>
        </div>

        {/* Text with typing animation */}
        {showText && (
          <div className="font-medium text-center text-lg text-gray-700 dark:text-gray-300 min-h-[1.5em] flex items-center">
            <span className="inline-block">
              {displayText}
              {!customText && (
                <span className="inline-block w-4 text-left text-orange-500 dark:text-orange-400">
                  {dots}
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
