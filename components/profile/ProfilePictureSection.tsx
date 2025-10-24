"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Camera, Edit3, Save, X, Upload } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { compressImage, fileToBase64 } from "@/lib/utils/image-compression";

// Helper function to get proper image URL
const getImageUrl = (imageString: string | undefined): string | null => {
  if (!imageString) return null;

  // If it's already a full URL (including Cloudinary), return as is
  if (imageString.startsWith("http://") || imageString.startsWith("https://")) {
    return imageString;
  }

  // If it's a base64 string, return as is
  if (imageString.startsWith("data:image/")) {
    return imageString;
  }

  // If it's a blob URL, return as is
  if (imageString.startsWith("blob:")) {
    return imageString;
  }

  // For relative paths or asset IDs, construct the full URL
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:3000";

  if (imageString.startsWith("/")) {
    return `${baseUrl}${imageString}`;
  }

  // Assume it's a server asset ID
  return `${baseUrl}/assets/${imageString}`;
};

interface ProfilePictureSectionProps {
  name: string;
  department?: string;
  currentImage?: string;
  onUpdate: (imageData: string) => Promise<void>;
  isLoading?: boolean;
}

export default function ProfilePictureSection({
  name,
  department,
  currentImage,
  onUpdate,
  isLoading = false,
}: ProfilePictureSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    getImageUrl(currentImage)
  );
  const [pendingImageData, setPendingImageData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === "development") {
    console.log("ProfilePictureSection - currentImage:", currentImage);
    console.log(
      "ProfilePictureSection - processed currentImage:",
      getImageUrl(currentImage)
    );
    console.log("ProfilePictureSection - previewImage:", previewImage);
  }

  // Update preview image when currentImage prop changes
  useEffect(() => {
    const processedImage = getImageUrl(currentImage);
    if (processedImage && processedImage !== previewImage) {
      setPreviewImage(processedImage);
      setImageError(false); // Reset error state for new image
    }
  }, [currentImage, previewImage]);

  const handleSave = async () => {
    if (!pendingImageData) {
      setIsEditing(false);
      return;
    }

    try {
      await onUpdate(pendingImageData);
      setIsEditing(false);
      setPendingImageData(null);
      showToast({
        type: "success",
        title: "Profile Picture Updated",
        message: "Your profile picture has been updated successfully.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update profile picture. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setPreviewImage(getImageUrl(currentImage));
    setPendingImageData(null);
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast({
        type: "error",
        title: "Invalid File Type",
        message: "Please select a valid image file.",
      });
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      showToast({
        type: "error",
        title: "File Too Large",
        message: "Please select an image smaller than 10MB.",
      });
      return;
    }

    try {
      setIsProcessing(true);
      showToast({
        type: "info",
        title: "Processing Image",
        message: "Compressing your image...",
      });

      // Compress the image
      const compressedFile = await compressImage(file, 800, 600, 0.8);

      // Convert to base64
      const base64Data = await fileToBase64(compressedFile);

      // Store the base64 data for upload when profile is saved
      setPendingImageData(base64Data);

      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(compressedFile);
      setPreviewImage(previewUrl);

      showToast({
        type: "success",
        title: "Image Ready",
        message:
          "Image processed successfully. Click save to update your profile picture.",
      });
    } catch (error) {
      console.error("Image processing error:", error);
      showToast({
        type: "error",
        title: "Processing Failed",
        message:
          error instanceof Error
            ? error.message
            : "Failed to process image. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (fullName: string): string => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Profile Picture</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )}
        {isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || isProcessing || !pendingImageData}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? "Saving..." : "Save"}</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
            {previewImage ? (
              <>
                {!imageError ? (
                  <Image
                    src={previewImage}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized={
                      previewImage.startsWith("blob:") ||
                      previewImage.startsWith("data:")
                    }
                    priority={true}
                  />
                ) : (
                  <Image
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    unoptimized={
                      previewImage.startsWith("blob:") ||
                      previewImage.startsWith("data:")
                    }
                    width={96}
                    height={96}
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-orange-100 to-orange-200">
                <span className="text-2xl font-bold text-orange-600">
                  {getInitials(name)}
                </span>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="absolute -bottom-2 -right-2">
              <button
                onClick={triggerFileInput}
                disabled={isProcessing}
                className="bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-lg"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-lg">{name}</h3>
          {department && (
            <p className="text-sm text-gray-500 mt-1">{department}</p>
          )}

          {isEditing && (
            <div className="mt-3">
              <button
                onClick={triggerFileInput}
                disabled={isProcessing}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
              >
                <Upload className="w-4 h-4" />
                <span>
                  {isProcessing ? "Processing..." : "Upload New Photo"}
                </span>
              </button>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG or GIF. Max size 10MB. Recommended: 400x400px
              </p>
            </div>
          )}

          {!isEditing && !previewImage && (
            <div className="mt-3">
              <p className="text-sm text-gray-500">
                Add a profile picture to help others recognize you
              </p>
            </div>
          )}
        </div>
      </div>

      {pendingImageData && isEditing && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2 text-orange-700">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <p className="text-sm font-medium">New image ready for upload</p>
          </div>
          <p className="text-xs text-orange-600 mt-1">
            Click &quot;Save&quot; to update your profile picture
          </p>
        </div>
      )}
    </div>
  );
}
