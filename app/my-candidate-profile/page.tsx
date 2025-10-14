"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Award,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuth } from "@/context/auth-context";
import useAxios from "@/hooks/use-axios";
import { CandidateProfile } from "@/lib/types/profile.types";
import { useData } from "@/context/data-context";
import MyCandidateProfileSkeleton from "@/components/candidates/MyCandidateProfileSkeleton";

const MyCandidateProfilePage = () => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const { showToast } = useToast();
  const { userProfile } = useAuth();
  const axios = useAxios();
  const {
    candidateProfile,
    candidateProfileLoading,
    candidateProfileError,
    refreshCandidateProfile: refreshProfile,
  } = useData();

  useEffect(() => {
    if (candidateProfile) {
      setProfile(candidateProfile);
    } else if (!candidateProfileLoading && !candidateProfileError) {
      // If loading is complete and no error, but no profile found
      setProfile(null);
    }
  }, [candidateProfile, candidateProfileLoading, candidateProfileError]);

  const getStatusIcon = (status: CandidateProfile["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "draft":
        return <Edit className="w-5 h-5 text-gray-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: CandidateProfile["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: CandidateProfile["status"]) => {
    switch (status) {
      case "approved":
        return "Profile Approved & Published";
      case "pending":
        return "Under Review";
      case "draft":
        return "Draft";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const handleToggleParticipation = async () => {
    if (!profile) return;

    try {
      const newParticipationStatus = !profile.isParticipating;
      await axios.patch(`/api/candidate/application/${profile.id}`, {
        isParticipating: newParticipationStatus,
      });
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              isParticipating: newParticipationStatus,
            }
          : null
      );

      showToast({
        type: "success",
        title: newParticipationStatus
          ? "Participation Enabled"
          : "Participation Disabled",
        message: newParticipationStatus
          ? "You are now actively participating in the election."
          : "You have marked yourself as not participating in the election.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update participation status. Please try again.",
      });
    }
  };

  const handleDeleteProfile = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your candidate profile? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`/api/candidate/application/${profile?.id}`);

      setProfile(null);
      // Also refresh the context to reflect the deletion
      await refreshProfile();
      showToast({
        type: "success",
        title: "Profile Deleted",
        message: "Your candidate profile has been deleted successfully.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete your profile. Please try again.",
      });
    }
  };

  if (candidateProfileLoading) {
    return (
      <ProtectedRoute>
        <MyCandidateProfileSkeleton />
      </ProtectedRoute>
    );
  }

  if (candidateProfileError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-2xl w-full text-center">
              <AlertTriangle className="w-20 h-20 text-red-400 mx-auto mb-6" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Error Loading Profile
              </h1>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!candidateProfileLoading && !candidateProfileError && !candidateProfile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />

          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-2xl w-full text-center">
              <Award className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                No Candidate Profile Found
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
                You haven&apos;t created a candidate profile yet. Submit your
                profile to participate in the upcoming student union elections.
              </p>
              <Link href="/submit-candidate">
                <Button className="flex items-center space-x-2 mx-auto">
                  <Award className="w-5 h-5" />
                  <span>Create Candidate Profile</span>
                </Button>
              </Link>
            </div>
          </div>

          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {profile && (
        <div className="min-h-screen bg-gray-50">
          <Header />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    My Candidate Profile
                  </h1>
                  <p className="text-gray-600">
                    Manage your candidate profile and track your election
                    campaign.
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {profile.status === "approved" && (
                    <Link href={`/candidates/${profile.id}`}>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Public Profile</span>
                      </Button>
                    </Link>
                  )}

                  {(profile.status === "draft" ||
                    profile.status === "rejected") && (
                    <Link href="/submit-candidate">
                      <Button className="flex items-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div
              className={`bg-white rounded-lg border-2 p-6 mb-8 ${getStatusColor(
                profile.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(profile.status)}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {getStatusText(profile.status)}
                    </h3>
                    <p className="text-sm opacity-75">
                      {profile.status === "approved" &&
                        profile.approvedAt &&
                        `Approved on ${new Date(
                          profile.approvedAt
                        ).toLocaleDateString()}`}
                      {profile.status === "pending" &&
                        "Your profile is under review by the moderation team."}
                      {profile.status === "draft" &&
                        "Complete and submit your profile for review."}
                      {profile.status === "rejected" &&
                        "Your profile was rejected. Please review the feedback and resubmit."}
                    </p>
                  </div>
                </div>

                {profile.status === "approved" && (
                  <div className="text-right">
                    <p className="text-2xl font-bold">{profile.votes}</p>
                    <p className="text-sm opacity-75">votes received</p>
                  </div>
                )}
              </div>

              {profile.status === "rejected" && profile.rejectionReason && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-900 mb-2">
                    Rejection Reason:
                  </h4>
                  <p className="text-red-800">{profile.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            {profile.status === "approved" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Profile Views
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {profile.views.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Votes Received
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {profile.votes}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Days Active
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {Math.ceil(
                          (Date.now() -
                            new Date(profile.approvedAt!).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Information */}
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-orange-500" />
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <p className="text-gray-900">{userProfile?.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {userProfile?.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {profile.phone}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student ID
                    </label>
                    <p className="text-gray-900">{profile.studentId}</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <p className="text-gray-900 flex items-start">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                      {profile.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                  Academic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <p className="text-gray-900">{profile.department}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Semester
                    </label>
                    <p className="text-gray-900">{profile.semester}</p>
                  </div>
                </div>
              </div>

              {/* Election Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-orange-500" />
                  Election Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <p className="text-gray-900 font-medium">
                      {profile.position}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Participation Status
                      </label>
                      <p
                        className={`font-medium ${
                          profile.isParticipating
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {profile.isParticipating
                          ? "Actively Participating"
                          : "Not Participating"}
                      </p>
                      {!profile.isParticipating && (
                        <p className="text-sm text-red-600 mt-1">
                          ⚠️ Your candidate profile is hidden from public view
                        </p>
                      )}
                    </div>

                    {profile.isParticipating ? (
                      <div className="text-right">
                        <Button
                          variant="outline"
                          onClick={handleToggleParticipation}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Mark as Not Participating
                        </Button>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs">
                          Disabling will hide your profile from public
                        </p>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleToggleParticipation}
                        className="text-green-600 hover:text-green-700"
                        disabled={profile.status !== "approved"}
                      >
                        Resume Participation
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Profile Content
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biography
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {profile.biography}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Election Manifesto
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {profile.manifesto}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience & Qualifications
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {profile.experience}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achievements & Recognition
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {profile.achievements}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {(profile.facebook ||
                profile.linkedin ||
                profile.twitter ||
                profile.instagram ||
                profile.website) && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Social Links & Website
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {profile.facebook && (
                      <a
                        href={profile.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {profile.twitter && (
                      <a
                        href={profile.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-sky-500 hover:text-sky-500 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                        <span>Twitter</span>
                      </a>
                    )}
                    {profile.instagram && (
                      <a
                        href={profile.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-pink-500 hover:text-pink-500 transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Profile Management */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Profile Management
                </h2>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Danger Zone</p>
                    <p className="text-sm text-gray-600">
                      Permanently delete your candidate profile and all
                      associated data.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleDeleteProfile}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Delete Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      )}
    </ProtectedRoute>
  );
};

export default MyCandidateProfilePage;
