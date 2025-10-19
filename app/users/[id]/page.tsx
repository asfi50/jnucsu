"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/auth-context";
import UserProfileSkeleton from "@/components/shared/UserProfileSkeleton";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Edit3,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  FileText,
} from "lucide-react";
import { PublicProfile } from "@/lib/types/profile.types";

export default function PublicUserProfilePage() {
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const userId = params.id as string;
  const isOwnProfile = isAuthenticated && user?.id === userId;
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<PublicProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await fetch(`/api/user/profile/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <UserProfileSkeleton />;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={profileData?.avatar || "/images/default-avatar.svg"}
                      alt={profileData?.name || "User Avatar"}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/default-avatar.svg";
                      }}
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {profileData?.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {profileData?.department}
                    </p>
                  </div>
                </div>
                {isOwnProfile && (
                  <Link href="/profile">
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  </Link>
                )}
              </div>

              {/* Basic Info - Always visible */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-orange-600" />
                  <span>{profileData?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>ID: {profileData?.studentId}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>{profileData?.year}</span>
                </div>
              </div>

              {/* Private Info - Only visible to own profile */}
              {isOwnProfile && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Private Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-orange-600" />
                      <span>{profileData?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span>{profileData?.address}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {profileData?.links && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Connect
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {profileData?.links?.facebook && (
                      <a
                        href={profileData.links.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                        <span className="text-sm">Facebook</span>
                      </a>
                    )}
                    {profileData?.links?.linkedin && (
                      <a
                        href={profileData.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    )}
                    {profileData?.links?.twitter && (
                      <a
                        href={profileData.links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-sky-500 hover:text-sky-500 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                        <span className="text-sm">Twitter</span>
                      </a>
                    )}
                    {profileData?.links?.instagram && (
                      <a
                        href={profileData.links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-pink-500 hover:text-pink-500 transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                        <span className="text-sm">Instagram</span>
                      </a>
                    )}
                    {profileData?.links?.website && (
                      <a
                        href={profileData.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">Website</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {profileData?.about}
              </p>
            </div>

            {/* Blog Posts */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <FileText className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Blog Posts ({profileData?.blogs?.length})
                </h2>
              </div>
              {(profileData?.blogs?.length ?? 0) > 0 ? (
                <div className="space-y-4">
                  {(profileData?.blogs ?? []).map((blog) => (
                    <Link key={blog.id} href={`/blog/${blog.id}`}>
                      <div className="border-b border-gray-100 pb-4 last:border-b-0 hover:bg-gray-50 transition-colors p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>
                            {new Date(blog.publishedAt).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            {blog.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No blog posts yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
