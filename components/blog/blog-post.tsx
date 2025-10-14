"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/ui/LoginModal";
import { formatRelativeTime } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
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
import { generateStructuredData } from "@/lib/seo";
import { useRouter } from "next/navigation";
import BlogPostSkeleton from "./BlogPostSkeleton";
import ProductionMarkdownViewer from "@/components/ui/ProductionMarkdownViewer";

interface BlogPostClientWithFetchProps {
  blogId: string;
}

export default function BlogPostClientWithFetch({
  blogId,
}: BlogPostClientWithFetchProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const hasFetchedRef = useRef(false);
  const currentBlogIdRef = useRef<string>("");
  const {
    isAuthenticated,
    userProfile,
    user,
    loading: authLoading,
  } = useAuth();
  const { showToast } = useToast();
  const axios = useAxios();
  const router = useRouter();

  // Fetch blog post data - only once per blog post
  useEffect(() => {
    if (authLoading) return;

    // Reset fetch flag when blogId changes
    if (currentBlogIdRef.current !== blogId) {
      hasFetchedRef.current = false;
      currentBlogIdRef.current = blogId;
      setPost(null);
      setLoading(true);
      setError(null);
    }

    if (hasFetchedRef.current) return;

    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        hasFetchedRef.current = true;

        const response = await fetch(
          `/api/blog/${blogId}?user=${userProfile?.id || ""}`
        );

        if (!response.ok) {
          throw new Error("Blog post not found");
        }

        const blogData = await response.json();
        setPost(blogData);
        setLikes(blogData.likes || 0);
        setHasLiked(blogData.is_reacted || false);
        setComments(blogData.comments || []);

        // Update page title and meta tags dynamically
        if (blogData.title) {
          document.title = `${blogData.title} - JnUCSU Blog`;

          // Update meta description
          const metaDescription = document.querySelector(
            'meta[name="description"]'
          );
          if (metaDescription && blogData.excerpt) {
            metaDescription.setAttribute("content", blogData.excerpt);
          }

          // Update og:title
          const ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle) {
            ogTitle.setAttribute("content", blogData.title);
          }

          // Update og:description
          const ogDescription = document.querySelector(
            'meta[property="og:description"]'
          );
          if (ogDescription && blogData.excerpt) {
            ogDescription.setAttribute("content", blogData.excerpt);
          }

          // Update og:image
          const ogImage = document.querySelector('meta[property="og:image"]');
          if (ogImage && blogData.coverImage) {
            ogImage.setAttribute("content", blogData.coverImage);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load blog post"
        );
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlogPost();
    }
  }, [blogId, authLoading, userProfile?.id]);

  const handleLike = async () => {
    if (!isAuthenticated || !user) {
      setShowLoginModal(true);
      return;
    }

    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
      try {
        await axios.post(`/api/blog/reaction`, {
          blogId: post?.id,
          reactionType: "like",
        });
        setHasLiked(true);
      } catch {
        setLikes(likes - 1);
        setHasLiked(false);
      }
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
      try {
        await axios.post(`/api/blog/reaction`, {
          blogId: post?.id,
          reactionType: "unlike",
        });
        setHasLiked(false);
      } catch {
        setLikes(likes + 1);
        setHasLiked(true);
      }
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
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

      try {
        await axios.post(`/api/comment`, {
          content: newComment,
          blogId: post?.id,
        });
        showToast({
          message: "Comment posted successfully!",
          type: "success",
          title: "",
        });
      } catch {
        showToast({
          message: "Failed to post comment",
          type: "error",
          title: "",
        });
        // Remove the comment from UI if API call failed
        setComments(comments.filter((c) => c.id !== comment.id));
      }
    }
  };

  const handleShare = (platform: string) => {
    if (!post) return;

    const url = `${window.location.origin}/blog/${post.id}`;
    const title = post.title;

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        showToast({
          message: "Link copied to clipboard!",
          type: "success",
          title: "",
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const copyBlogId = () => {
    if (post) {
      navigator.clipboard.writeText(post.id);
      showToast({
        message: "Blog ID copied to clipboard!",
        type: "success",
        title: "",
      });
    }
  };

  const shareBlog = async () => {
    if (!post) return;

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

  if (loading) {
    return <BlogPostSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Blog Post Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "The requested blog post could not be found."}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate estimated reading time
  const wordsPerMinute = 200;
  const wordCount = post.content?.split(" ").length || 500;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  // Generate structured data for the blog post
  const articleStructuredData = generateStructuredData({
    type: "Article",
    data: {
      title: post.title,
      description: post.excerpt,
      author: post.author,
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      image: post.coverImage,
      url: `/blog/${post.id}`,
    },
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />

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
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/blog?tag=${tag.toLowerCase()}`}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full hover:bg-orange-200 transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Author and Meta Info */}
            <div className="flex items-center justify-between py-4 border-y border-gray-200">
              <div className="flex items-center space-x-4">
                <Link href={`/users/${post.author.id}`}>
                  <Image
                    src={
                      post.author.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.name}`
                    }
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all"
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
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
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
                    hasLiked
                      ? " text-red-600"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`}
                  />
                  <span className="font-medium">{likes}</span>
                </button>

                <div className="flex items-center space-x-1 py-2 rounded-lg bg-gray-50 text-gray-600">
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
            <ProductionMarkdownViewer
              content={post.content}
              showControls={true}
              initialTheme="light"
              initialFontSize="medium"
              className="blog-content"
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Share this article:
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleShare("facebook")}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="p-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="p-2 bg-black text-white rounded hover:bg-teal-800 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="p-2 bg-black text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </footer>

          {/* Comments Section */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleComment} className="mb-8">
                <div className="flex space-x-4">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={
                        userProfile?.image ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.name}`
                      }
                      alt={userProfile?.name || "User"}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                <Lock className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 mb-3">
                  Please log in to comment on this post
                </p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Log In
                </button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4 items-center">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Link href={`/users/${comment.author.id}`}>
                      <Image
                        src={
                          comment.author.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.name}`
                        }
                        alt={comment.author.name}
                        fill
                        className="rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all"
                      />
                    </Link>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className="font-semibold text-gray-900"
                          onClick={() => {
                            router.push(`/users/${comment.author.id}`);
                          }}
                        >
                          {comment.author.name}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          </section>
        </article>

        <Footer />

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            returnUrl={`/blog/${blogId}`}
          />
        )}
      </div>
    </>
  );
}
