"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  FileText,
  Award,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuth } from "@/context/auth-context";
import useAxios from "@/hooks/use-axios";
import { useData } from "@/context/data-context";
import SubmitCandidateSkeleton from "@/components/shared/SubmitCandidateSkeleton";

export interface CandidateFormData {
  position: string;
  panel?: string;
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
  const [formData, setFormData] = useState<CandidateFormData>({
    position: "",
    panel: "",
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
  const [savingDraft, setSavingDraft] = useState(false);
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
    panels,
    panelsLoading,
    panelsError,
    candidateProfile,
    candidateProfileLoading,
  } = useData();

  // Monitor positions data
  useEffect(() => {
    // Positions are loaded and ready for use
  }, [positions, positionsLoading, positionsError]);

  // Monitor formData changes for position
  useEffect(() => {
    // Position selection is updated
  }, [formData.position, positions]);

  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        phone: prev.phone || userProfile.phone || "",
        address:
          (!prev.address || prev.address.trim() === "") && userProfile.address
            ? userProfile.address
            : prev.address || "",
        studentId: prev.studentId || userProfile.studentId || "",
        did: prev.did || userProfile.did || "",
        semester: prev.semester || userProfile.semester || "",
      }));
    }
  }, [userProfile]);

  // Pre-populate form with existing candidate profile data
  useEffect(() => {
    if (candidateProfile && !candidateProfileLoading) {
      // Find position ID from position name
      let positionId = "";
      if (positions && positions.length > 0) {
        const foundPosition = positions.find(
          (p) => p.name === candidateProfile.position
        );
        if (foundPosition) {
          positionId = foundPosition.id;
        }
      }

      // Find panel ID from panel name
      let panelId = "";
      if (panels && panels.length > 0 && candidateProfile.panel) {
        const foundPanel = panels.find(
          (p) => p.name === candidateProfile.panel
        );
        if (foundPanel) {
          panelId = foundPanel.id;
        }
      }

      setFormData((prev) => ({
        ...prev,
        position: positionId,
        panel: panelId,
        biography: candidateProfile.biography || "",
        manifesto: candidateProfile.manifesto || "",
        experience: candidateProfile.experience || "",
        achievements: candidateProfile.achievements || "",
        phone: candidateProfile.phone || prev.phone,
        address: candidateProfile.address || prev.address,
        studentId: candidateProfile.studentId || prev.studentId,
        isParticipating: candidateProfile.isParticipating,
      }));

      setIsApplied(true); // Mark as editing existing profile
    }
  }, [candidateProfile, candidateProfileLoading, positions, panels]);

  // Re-apply form data when positions load (in case API was called before positions loaded)
  useEffect(() => {
    if (
      !positionsLoading &&
      positions &&
      positions.length > 0 &&
      formData.position
    ) {
      const foundPosition = positions.find((p) => p.id === formData.position);
      const foundByName = positions.find((p) => p.name === formData.position);

      if (foundPosition) {
        // Position is already correct ID
      } else if (foundByName) {
        // Convert position name to ID
        setFormData((prev) => ({
          ...prev,
          position: foundByName.id,
        }));
      }
    }
  }, [positionsLoading, positions, formData.position]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.biography || formData.biography.trim() === "")
      newErrors.biography = "Biography is required";
    if (!formData.manifesto || formData.manifesto.trim() === "")
      newErrors.manifesto = "Manifesto is required";
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

    setLoading(true);

    await axios
      .post("/api/candidate/application", {
        ...formData,
        isApplied,
      })
      .then((response) => {
        const responseData = response.data;
        const isNewDraft =
          responseData.result?.status === "draft" &&
          responseData.message?.includes("saved successfully");

        showToast({
          type: "success",
          title: isNewDraft ? "Candidate Profile Created!" : "Profile Updated!",
          message: isNewDraft
            ? "Your candidate profile has been created as a draft. You can now view and manage it from your profile page."
            : "Your candidate profile has been updated. You can submit it for review when ready.",
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

  const saveDraft = async () => {
    setSavingDraft(true);

    try {
      await axios.post("/api/candidate/versions", {
        action: "save_draft",
        ...formData,
      });

      showToast({
        type: "success",
        title: "Draft Saved!",
        message: "Your changes have been saved as a draft.",
      });
    } catch (error) {
      console.error("Save draft error:", error);
      showToast({
        type: "error",
        title: "Save Failed",
        message: "Failed to save draft. Please try again.",
      });
    } finally {
      setSavingDraft(false);
    }
  };

  const handleInputChange = (
    field: keyof CandidateFormData,
    value: string | boolean
  ) => {
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

  if (loading || authLoading || candidateProfileLoading) {
    return <SubmitCandidateSkeleton />;
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
                {candidateProfile
                  ? "Update Candidate Profile"
                  : "Submit Candidate Profile"}
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl">
              {candidateProfile
                ? "Update your candidate profile information. Any changes will reset your profile to draft status."
                : "Submit your candidacy for the upcoming student union elections. All information will be reviewed before publication."}
            </p>
          </div>

          {/* Status Notification */}
          {candidateProfile && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                candidateProfile.status === "approved"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : candidateProfile.status === "pending"
                  ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                  : candidateProfile.status === "rejected"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {candidateProfile.status === "approved" && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {candidateProfile.status === "pending" && (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                  {candidateProfile.status === "rejected" && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  {candidateProfile.status === "draft" && (
                    <Edit className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">
                    Existing Candidate Profile Found
                  </h3>
                  <div className="mt-1 text-sm">
                    <p>
                      Status:{" "}
                      <span className="font-medium">
                        {candidateProfile.status === "approved" &&
                          "Approved & Published"}
                        {candidateProfile.status === "pending" &&
                          "Under Review"}
                        {candidateProfile.status === "rejected" &&
                          "Rejected - Needs Revision"}
                        {candidateProfile.status === "draft" &&
                          "Draft - Not Submitted"}
                      </span>
                    </p>
                    <p className="mt-1">
                      You are currently{" "}
                      {candidateProfile.status === "draft"
                        ? "editing"
                        : "updating"}{" "}
                      your candidate profile for the position of{" "}
                      <strong>{candidateProfile.position}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  readOnly
                  className="bg-gray-50 cursor-not-allowed"
                />

                <Input
                  type="email"
                  label="Email Address"
                  value={userProfile?.email || ""}
                  disabled
                  readOnly
                  className="bg-gray-50  cursor-not-allowed"
                />

                <Input
                  type="text"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={userProfile?.phone || formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={errors.phone}
                />

                <Input
                  type="text"
                  label="Student ID"
                  placeholder="Enter your student ID"
                  value={userProfile?.studentId || formData.studentId || ""}
                  onChange={(e) =>
                    handleInputChange("studentId", e.target.value)
                  }
                  className={`${
                    userProfile?.studentId
                      ? "bg-gray-50 cursor-not-allowed"
                      : ""
                  } ${errors.studentId ? "border-red-600" : ""}`}
                  disabled={userProfile?.studentId ? true : false}
                  error={errors.studentId}
                />

                <div className="md:col-span-2">
                  <Input
                    type="text"
                    label="Address"
                    placeholder="Enter your complete address"
                    value={formData.address || ""}
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
                    value={formData.did || userProfile?.did || ""}
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
                  value={userProfile?.semester || formData.semester || ""}
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
                  <select
                    value={formData.position || ""}
                    onChange={(e) => {
                      handleInputChange("position", e.target.value);
                    }}
                    disabled={positionsLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">
                      {positionsLoading
                        ? "Loading..."
                        : positionsError
                        ? "Error loading positions"
                        : "Select Position"}
                    </option>
                    {!positionsLoading &&
                      !positionsError &&
                      positions?.map((position) => (
                        <option key={position.id} value={position.id}>
                          {position.name}
                        </option>
                      ))}
                  </select>

                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.position}
                    </p>
                  )}
                </div>

                {/* Panel Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Panel (Optional)
                  </label>
                  <select
                    value={formData.panel || ""}
                    onChange={(e) => handleInputChange("panel", e.target.value)}
                    disabled={panelsLoading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">
                      {panelsLoading
                        ? "Loading panels..."
                        : panelsError
                        ? "Error loading panels"
                        : "Select Panel (Optional)"}
                    </option>
                    {!panelsLoading &&
                      !panelsError &&
                      panels?.map((panel) => (
                        <option key={panel.id} value={panel.id}>
                          {panel.name}
                        </option>
                      ))}
                  </select>

                  {errors.panel && (
                    <p className="mt-1 text-sm text-red-600">{errors.panel}</p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isParticipating"
                    checked={formData.isParticipating || false}
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
                  value={formData.biography || ""}
                  onChange={(value) => handleInputChange("biography", value)}
                  placeholder="Tell us about yourself, your background, and what drives you..."
                  error={errors.biography}
                  height={250}
                />

                <MarkdownEditor
                  label="Election Manifesto"
                  value={formData.manifesto || ""}
                  onChange={(value) => handleInputChange("manifesto", value)}
                  placeholder="Share your vision, goals, and plans for the position you're running for..."
                  error={errors.manifesto}
                  height={300}
                />

                <MarkdownEditor
                  label="Experience & Qualifications"
                  value={formData.experience || ""}
                  onChange={(value) => handleInputChange("experience", value)}
                  placeholder="Describe your relevant experience, leadership roles, and qualifications..."
                  height={250}
                />

                <MarkdownEditor
                  label="Achievements & Recognition"
                  value={formData.achievements || ""}
                  onChange={(value) => handleInputChange("achievements", value)}
                  placeholder="List your notable achievements, awards, and recognition..."
                  height={250}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading || savingDraft}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={saveDraft}
                loading={savingDraft}
                disabled={loading || savingDraft}
              >
                {savingDraft ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading || savingDraft}
              >
                {loading ? "Saving..." : "Save Changes"}
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
