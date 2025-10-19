"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/ui/LoginModal";
import { formatRelativeTime } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import useUserEngagement from "@/hooks/use-user-engagement";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Calendar,
  Tag,
  Send,
  Lock,
  Eye,
  Facebook,
  X,
  Linkedin,
} from "lucide-react";
import { useToast } from "../ui/ToastProvider";
import useAxios from "@/hooks/use-axios";
import { BlogComment, BlogPost } from "@/lib/types/blogs.types";

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const [likes, setLikes] = useState(post.likes);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<BlogComment[]>([
    ...(post.comments ? post.comments : []),
  ]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, userProfile } = useAuth();
  const { hasReacted, toggleReaction } = useUserEngagement();
  const { showToast } = useToast();
  const axios = useAxios();

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

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Show login modal instead of redirecting
      setShowLoginModal(true);
      return;
    }

    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        author: {
          id: userProfile?.id || "1",
          name: userProfile?.name || "Anonymous User",
          avatar:
            userProfile?.image ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous",
          email: userProfile?.email || "anonymous@jnu.ac.bd",
        },
        content: newComment,
        createdAt: new Date().toISOString(),
        replies: [],
      };
      setComments([comment, ...comments]);
      setNewComment("");
      await axios
        .post(`/api/comment`, {
          content: newComment,
          blogId: post.id,
        })
        .then(() => {
          showToast({
            message: "Comment posted successfully!",
            type: "success",
            title: "",
          });
        })
        .catch(() => {
          showToast({
            message: "Failed to post comment. Please try again.",
            type: "error",
            title: "",
          });
        });
    }
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this article: ${post.title}`);
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://x.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        shareUrl = url;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  const copyBlogId = () => {
    navigator.clipboard.writeText(post.id);
    showToast({
      message: "Blog ID copied to clipboard!",
      type: "success",
      title: "",
    });
  };

  const shareBlog = async () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      copyBlogId();
    }
  };

  // Generate estimated reading time
  const wordsPerMinute = 200;
  const wordCount = post.content?.split(" ").length || 500;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {/* Featured Image */}
          {post.coverImage && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag.toLowerCase()}`}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full hover:bg-orange-200 transition-colors"
              >
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author and Meta Info */}
          <div className="flex items-center justify-between py-4 border-y border-gray-200">
            <div className="flex items-center space-x-4">
              <Link href={`/users/${post.author.id}`}>
                <Image
                  src={post.author.avatar || "/images/default-avatar.svg"}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="rounded-full cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/default-avatar.svg";
                  }}
                />
              </Link>
              <div>
                <Link
                  href={`/users/${post.author.id}`}
                  className="font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                >
                  {post.author.name}
                </Link>
                <div className="lg:flex items-center space-y-2 lg:space-y-0 space-x-4 text-sm text-gray-500 mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 py-2 rounded-lg transition-colors ${
                  hasReacted(post.id)
                    ? "bg-red-50 text-red-600"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    hasReacted(post.id) ? "fill-current" : ""
                  }`}
                />
                <span className="font-medium">{likes}</span>
              </button>

              <div className="flex items-center space-x-1  py-2 rounded-lg bg-gray-50 text-gray-600">
                <Eye className="w-4 h-4" />
                <span className="font-medium">{post.views ?? 0}</span>
              </div>

              <button
                onClick={async () => shareBlog()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed space-y-6 whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Share this article:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleShare("facebook")}
                  className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="p-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </footer>

        {/* Comments Section */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Comments ({comments.length})
            </h3>
          </div>

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src={
                      userProfile?.image ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
                    }
                    alt="Your avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts on this article..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                    rows={4}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <Lock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Comments are locked
              </h4>
              <p className="text-gray-600 mb-4">
                Please log in to share your thoughts on this article.
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <span>Log In to Comment</span>
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="flex space-x-3">
                  <Link href={`/users/${comment.author.id}`}>
                    <Image
                      src={
                        comment.author.avatar || "/images/default-avatar.svg"
                      }
                      alt={comment.author.name}
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/default-avatar.svg";
                      }}
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Link
                        href={`/users/${comment.author.id}`}
                        className="font-medium text-gray-900 hover:text-orange-600 transition-colors"
                      >
                        {comment.author.name}
                      </Link>
                      <span className="text-sm text-gray-500">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </section>
      </article>

      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        returnUrl={`/blog/${post.id}`}
        message="Please log in to like or comment on this blog post."
      />
    </div>
  );
}
