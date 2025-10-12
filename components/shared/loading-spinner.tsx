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
  const [dotIndex, setDotIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % 3);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const displayText = customText || (showText ? "Thinking" : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-4">
        {showText && (
          <div className="font-medium text-center text-lg text-gray-700 dark:text-gray-300 min-h-[1.5em] flex items-center">
            <span className="inline-block">
              {displayText}
              <span className="inline-block ml-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`inline-block w-2 h-2 mx-0.5 rounded-full bg-orange-500 dark:bg-orange-400 ${
                      dotIndex === i ? "animate-bounce" : "opacity-50"
                    }`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></span>
                ))}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
