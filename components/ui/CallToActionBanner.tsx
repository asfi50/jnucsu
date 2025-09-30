'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Award, PenTool } from 'lucide-react';

interface CallToActionBannerProps {
  type: 'candidate' | 'blog';
  onClose?: () => void;
}

export default function CallToActionBanner({ type, onClose }: CallToActionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const candidateContent = {
    icon: Award,
    title: "Are you running for JnUCSU Election?",
    description: "Submit your candidate profile and share your vision with the student community. Let everyone know about your plans and manifesto!",
    buttonText: "Submit Candidate Profile",
    buttonLink: "/submit-candidate",
    bgGradient: "from-orange-500 to-red-500"
  };

  const blogContent = {
    icon: PenTool,
    title: "Share Your Ideas with the Community",
    description: "Write a blog post and share your thoughts, insights, and experiences with fellow students. Your voice matters!",
    buttonText: "Write a Blog Post",
    buttonLink: "/submit-blog",
    bgGradient: "from-orange-500 to-orange-600"
  };

  const content = type === 'candidate' ? candidateContent : blogContent;
  const Icon = content.icon;

  return (
    <div className={`relative bg-gradient-to-r ${content.bgGradient} rounded-lg shadow-lg overflow-hidden mb-8`}>
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      <div className="relative px-6 py-8 md:px-8">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          aria-label="Close banner"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">
              {content.title}
            </h3>
            <p className="text-white/90 text-base max-w-2xl">
              {content.description}
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href={content.buttonLink}
              className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              {content.buttonText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
