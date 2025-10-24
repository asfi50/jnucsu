"use client";

import { PanelMember } from "@/app/api/panel/public-choice/route";
import { Users, Crown, Award, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

// Enhanced skeleton component for loading state
function PanelMemberSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded-md w-1/2 mb-2"></div>
          <div className="flex items-center space-x-2">
            <div className="h-3 bg-orange-100 rounded-full w-16"></div>
            <div className="h-3 bg-gray-100 rounded-full w-12"></div>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
          <div className="h-3 bg-gray-100 rounded w-8"></div>
        </div>
      </div>
    </div>
  );
}

export default function TrendingPanelMembers({
  initialData,
  isLoading = false,
}: {
  initialData?: PanelMember[];
  isLoading?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate slides - show 2 cards on large devices, 1 on mobile, but slide 1 at a time
  const totalSlides = initialData?.length || 0;
  const maxVisibleCardsDesktop = 2; // Show 2 cards on large devices
  const maxSlideIndex = Math.max(0, totalSlides - maxVisibleCardsDesktop);

  // Auto-slide functionality
  useEffect(() => {
    if (
      !initialData?.length ||
      isLoading ||
      isHovered ||
      totalSlides <= maxVisibleCardsDesktop
    )
      return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [initialData?.length, isLoading, isHovered, totalSlides, maxSlideIndex]);

  // Manual click to next
  const handleCardClick = () => {
    if (!initialData?.length || totalSlides <= maxVisibleCardsDesktop) return;
    setCurrentIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Public Choice Panel
          </h2>
          <p className="text-gray-600 text-sm">
            Most popular candidates chosen by students
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        {isLoading ? (
          // Enhanced skeleton loading state
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <PanelMemberSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : initialData?.length ? (
          // Carousel container
          <div
            className="relative h-32 cursor-pointer"
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Carousel slides */}
            <div className="relative w-full h-full overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out h-full transform"
                style={{
                  transform: `translateX(-${currentIndex * 50}%)`, // 50% movement on large screens to show 2 cards
                }}
              >
                {initialData.map((member, memberIndex) => {
                  const actualIndex = memberIndex;

                  // Generate rank-based styling
                  const isTopRank = actualIndex === 0;
                  const isSecondRank = actualIndex === 1;
                  const isThirdRank = actualIndex === 2;

                  const getRankIcon = () => {
                    if (isTopRank)
                      return <Crown className="w-4 h-4 text-yellow-500" />;
                    if (isSecondRank)
                      return <Award className="w-4 h-4 text-gray-400" />;
                    if (isThirdRank)
                      return <Award className="w-4 h-4 text-orange-400" />;
                    return <TrendingUp className="w-4 h-4 text-gray-400" />;
                  };

                  const getRankColor = () => {
                    if (isTopRank)
                      return "from-yellow-50 to-orange-50 border-yellow-200";
                    if (isSecondRank)
                      return "from-gray-50 to-slate-50 border-gray-200";
                    if (isThirdRank)
                      return "from-orange-50 to-amber-50 border-orange-200";
                    return "from-white to-gray-50 border-gray-100";
                  };

                  return (
                    <div
                      key={member.id}
                      className="flex-shrink-0 h-full w-full lg:w-1/2 px-2 first:pl-0 last:pr-0"
                    >
                      <div
                        className={`bg-gradient-to-br ${getRankColor()} rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 p-6 group h-32`}
                      >
                        <div className="flex items-center space-x-4 h-full">
                          {/* Rank Badge */}
                          <div className="flex flex-col items-center space-y-1">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                isTopRank
                                  ? "bg-yellow-100 text-yellow-600"
                                  : isSecondRank
                                  ? "bg-gray-100 text-gray-600"
                                  : isThirdRank
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-gray-50 text-gray-500"
                              }`}
                            >
                              {getRankIcon()}
                            </div>
                            <span
                              className={`text-xs font-bold ${
                                isTopRank
                                  ? "text-yellow-600"
                                  : isSecondRank
                                  ? "text-gray-600"
                                  : isThirdRank
                                  ? "text-orange-600"
                                  : "text-gray-500"
                              }`}
                            >
                              #{actualIndex + 1}
                            </span>
                          </div>

                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                              <Image
                                src={
                                  member.image ||
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`
                                }
                                alt={member.name}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`;
                                }}
                              />
                            </div>
                          </div>

                          {/* Member Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                              {member.name}
                            </h3>
                            <p className="text-orange-600 font-medium text-sm truncate mb-2">
                              {member.position?.replace(" - JnUCSU", "") ||
                                "Panel Member"}
                            </p>

                            {/* Tags/Stats */}
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                <Users className="w-3 h-3" />
                                <span>Popular Choice</span>
                              </div>
                              {isTopRank && (
                                <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                  <Crown className="w-3 h-3" />
                                  <span>Top Pick</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Vote Count or Action Button */}
                          <div className="flex flex-col items-center space-y-1">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isTopRank
                                  ? "bg-yellow-100 text-yellow-600"
                                  : isSecondRank
                                  ? "bg-gray-100 text-gray-600"
                                  : isThirdRank
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-gray-50 text-gray-500"
                              } group-hover:scale-105 transition-transform`}
                            >
                              <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                              {member.profileVotes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtle progress dots */}
            {totalSlides > maxVisibleCardsDesktop && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {Array.from({ length: maxSlideIndex + 1 }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-orange-500 w-6"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Enhanced empty state
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Panel Members Found
                </h3>
                <p className="text-gray-500 text-sm">
                  Public choice panel members will appear here once voting
                  begins.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
