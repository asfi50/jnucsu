"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import { useData } from "@/context/data-context";
import { MyBlogPost } from "@/lib/types/blogs.types";
import MyBlogsSkeleton from "@/components/blog/MyBlogsSkeleton";
import { useBlogStatus } from "@/hooks/use-blog-status";

const MyBlogsPage = () => {
  const { blogs, blogsLoading, refreshBlogs, setBlogs } = useData();
  const [filter, setFilter] = useState<
    "all" | "draft" | "pending" | "published" | "rejected"
  >("all");
  const { showToast } = useToast();
  const { submitForReview, loading: blogStatusLoading } = useBlogStatus();

  const filteredBlogs =
    filter === "all" ? blogs : blogs?.filter((blog) => blog.status === filter);

  const getStatusIcon = (status: MyBlogPost["status"]) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "draft":
        return <Edit className="w-4 h-4 text-gray-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: MyBlogPost["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async (blog: MyBlogPost) => {
    if (
      !confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // Only allow deletion if blog is draft
      if (blog.status !== "draft") {
        showToast({
          type: "error",
          title: "Cannot Delete",
          message: "Only draft blogs can be deleted.",
        });
        return;
      }

      // Simulate API call for now - will implement proper deletion API later
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast({
        type: "success",
        title: "Blog Deleted",
        message: "The blog post has been deleted successfully.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete the blog post. Please try again.",
      });
    }
  };

  const handlePublish = async (blog: MyBlogPost) => {
    try {
      // Optimistic update - immediately update UI
      if (setBlogs && blogs) {
        setBlogs((prevBlogs) =>
          prevBlogs
            ? prevBlogs.map((b) =>
                b.id === blog.id
                  ? {
                      ...b,
                      status: "pending" as const,
                      updatedAt: new Date().toISOString(),
                    }
                  : b
              )
            : prevBlogs
        );
      }

      // Use currentVersionId if available, otherwise use blog id
      const versionId = blog.currentVersionId || blog.id;

      // Call the real API to submit blog for review
      await submitForReview(versionId);

      // Refresh blogs to get updated status from server (to ensure consistency)
      if (refreshBlogs) {
        await refreshBlogs();
      }

      showToast({
        type: "success",
        title: "Blog Submitted",
        message: "Your blog post has been submitted for review.",
      });
    } catch (error) {
      // Revert optimistic update on error
      if (refreshBlogs) {
        await refreshBlogs();
      }

      showToast({
        type: "error",
        title: "Submission Failed",
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit the blog post. Please try again.",
      });
    }
  };

  if (blogsLoading) {
    return (
      <ProtectedRoute>
        <MyBlogsSkeleton />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                My Blog Posts
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage your blog posts, track their status, and create new
                content.
              </p>
            </div>
            <Link href="/submit-blog" className="shrink-0">
              <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                <span className="whitespace-nowrap">Write New Post</span>
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-8">
            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-lg border border-gray-200 relative overflow-hidden">
              <div className="lg:hidden inset-0 absolute w-12  opacity-10 ">
                <Edit className="w-full h-full text-blue-600" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Total Posts
                  </p>
                  <p className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900">
                    {blogs?.length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg hidden md:flex md:items-center md:justify-center ">
                  <Edit className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-lg border border-gray-200 relative overflow-hidden">
              <div className="lg:hidden inset-0 absolute w-12 opacity-10">
                <CheckCircle className="w-full h-full text-green-600" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Published
                  </p>
                  <p className="text-sm sm:text-xl md:text-2xl font-bold text-green-600">
                    {blogs?.filter((b) => b.status === "published").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg hidden md:flex md:items-center md:justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-lg border border-gray-200 relative overflow-hidden">
              <div className="lg:hidden inset-0 absolute w-12 opacity-10">
                <Clock className="w-full h-full text-yellow-600" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Pending Review
                  </p>
                  <p className="text-sm sm:text-xl md:text-2xl font-bold text-yellow-600">
                    {blogs?.filter((b) => b.status === "pending").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg hidden md:flex md:items-center md:justify-center">
                  <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-lg border border-gray-200 relative overflow-hidden">
              <div className="lg:hidden inset-0 absolute w-12 opacity-10">
                <Eye className="w-full h-full text-orange-600" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Total Views
                  </p>
                  <p className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900">
                    {blogs?.reduce((sum, blog) => sum + blog.views, 0)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-lg hidden md:flex md:items-center md:justify-center">
                  <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <div className="overflow-x-auto md:overflow-visible">
                <nav className="-mb-px flex space-x-4 md:space-x-8 min-w-max md:min-w-0">
                  {[
                    { key: "all", label: "All Posts", count: blogs?.length },
                    {
                      key: "published",
                      label: "Published",
                      count: blogs?.filter((b) => b.status === "published")
                        .length,
                    },
                    {
                      key: "pending",
                      label: "Pending",
                      count: blogs?.filter((b) => b.status === "pending")
                        .length,
                    },
                    {
                      key: "draft",
                      label: "Drafts",
                      count: blogs?.filter((b) => b.status === "draft").length,
                    },
                    {
                      key: "rejected",
                      label: "Rejected",
                      count: blogs?.filter((b) => b.status === "rejected")
                        .length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() =>
                        setFilter(
                          tab.key as
                            | "all"
                            | "draft"
                            | "pending"
                            | "published"
                            | "rejected"
                        )
                      }
                      className={`py-2 px-2 md:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                        filter === tab.key
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <span className="hidden md:inline">
                        {tab.label} ({tab.count})
                      </span>
                      <span className="md:hidden">
                        {tab.label.split(" ")[0]} ({tab.count})
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Blog Posts List */}
          {filteredBlogs?.length === 0 ? (
            <div className="text-center py-12">
              <Edit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === "all" ? "No blog posts yet" : `No ${filter} posts`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === "all"
                  ? "Start sharing your thoughts and ideas with the community."
                  : `You don't have any ${filter} posts at the moment.`}
              </p>
              {filter === "all" && (
                <Link href="/submit-blog">
                  <Button>Write Your First Post</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredBlogs?.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6"
                >
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-4">
                    {/* Header with title and status */}
                    <div className="flex flex-col gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {blog.title}
                          </h3>
                          <span
                            className={`self-start inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${getStatusColor(
                              blog.status
                            )}`}
                          >
                            {getStatusIcon(blog.status)}
                            <span className="ml-1 capitalize">
                              {blog.status}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Status indicators for mobile */}
                      <div className="flex items-center justify-end">
                        {blog.status === "pending" && (
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <Clock className="w-4 h-4 animate-pulse" />
                            <span className="text-xs font-medium">
                              Under Review
                            </span>
                          </div>
                        )}
                        {blog.status === "published" && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">
                              Published
                            </span>
                          </div>
                        )}
                        {blog.status === "rejected" && (
                          <div className="flex items-center space-x-1 text-red-600">
                            <XCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">
                              Rejected
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {blog.excerpt}
                    </p>

                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {blog.category}
                      </span>
                      <span>
                        {new Date(blog.updatedAt).toLocaleDateString()}
                      </span>
                      {blog.status === "published" && (
                        <>
                          <span>{blog.views} views</span>
                          <span>{blog.likes} likes</span>
                        </>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Rejection reason */}
                    {blog.status === "rejected" && blog.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong>{" "}
                          {blog.rejectionReason}
                        </p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                      {blog.status === "draft" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePublish(blog)}
                          disabled={blogStatusLoading}
                          className="flex items-center space-x-2 text-xs px-3 py-2"
                        >
                          {blogStatusLoading && (
                            <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                          )}
                          <span>
                            {blogStatusLoading ? "Submitting..." : "Submit"}
                          </span>
                        </Button>
                      )}

                      {/* Edit button */}
                      {(blog.status === "draft" ||
                        blog.status === "rejected" ||
                        blog.status === "published") && (
                        <Link href={`/submit-blog?edit=${blog.id}`}>
                          <Button variant="outline" size="sm" className="p-2">
                            <Edit className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                      )}

                      {/* View button */}
                      {blog.status === "published" && (
                        <Link href={`/blog/${blog.id}`}>
                          <Button variant="outline" size="sm" className="p-2">
                            <Eye className="w-4 h-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </Link>
                      )}

                      {/* Delete button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(blog)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>

                  {/* Desktop Layout - Original Style */}
                  <div className="hidden md:block">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {blog.title}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${getStatusColor(
                              blog.status
                            )}`}
                          >
                            {getStatusIcon(blog.status)}
                            <span className="ml-1 capitalize">
                              {blog.status}
                            </span>
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4">{blog.excerpt}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                          <span>Category: {blog.category}</span>
                          <span>•</span>
                          <span>
                            Updated:{" "}
                            {new Date(blog.updatedAt).toLocaleDateString()}
                          </span>
                          {blog.status === "published" && (
                            <>
                              <span>•</span>
                              <span>{blog.views} views</span>
                              <span>•</span>
                              <span>{blog.likes} likes</span>
                            </>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {blog.status === "rejected" && blog.rejectionReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-800">
                              <strong>Rejection Reason:</strong>{" "}
                              {blog.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-6">
                        {blog.status === "pending" && (
                          <div className="flex items-center space-x-2 text-yellow-600">
                            <Clock className="w-4 h-4 animate-pulse" />
                            <span className="text-sm font-medium">
                              Under Review
                            </span>
                          </div>
                        )}

                        {blog.status === "published" && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Published
                            </span>
                          </div>
                        )}

                        {blog.status === "rejected" && (
                          <div className="flex items-center space-x-2 text-red-600">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Rejected
                            </span>
                          </div>
                        )}

                        {blog.status === "draft" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePublish(blog)}
                            disabled={blogStatusLoading}
                            className="flex items-center space-x-2"
                          >
                            {blogStatusLoading && (
                              <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                            )}
                            <span>
                              {blogStatusLoading
                                ? "Submitting..."
                                : "Submit for Review"}
                            </span>
                          </Button>
                        )}

                        {/* Edit button for draft, rejected, and published blogs */}
                        {(blog.status === "draft" ||
                          blog.status === "rejected" ||
                          blog.status === "published") && (
                          <Link href={`/submit-blog?edit=${blog.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}

                        {blog.status === "published" && (
                          <Link href={`/blog/${blog.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(blog)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default MyBlogsPage;
