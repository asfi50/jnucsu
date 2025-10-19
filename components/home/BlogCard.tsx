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
import { useToast } from "@/components/ui/ToastProvider";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toggleReaction, userReactions } = useUserEngagement();
  const { showToast } = useToast();

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

      showToast({
        message: newReactionState ? "Post liked!" : "Like removed!",
        type: "success",
        title: "",
      });
    } catch (error) {
      console.error("Error toggling reaction:", error);
      showToast({
        message: "Failed to update reaction. Please try again.",
        type: "error",
        title: "",
      });
    }
  };

  if (featured) {
    return (
      <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
        <div className="relative h-64">
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="p-6">
          <div className="flex flex-wrap space-y-2 items-center space-x-2 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link href={`/blog/${post.id}`} className="group">
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-tight mb-2">
              {post.title}
            </h2>
          </Link>

          <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
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
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
      <div className="relative h-48">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/blog/${post.id}`} className="group">
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors leading-tight mb-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
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
