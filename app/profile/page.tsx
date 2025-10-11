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
  X,
  Plus,
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

export default function ProfilePage() {
  const router = useRouter();
  const { loading, isAuthenticated, userProfile } = useAuth();
  const { departments, departmentsLoading, departmentsError } = useData();
  const [image_url, setProfileImage] = useState<string | null>(
    userProfile?.image || null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);
  const axios = useAxios();
  const { showToast } = useToast();

  const [gallery, setGallery] = useState([
    {
      id: 1,
      url: "/api/placeholder/300/200",
      title: "Student Union Meeting",
      description: "Leading weekly student council discussions",
    },
    {
      id: 2,
      url: "/api/placeholder/300/200",
      title: "Campus Event Organization",
      description: "Organizing annual cultural festival",
    },
    {
      id: 3,
      url: "/api/placeholder/300/200",
      title: "Community Service",
      description: "Blood donation drive coordination",
    },
    {
      id: 4,
      url: "/api/placeholder/300/200",
      title: "Academic Workshop",
      description: "Hosting skill development sessions",
    },
  ]);

  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    description: "",
    url: "",
  });

  const [showAddGallery, setShowAddGallery] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      fetch("/api/upload/photo", {
        method: "POST",
        body: formData,
      })
        .then(async (res) => {
          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Upload failed");
          }
          return res.json();
        })
        .then((data) => {
          // Optionally update the profile image in state here
          // setProfileImage(data.url);
          // If you want to update userProfile.image:
          setFormData((prev) => (prev ? { ...prev, image: data.url } : prev));
          setProfileImage(data.url);
        })
        .catch((err) => {
          alert("Image upload failed: " + err.message);
        });
    }
  };

  const handleSave = () => {
    const payload = { ...formData };
    const response = axios.post("/api/profile/update", payload);
    response
      .then(() => {
        showToast({
          type: "success",
          title: "Profile Updated!",
          message: "Your profile information has been updated successfully.",
        });
      })
      .catch(() => {
        showToast({
          type: "error",
          title: "Failed to Update Profile",
          message: "There was an error updating your profile.",
        });
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  const handleAddGalleryItem = () => {
    if (newGalleryItem.title && newGalleryItem.description) {
      const newItem = {
        id: gallery.length + 1,
        url: newGalleryItem.url || "/api/placeholder/300/200",
        title: newGalleryItem.title,
        description: newGalleryItem.description,
      };
      setGallery([...gallery, newItem]);
      setNewGalleryItem({ title: "", description: "", url: "" });
      setShowAddGallery(false);
    }
  };

  const handleRemoveGalleryItem = (id: number) => {
    setGallery(gallery.filter((item) => item.id !== id));
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
                      onClick={() => setIsEditing(false)}
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

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Work Gallery
                </h2>
                {isEditing && (
                  <button
                    onClick={() => setShowAddGallery(true)}
                    className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                )}
              </div>

              {showAddGallery && (
                <div className="mb-6 p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Add New Gallery Item
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Title"
                      value={newGalleryItem.title}
                      onChange={(e) =>
                        setNewGalleryItem({
                          ...newGalleryItem,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Description"
                      value={newGalleryItem.description}
                      onChange={(e) =>
                        setNewGalleryItem({
                          ...newGalleryItem,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddGalleryItem}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Add Item
                      </button>
                      <button
                        onClick={() => setShowAddGallery(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.url}
                        alt={item.title}
                        width={300}
                        height={192}
                        className="w-full h-48 object-cover"
                        priority
                      />
                    </div>
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveGalleryItem(item.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
