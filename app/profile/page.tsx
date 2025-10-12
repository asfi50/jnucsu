"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/auth-context";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Save,
  Edit3,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
} from "lucide-react";
import useAxios from "@/hooks/use-axios";
import { useToast } from "@/components/ui/ToastProvider";
import { useData } from "@/context/data-context";
import { compressImage, fileToBase64 } from "@/lib/utils/image-compression";
import Gallery from "@/components/profile/gallery";

export default function ProfilePage() {
  const router = useRouter();
  const { loading, isAuthenticated, userProfile } = useAuth();
  const { departments, departmentsLoading, departmentsError } = useData();
  const [image_url, setProfileImage] = useState<string | null>(
    userProfile?.image || null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);
  const [pendingImageData, setPendingImageData] = useState<string | null>(null);
  const axios = useAxios();
  const { showToast } = useToast();

  // Function to refresh profile data after gallery changes
  const refreshProfile = async () => {
    try {
      // The profile will be automatically refreshed by the auth context
      // We can trigger a page refresh or fetch profile data manually
      window.location.reload();
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  // Initialize formData when userProfile is loaded
  useEffect(() => {
    if (userProfile && !formData) {
      setFormData(userProfile);
    }
  }, [userProfile, formData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return prev;
      // Special handling for nested 'links' object
      if (
        ["facebook", "linkedin", "twitter", "instagram", "website"].includes(
          name
        )
      ) {
        return {
          ...prev,
          links: {
            ...prev.links,
            [name]: value,
          },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
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
      setProfileImage(previewUrl);

      showToast({
        type: "success",
        title: "Image Ready",
        message:
          "Image processed successfully. Save your profile to upload it.",
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
    }
  };

  const handleSave = async () => {
    if (!formData || !formData.id) {
      showToast({
        type: "error",
        title: "Error",
        message:
          "Profile data is missing. Please refresh the page and try again.",
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        newImageData: pendingImageData,
      };

      showToast({
        type: "info",
        title: "Saving Profile",
        message: pendingImageData
          ? "Uploading image and saving profile..."
          : "Saving profile...",
      });

      await axios.post("/api/profile/update", payload);

      // Clear pending image data after successful upload
      setPendingImageData(null);

      showToast({
        type: "success",
        title: "Profile Updated!",
        message: "Your profile information has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "There was an error updating your profile.";

      showToast({
        type: "error",
        title: "Failed to Update Profile",
        message: errorMessage,
      });
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original user profile
    setFormData(userProfile);
    // Clear any pending image data
    setPendingImageData(null);
    // Reset profile image to original
    setProfileImage(userProfile?.image || null);
    // Exit editing mode
    setIsEditing(false);
  };

  const yearOptions = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "Masters",
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Profile Settings
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your profile information and showcase your leadership
                  journey
                </p>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm sm:text-base"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm sm:text-base"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Picture
              </h2>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                    {userProfile?.image ? (
                      <Image
                        src={image_url || userProfile.image}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <p className="text-3xl font-bold">
                          {userProfile?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </p>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {userProfile?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {userProfile?.department}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData?.name ?? ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email ?? ""}
                    onChange={handleInputChange}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData?.phone ?? ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData?.studentId ?? ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    name="did"
                    value={formData?.did ?? ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select Department</option>
                    {departmentsLoading && <option value="">Loading...</option>}
                    {departmentsError && (
                      <option value="">Error loading departments</option>
                    )}
                    {departments?.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Academic Year
                  </label>
                  <select
                    name="year"
                    value={formData?.year ?? ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData?.address ?? ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About Me
              </h2>
              <textarea
                name="about"
                value={formData?.about}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Tell us about yourself, your interests, and what you're passionate about..."
              />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Social Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Facebook className="w-4 h-4 inline mr-2" />
                    Facebook Profile
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData?.links?.facebook || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="https://facebook.com/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData?.links?.linkedin || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Twitter className="w-4 h-4 inline mr-2" />
                    Twitter Profile
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData?.links?.twitter || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="https://twitter.com/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Instagram className="w-4 h-4 inline mr-2" />
                    Instagram Profile
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData?.links?.instagram || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Personal Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData?.links?.website || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            <Gallery
              gallery={userProfile?.workGallery}
              onGalleryUpdate={refreshProfile}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
