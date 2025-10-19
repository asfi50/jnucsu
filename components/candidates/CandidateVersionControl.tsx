import { useState, useEffect } from "react";
import { Clock, CheckCircle, Edit, History, Send } from "lucide-react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import useAxios from "@/hooks/use-axios";

interface CandidateVersion {
  id: string;
  version_number: number;
  biography: string;
  manifesto: string;
  experience: string;
  achievements: string;
  position: string;
  panel: string;
  approved_at: string;
  approved_by: string;
  status: string;
}

interface CurrentDraft {
  id: string;
  biography: string;
  manifesto: string;
  experience: string;
  achievements: string;
  position: string;
  panel: string;
  status: string;
  updated_at: string;
  isParticipating: boolean;
}

interface VersionData {
  versions: CandidateVersion[];
  currentDraft: CurrentDraft | null;
}

interface CandidateVersionControlProps {
  profileId: string;
  onRefresh?: () => void;
}

const CandidateVersionControl = ({
  profileId,
  onRefresh,
}: CandidateVersionControlProps) => {
  const [versionData, setVersionData] = useState<VersionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { showToast } = useToast();
  const axios = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/candidate/history?profileId=${profileId}`
        );
        setVersionData(response.data);
      } catch (error) {
        console.error("Error fetching version data:", error);
        showToast({ type: "error", title: "Failed to load version history" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profileId, axios, showToast]);

  const fetchVersionData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/candidate/history?profileId=${profileId}`
      );
      setVersionData(response.data);
    } catch (error) {
      console.error("Error fetching version data:", error);
      showToast({ type: "error", title: "Failed to load version history" });
    } finally {
      setLoading(false);
    }
  };

  const submitForReview = async () => {
    if (!versionData?.currentDraft) return;

    try {
      setSubmitting(true);
      await axios.post("/api/candidate/versions", {
        action: "submit_for_review",
      });

      showToast({
        type: "success",
        title: "Profile submitted for review successfully",
      });
      fetchVersionData();
      onRefresh?.();
    } catch (error) {
      console.error("Error submitting for review:", error);
      showToast({ type: "error", title: "Failed to submit for review" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!versionData) return null;

  const { versions, currentDraft } = versionData;
  const latestVersion = versions[0];
  const hasDraft = currentDraft && currentDraft.status === "draft";
  const isPending = currentDraft && currentDraft.status === "pending";

  return (
    <div className="space-y-4 my-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <History className="w-5 h-5" />
              Version Control Dashboard
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="self-start sm:self-auto"
            >
              {showHistory ? "Hide Table" : "Show Table"}
            </Button>
          </div>
        </div>

        {/* Quick Status Summary (Always Visible) */}
        {!showHistory && (
          <div className="p-4">
            <div className="space-y-3">
              {/* Latest Version Summary */}
              {latestVersion && (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Current: v{latestVersion.version_number} (
                      {latestVersion.position})
                    </span>
                  </div>
                  <span className="text-xs text-green-600">
                    {new Date(latestVersion.approved_at).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Draft Summary */}
              {hasDraft && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Draft changes available
                    </span>
                  </div>
                  <Button
                    onClick={submitForReview}
                    disabled={submitting}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              )}

              {/* Pending Summary */}
              {isPending && (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Under review
                    </span>
                  </div>
                  <span className="text-xs text-blue-600">
                    Submitted:{" "}
                    {new Date(currentDraft.updated_at).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* No Data State */}
              {!latestVersion && !currentDraft && (
                <div className="text-center py-6">
                  <History className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    No candidate profile versions found.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Table View (Shown when showHistory is true) */}
        {showHistory && (
          <div className="p-4">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Version History
              </h4>
              <p className="text-sm text-gray-600">
                All versions of your candidate profile including drafts and
                approvals
              </p>
            </div>

            {/* Mobile Cards View */}
            <div className="space-y-3 sm:hidden">
              {/* Current Draft/Pending */}
              {(hasDraft || isPending) && (
                <div
                  className={`border rounded-lg p-4 ${
                    hasDraft
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {hasDraft ? (
                        <Edit className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-600" />
                      )}
                      <span
                        className={`font-medium ${
                          hasDraft ? "text-yellow-800" : "text-blue-800"
                        }`}
                      >
                        {hasDraft ? "Draft Changes" : "Under Review"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(currentDraft.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-medium">
                        {currentDraft.position}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={
                          hasDraft ? "text-yellow-700" : "text-blue-700"
                        }
                      >
                        {hasDraft ? "Needs submission" : "Awaiting approval"}
                      </span>
                    </div>
                  </div>

                  {hasDraft && (
                    <Button
                      onClick={submitForReview}
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2"
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? "Submitting..." : "Submit for Review"}
                    </Button>
                  )}
                </div>
              )}

              {/* Approved Versions */}
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className={`border rounded-lg p-4 ${
                    index === 0 ? "bg-green-50 border-green-200" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                          index === 0
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {versions.length - index}
                      </span>
                      <span className="font-medium text-gray-900">
                        Version {version.version_number}
                        {index === 0 && (
                          <span className="ml-2 text-xs text-green-600">
                            (Current)
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(version.approved_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-medium">{version.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approved by:</span>
                      <span className="text-gray-700">
                        {version.approved_by}
                      </span>
                    </div>
                    {version.panel && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Panel:</span>
                        <span className="text-gray-700">{version.panel}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action/Approved By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Draft Row */}
                  {hasDraft && (
                    <tr className="bg-yellow-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Edit className="w-3 h-3 mr-1" />
                          Draft
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        Unsaved
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {currentDraft.position}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(currentDraft.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Button
                          onClick={submitForReview}
                          disabled={submitting}
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          {submitting ? "Submitting..." : "Submit"}
                        </Button>
                      </td>
                    </tr>
                  )}

                  {/* Pending Review Row */}
                  {isPending && (
                    <tr className="bg-blue-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Under Review
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        Pending
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {currentDraft.position}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(currentDraft.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">
                        Awaiting approval
                      </td>
                    </tr>
                  )}

                  {/* Approved Versions */}
                  {versions.map((version, index) => (
                    <tr
                      key={version.id}
                      className={
                        index === 0 ? "bg-green-50" : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            index === 0
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {index === 0 ? "Current" : "Approved"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        v{version.version_number}
                        {index === 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Latest
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {version.position}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(version.approved_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        By {version.approved_by}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* No Data State for Table */}
            {!latestVersion && !currentDraft && (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">
                  No candidate profile versions found.
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Create your first profile to get started.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateVersionControl;
