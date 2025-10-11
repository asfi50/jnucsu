"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Calendar, FileText, Award, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from "@/components/shared/loading-spinner";
import useAxios from "@/hooks/use-axios";
import { useData } from "@/context/data-context";

export interface CandidateFormData {
  position: string;
  biography: string;
  manifesto: string;
  experience: string;
  achievements: string;
  phone: string;
  address: string;
  studentId: string;
  department?: string;
  did: string;
  semester: string;
  isParticipating: boolean;
}

const SubmitCandidatePage = () => {
  const [formData, setFormData] = useState({
    position: "",
    biography: "",
    manifesto: "",
    experience: "",
    achievements: "",
    phone: "",
    address: "",
    studentId: "",
    did: "",
    semester: "",
    isParticipating: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isApplied, setIsApplied] = useState(false);
  const { showToast } = useToast();
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const axios = useAxios();
  const {
    positions,
    positionsLoading,
    positionsError,
    departments,
    departmentsLoading,
    departmentsError,
  } = useData();

  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        phone: prev.phone || userProfile.phone || "",
        address:
          (!prev.address || prev.address.trim() === "") && userProfile.address
            ? userProfile.address
            : prev.address,
        studentId: prev.studentId || userProfile.studentId || "",
        did: prev.did || userProfile.did || "",
        semester: prev.semester || userProfile.semester || "",
      }));
    }
  }, [userProfile, authLoading]);

  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!userProfile || authLoading) return;
      setLoading(true);
      try {
        const response = await axios.get("/api/candidate/application");
        if (response.status === 200) {
          setFormData(response.data);
          setIsApplied(true);
        }
      } catch (error) {
        console.error("Error checking existing application:", error);
      } finally {
        setLoading(false);
      }
    };
    checkExistingApplication();
  }, [authLoading, axios, userProfile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.biography || formData.biography.length < 50)
      newErrors.biography = "Biography must be at least 50 characters";
    if (!formData.manifesto || formData.manifesto.length < 100)
      newErrors.manifesto = "Manifesto must be at least 100 characters";
    if (!formData.phone || !/^[0-9+\-\s()]{10,}$/.test(formData.phone))
      newErrors.phone = "Valid phone number is required";
    if (!formData.address || formData.address.length < 10)
      newErrors.address = "Complete address is required";
    if (!formData.studentId) newErrors.studentId = "Student ID is required";
    if (!formData.did) newErrors.did = "Department is required";
    if (!formData.semester) newErrors.semester = "Current semester is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await axios
      .post("/api/candidate/application", {
        ...formData,
        isApplied,
      })
      .then(() => {
        showToast({
          type: "success",
          title: "Candidate Profile Submitted!",
          message:
            "Your profile has been submitted for review. You will be notified once it's approved.",
        });
        router.push("/my-candidate-profile");
      })
      .catch((error) => {
        console.error("Submission error:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          showToast({
            type: "error",
            title: "Submission Failed",
            message: error.response.data.message,
          });
        } else {
          showToast({
            type: "error",
            title: "Submission Failed",
            message: "Something went wrong. Please try again.",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  if (loading || authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                Submit Candidate Profile
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Submit your candidacy for the upcoming student union elections.
              All information will be reviewed before publication.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-orange-500" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  label="Full Name"
                  value={userProfile?.name || ""}
                  disabled
                  className="bg-gray-50 cursor-not-allowed"
                />

                <Input
                  type="email"
                  label="Email Address"
                  value={userProfile?.email || ""}
                  disabled
                  className="bg-gray-50  cursor-not-allowed"
                />

                <Input
                  type="text"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={userProfile?.phone || formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={errors.phone}
                />

                <Input
                  type="text"
                  label="Student ID"
                  placeholder="Enter your student ID"
                  value={userProfile?.studentId}
                  className={`${
                    userProfile?.studentId
                      ? "bg-gray-50 cursor-not-allowed"
                      : ""
                  } ${errors.studentId ? "border-red-600" : ""}`}
                  disabled={userProfile?.studentId ? true : false}
                />

                <div className="md:col-span-2">
                  <Input
                    type="text"
                    label="Address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    error={errors.address}
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.did || ""}
                    onChange={(e) => handleInputChange("did", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departmentsLoading ? (
                      <option value="">Loading...</option>
                    ) : departmentsError ? (
                      <option value="">Error...</option>
                    ) : (
                      <>
                        {departments?.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  {errors.did && (
                    <p className="mt-1 text-sm text-red-600">{errors.did}</p>
                  )}
                </div>

                <Input
                  type="text"
                  label="Current Semester"
                  placeholder="e.g., 7th Semester"
                  value={userProfile?.semester || formData.semester}
                  onChange={(e) =>
                    handleInputChange("semester", e.target.value)
                  }
                  error={errors.semester}
                />
              </div>
            </div>

            {/* Election Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-orange-500" />
                Election Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  {positionsLoading ? (
                    <>
                      <option value="">Loading...</option>
                    </>
                  ) : positionsError ? (
                    <>
                      <option value="">Error loading positions</option>
                    </>
                  ) : (
                    <select
                      value={formData.position}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Position</option>
                      {positions?.map((position) => (
                        <option key={position.id} value={position.id}>
                          {position.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.position}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isParticipating"
                    checked={formData.isParticipating}
                    onChange={(e) =>
                      handleInputChange("isParticipating", e.target.checked)
                    }
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label
                    htmlFor="isParticipating"
                    className="text-sm text-gray-700"
                  >
                    I am actively participating in the upcoming election
                  </label>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-500" />
                Profile Content
              </h2>

              <div className="space-y-6">
                <MarkdownEditor
                  label="Biography"
                  value={formData.biography}
                  onChange={(value) => handleInputChange("biography", value)}
                  placeholder="Tell us about yourself, your background, and what drives you... (minimum 50 characters)"
                  error={errors.biography}
                  height={250}
                />

                <MarkdownEditor
                  label="Election Manifesto"
                  value={formData.manifesto}
                  onChange={(value) => handleInputChange("manifesto", value)}
                  placeholder="Share your vision, goals, and plans for the position you're running for... (minimum 100 characters)"
                  error={errors.manifesto}
                  height={300}
                />

                <MarkdownEditor
                  label="Experience & Qualifications"
                  value={formData.experience}
                  onChange={(value) => handleInputChange("experience", value)}
                  placeholder="Describe your relevant experience, leadership roles, and qualifications..."
                  height={250}
                />

                <MarkdownEditor
                  label="Achievements & Recognition"
                  value={formData.achievements}
                  onChange={(value) => handleInputChange("achievements", value)}
                  placeholder="List your notable achievements, awards, and recognition..."
                  height={250}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading} disabled={loading}>
                {loading ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </form>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default SubmitCandidatePage;
