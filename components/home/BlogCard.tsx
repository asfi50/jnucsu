"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Clock } from "lucide-react";
import { BlogPost } from "@/lib/types/blogs.types";
import { formatRelativeTime } from "@/lib/utils";
import { useState } from "react";
import LoginModal from "@/components/ui/LoginModal";
import { useAuth } from "@/context/auth-context";
import useUserEngagement from "@/hooks/use-user-engagement";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toggleReaction, userReactions } = useUserEngagement();

  // Check if user has reacted to this blog
  const hasLiked = userReactions.includes(post.id);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      const newReactionState = await toggleReaction(post.id);

      // Update likes count based on the new state
      if (newReactionState) {
        setLikes(likes + 1);
      } else {
        setLikes(likes - 1);
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };

  if (featured) {
    return (
      <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-200 hover:shadow-sm flex flex-col h-full">
        {/* Image section - fixed height */}
        <div className="relative h-64">
          <Image
            src={post.coverImage || "/images/blog-placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/blog-placeholder.svg";
            }}
          />
        </div>

        {/* Tags positioned between image and content */}
        {post.tags && post.tags.length > 0 && (
          <div className="relative -mt-4 mx-6 mb-2 z-10">
            <div className="flex gap-2 overflow-hidden">
              {post.tags.map((tag, index) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-white text-xs rounded-full whitespace-nowrap shadow-md"
                  style={{
                    display: index < 4 ? "inline-block" : "none",
                    backgroundColor: "#f97316", // Orange-500 color
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content section - flexible */}
        <div className="px-6 pb-6 flex flex-col flex-grow">
          <Link href={`/blog/${post.id}`} className="group">
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-tight mb-2">
              {post.title}
            </h2>
          </Link>

          {/* Content - exactly 2 lines */}
          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2 flex-grow">
            {post.excerpt}
          </p>

          {/* Footer section - always at bottom */}
          <div className="mt-auto space-y-4">
            <div className="flex items-center space-x-3">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/default-avatar.svg";
                  }}
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">
                    {post.author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-sm">
                <p className="text-gray-900 font-medium">{post.author.name}</p>
                <p className="text-gray-500">
                  {formatRelativeTime(post.publishedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500 justify-between">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-colors ${
                  hasLiked ? "text-red-500" : "hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`}
                />
                <span>{likes}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          returnUrl={`/blog/${post.id}`}
          message="Please log in to like or comment on this blog post."
        />
      </article>
    );
  }

  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-200 hover:shadow-sm flex flex-col h-full">
      {/* Image section - fixed height */}
      <div className="relative h-48">
        <Image
          src={post.coverImage || "/images/blog-placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/blog-placeholder.svg";
          }}
        />
      </div>

      {/* Tags positioned between image and content */}
      {post.tags && post.tags.length > 0 && (
        <div className="relative -mt-3 mx-4 mb-2 z-10">
          <div className="flex gap-1 overflow-hidden">
            {post.tags.map((tag, index) => (
              <span
                key={tag}
                className="px-2 py-1 text-white text-xs rounded-full whitespace-nowrap shadow-md"
                style={{
                  display: index < 3 ? "inline-block" : "none",
                  backgroundColor: "#f97316", // Orange-500 color
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content section - flexible */}
      <div className="px-4 pb-4 flex flex-col flex-grow">
        <Link href={`/blog/${post.id}`} className="group">
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors leading-tight mb-2">
            {post.title}
          </h3>
        </Link>

        {/* Content - exactly 2 lines */}
        <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2 flex-grow">
          {post.excerpt}
        </p>

        {/* Footer section - always at bottom */}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Image
              src={post.author.avatar || "/images/default-avatar.svg"}
              alt={post.author.name}
              width={20}
              height={20}
              className="rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/default-avatar.svg";
              }}
            />
            <span>{post.author.name}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{post.readTime}m</span>
            </div>
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors ${
                hasLiked ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <Heart className={`w-3 h-3 ${hasLiked ? "fill-current" : ""}`} />
              <span>{likes}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        returnUrl={`/blog/${post.id}`}
        message="Please log in to like or comment on this blog post."
      />
    </article>
  );
}
