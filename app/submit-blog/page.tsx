"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Image as ImageIcon, Tag, Upload, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import { useToast } from "@/components/ui/ToastProvider";
import useAxios from "@/hooks/use-axios";
import { useServerData } from "@/hooks/use-server-data";
import { compressImage, fileToBase64 } from "@/lib/utils/image-compression";

const SubmitBlogPage = () => {
  const searchParams = useSearchParams();
  const editBlogId = searchParams.get("edit");
  const isEditMode = !!editBlogId;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: [] as string[],
    category: "",
    thumbnail: null as File | null,
    thumbnailBase64: null as string | null,
    status: "draft" as "draft" | "pending",
  });
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    null
  );
  const [editingBlogData, setEditingBlogData] = useState<{
    id: string;
    title: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string[];
    thumbnail: string;
    status: string;
    versionId: string;
    canEdit: boolean;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const router = useRouter();
  const axios = useAxios();
  const { categories } = useServerData();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 10)
      newErrors.title = "Title must be at least 10 characters";
    if (!formData.content) newErrors.content = "Content is required";
    if (!formData.category) newErrors.category = "Category is required";

    // // In edit mode, allow keeping existing thumbnail
    // if (!formData.thumbnail && !existingThumbnail)
    //   newErrors.thumbnail = "Thumbnail image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch blog data for editing
  useEffect(() => {
    const fetchBlogForEdit = async () => {
      if (!editBlogId) return;

      try {
        setLoading(true);
        // const res = await fetch(`/api/blog/edit?blogId=${editBlogId}`);
        const res = await axios.get(`/api/blog/edit?blogId=${editBlogId}`);

        if (res.status !== 200) {
          throw new Error("Failed to fetch blog data");
        }

        const blogData = res.data;
        setEditingBlogData(blogData);

        // Pre-fill form with existing data
        setFormData({
          title: blogData.title || "",
          content: blogData.content || "",
          excerpt: blogData.excerpt || "",
          tags: blogData.tags || [],
          category: blogData.category || "",
          thumbnail: null, // Don't set file object, but keep track of existing thumbnail
          thumbnailBase64: null,
          status: "draft", // Always start as draft when editing
        });

        // Set existing thumbnail preview
        if (blogData.thumbnail) {
          setExistingThumbnail(blogData.thumbnail);
          setThumbnailPreview(blogData.thumbnail);
        }
      } catch (error) {
        console.error("Error fetching blog for edit:", error);
        showToast({
          type: "error",
          title: "Loading Failed",
          message: "Failed to load blog data for editing",
        });
        router.push("/my-blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogForEdit();
  }, [editBlogId, router, showToast, axios]);

  // Cleanup object URL on component unmount
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  const submitForm = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const blogData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        tags: formData.tags,
        category: formData.category,
        thumbnail: formData.thumbnailBase64, // Send base64 data instead of URL
        status: formData.status,
        // Include edit-specific fields if in edit mode
        ...(isEditMode && {
          blogId: editBlogId,
          keepExistingThumbnail: !formData.thumbnail && !!existingThumbnail,
        }),
      };

      // Use different endpoints for create vs edit
      const endpoint = isEditMode ? "/api/blog/edit" : "/api/blog/new";
      const response = await axios.post(endpoint, blogData);

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(
          response.data?.error ||
            `Failed to ${isEditMode ? "update" : "submit"} blog post`
        );
      }

      const action = isEditMode
        ? formData.status === "pending"
          ? "updated and submitted"
          : "updated"
        : formData.status === "pending"
        ? "submitted"
        : "saved as draft";

      showToast({
        type: "success",
        title: `Blog Post ${action.charAt(0).toUpperCase() + action.slice(1)}!`,
        message: isEditMode
          ? formData.status === "pending"
            ? "Your blog post has been updated and submitted for review."
            : "Your blog post has been updated and saved as draft."
          : formData.status === "pending"
          ? "Your blog post has been submitted for review and will be published once approved."
          : "Your blog post has been saved as draft. You can publish it later from My Blogs.",
      });

      // Clean up object URL after successful submission
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }

      // Redirect to my blogs page
      router.push("/my-blogs");
    } catch (error) {
      console.error("Submission error:", error);
      showToast({
        type: "error",
        title: `${isEditMode ? "Update" : "Submission"} Failed`,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Auto-generate excerpt from content if excerpt is empty or matches previous auto-generated excerpt
    if (field === "content" && value.length > 0) {
      const newExcerpt = value
        .replace(/[#*`_~]/g, "")
        .trim()
        .substring(0, 50);
      const currentAutoExcerpt = formData.content
        .replace(/[#*`_~]/g, "")
        .trim()
        .substring(0, 50);

      if (!formData.excerpt || formData.excerpt === currentAutoExcerpt) {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          excerpt: newExcerpt,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Please select a valid image file",
      }));
      return;
    }

    // Validate original file size (10MB limit for original file)
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Image must be less than 10MB",
      }));
      return;
    }

    setCompressing(true);
    setErrors((prev) => ({ ...prev, thumbnail: "" }));

    try {
      // Compress the image
      const compressedFile = await compressImage(file, 1200, 800, 0.8);

      // Convert compressed file to base64
      const base64Data = await fileToBase64(compressedFile);

      // Store both the original file and base64 data
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnailBase64: base64Data,
      }));

      // Create preview URL from compressed file
      const previewUrl = URL.createObjectURL(compressedFile);
      setThumbnailPreview(previewUrl);
    } catch (error) {
      console.error("Image compression failed:", error);
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Failed to process image. Please try another image.",
      }));
    } finally {
      setCompressing(false);
    }
  };

  const removeThumbnail = () => {
    // Clean up the object URL to prevent memory leaks
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setFormData((prev) => ({
      ...prev,
      thumbnail: null,
      thumbnailBase64: null,
    }));
    setThumbnailPreview(null);
    setExistingThumbnail(null); // Also clear existing thumbnail reference
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addTag = () => {
    if (
      currentTag.trim() &&
      !formData.tags.includes(currentTag.trim()) &&
      formData.tags.length < 10
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
      setErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? "Edit Blog Post" : "Write New Blog Post"}
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl">
              {isEditMode
                ? "Update your blog post. Changes will create a new version for review."
                : "Share your thoughts, ideas, and insights with the JnUCSU community. All posts are reviewed before publication."}
            </p>
          </div>

          {/* Loading state for edit mode */}
          {isEditMode && loading && !editingBlogData && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blog data for editing...</p>
            </div>
          )}

          {/* Form - only show when not loading in edit mode */}
          {(!isEditMode || editingBlogData) && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-500" />
                  Blog Details
                </h2>

                <div className="space-y-6">
                  <Input
                    type="text"
                    label="Blog Title"
                    placeholder="Enter an engaging title for your blog post"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    error={errors.title}
                  />

                  <MarkdownEditor
                    label="Content"
                    value={formData.content}
                    onChange={(value) => handleInputChange("content", value)}
                    placeholder="Write your blog content here... Share your thoughts, experiences, and insights."
                    error={errors.content}
                    height={400}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt
                      <span className="text-gray-500 text-sm font-normal ml-2">
                        (Auto-generated from content, but you can edit it)
                      </span>
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) =>
                        handleInputChange("excerpt", e.target.value)
                      }
                      placeholder="This will be auto-generated from your content, but you can customize it here..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <div className="flex justify-between mt-1">
                      {errors.excerpt && (
                        <p className="text-sm text-red-600">{errors.excerpt}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {formData.excerpt.length} characters
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media & Categorization */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-orange-500" />
                  Media & Category
                </h2>

                <div className="space-y-6">
                  {/* Thumbnail Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail Image
                    </label>
                    <div className="space-y-4">
                      {compressing ? (
                        <div className="w-full h-32 border-2 border-dashed border-orange-300 rounded-lg flex items-center justify-center bg-orange-50">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse mx-auto mb-2 opacity-60"></div>
                            <p className="text-sm text-orange-600">
                              Compressing image...
                            </p>
                          </div>
                        </div>
                      ) : thumbnailPreview ? (
                        <div className="relative inline-block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="w-48 h-32 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={removeThumbnail}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="mt-2 text-xs text-green-600">
                            ✓ Image compressed and ready
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            !compressing && fileInputRef.current?.click()
                          }
                          className={`w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center transition-colors ${
                            !compressing
                              ? "cursor-pointer hover:border-orange-400 hover:bg-orange-50"
                              : "cursor-not-allowed opacity-50"
                          }`}
                        >
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Click to upload thumbnail
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG up to 10MB (will be compressed)
                            </p>
                          </div>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                      {errors.thumbnail && (
                        <p className="text-sm text-red-600">
                          {errors.thumbnail}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.text}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.category}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-orange-500" />
                  Tags
                  <span className="text-gray-500 text-sm font-normal ml-2">
                    (Optional)
                  </span>
                </h2>

                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add tags to help categorize your post (press Enter to add)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      disabled={
                        !currentTag.trim() || formData.tags.length >= 10
                      }
                      variant="outline"
                    >
                      Add Tag
                    </Button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 w-4 h-4 flex items-center justify-center hover:bg-orange-200 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    {errors.tags && (
                      <p className="text-red-600">{errors.tags}</p>
                    )}
                    <p>{formData.tags.length}/10 tags</p>
                  </div>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, status: "draft" }));
                      submitForm();
                    }}
                    disabled={loading || compressing}
                  >
                    {compressing
                      ? "Processing..."
                      : isEditMode
                      ? "Save as Draft"
                      : "Save as Draft"}
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loading || compressing}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: "pending" }))
                    }
                  >
                    {compressing
                      ? "Processing..."
                      : loading
                      ? isEditMode
                        ? "Updating..."
                        : "Publishing..."
                      : isEditMode
                      ? "Update & Submit for Review"
                      : "Publish for Review"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default SubmitBlogPage;
