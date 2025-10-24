"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/auth-context";
import ProfilePageSkeleton from "@/components/shared/ProfilePageSkeleton";
import useAxios from "@/hooks/use-axios";
import { useData } from "@/context/data-context";
import Gallery from "@/components/profile/gallery";
import ProfilePictureSection from "@/components/profile/ProfilePictureSection";
import BasicInfoSection from "@/components/profile/BasicInfoSection";
import AboutSection from "@/components/profile/AboutSection";
import SocialMediaManager from "@/components/profile/SocialMediaManager";
import { useToast } from "@/components/ui/ToastProvider";

export default function ProfilePage() {
  const router = useRouter();
  const { loading, isAuthenticated, userProfile, setUserProfile } = useAuth();
  const { departments } = useData();
  const axios = useAxios();
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Pass usernames directly to SocialMediaManager (no URL conversion needed)
  const socialMediaLinks = userProfile?.links
    ? {
        facebook: userProfile.links.facebook || undefined,
        instagram: userProfile.links.instagram || undefined,
        linkedin: userProfile.links.linkedin || undefined,
        website: userProfile.links.website || undefined,
      }
    : {};

  // Section update handlers
  const handleProfilePictureUpdate = async (imageData: string) => {
    await axios.patch("/api/profile/picture", { imageData });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBasicInfoUpdate = async (data: any) => {
    await axios.patch("/api/profile/basic-info", data);
    setUserProfile((prevProfile) => ({
      ...prevProfile!,
      name: data.name,
      email: data.email,
      phone: data.phone,
      studentId: data.studentId,
      did: data.did,
      year: data.year,
      address: data.address,
    }));
  };

  const handleAboutUpdate = async (about: string) => {
    await axios.patch("/api/profile/about", { about });
    setUserProfile((prevProfile) => ({
      ...prevProfile!,
      about,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSocialMediaUpdate = async (links: any) => {
    try {
      await axios.patch("/api/profile/social-media", { links });
      setUserProfile((prevProfile) => ({
        ...prevProfile!,
        links: {
          facebook: links.facebook || undefined,
          instagram: links.instagram || undefined,
          linkedin: links.linkedin || undefined,
          website: links.website || undefined,
        },
      }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update social media links. Please try again.",
      });
    }
  };

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
            </div>

            {/* Profile Picture Section */}
            <ProfilePictureSection
              name={userProfile?.name || ""}
              department={userProfile?.department}
              currentImage={userProfile?.image}
              onUpdate={handleProfilePictureUpdate}
              isLoading={!userProfile}
            />

            {/* Basic Information Section */}
            <BasicInfoSection
              data={{
                name: userProfile?.name || "",
                email: userProfile?.email || "",
                phone: userProfile?.phone,
                studentId: userProfile?.studentId,
                did: userProfile?.did,
                year: userProfile?.year?.toString(),
                address: userProfile?.address,
              }}
              departments={departments || []}
              onUpdate={handleBasicInfoUpdate}
            />

            {/* About Me Section */}
            <AboutSection
              about={userProfile?.about}
              onUpdate={handleAboutUpdate}
            />

            {/* Social Media Section */}
            <SocialMediaManager
              links={socialMediaLinks}
              onUpdate={handleSocialMediaUpdate}
            />

            {/* Gallery Section */}
            <Gallery gallery={userProfile?.workGallery} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
