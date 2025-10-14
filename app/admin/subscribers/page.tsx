"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/ToastProvider";
import AdminSubscribersSkeleton from "@/components/admin/AdminSubscribersSkeleton";
import {
  Mail,
  Download,
  Trash2,
  Search,
  Filter,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  status: "published" | "draft" | "archived";
  date_created: string;
}

export default function AdminSubscribersPage() {
  const router = useRouter();
  const { loading: isLoading, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch subscribers
  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subscribers");

      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
      } else {
        showToast({
          type: "error",
          title: "Failed to Load",
          message: "Could not fetch subscribers data",
        });
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      showToast({
        type: "error",
        title: "Network Error",
        message: "Failed to connect to server",
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscribers();
    }
  }, [isAuthenticated, fetchSubscribers]);

  // Filter subscribers
  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch = subscriber.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || subscriber.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export subscribers to CSV
  const exportSubscribers = () => {
    const csvData = [
      ["Email", "Status", "Date Created"],
      ...filteredSubscribers.map((sub) => [
        sub.email,
        sub.status,
        new Date(sub.date_created).toLocaleDateString(),
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showToast({
      type: "success",
      title: "Export Complete",
      message: `${filteredSubscribers.length} subscribers exported`,
    });
  };

  // Delete selected subscribers
  const deleteSelected = async () => {
    if (selectedSubscribers.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedSubscribers.length} subscriber(s)?`
      )
    ) {
      return;
    }

    try {
      // Note: This would need to be implemented in the API route
      // For now, just show a message
      showToast({
        type: "info",
        title: "Feature Coming Soon",
        message: "Bulk delete functionality will be available soon",
      });
    } catch {
      showToast({
        type: "error",
        title: "Delete Failed",
        message: "Could not delete subscribers",
      });
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <AdminSubscribersSkeleton />;
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const stats = {
    total: subscribers.length,
    published: subscribers.filter((s) => s.status === "published").length,
    thisMonth: subscribers.filter(
      (s) => new Date(s.date_created).getMonth() === new Date().getMonth()
    ).length,
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Newsletter Subscribers
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your newsletter subscribers and track engagement
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-full">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Subscribers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-500 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Subscribers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.published}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-orange-500 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.thisMonth}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none min-w-[250px]"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={exportSubscribers}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>

                {selectedSubscribers.length > 0 && (
                  <button
                    onClick={deleteSelected}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedSubscribers.length})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse mx-auto opacity-60"></div>
                <p className="mt-2 text-gray-600">Loading subscribers...</p>
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No subscribers found
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all"
                    ? "No subscribers match your current filters."
                    : "No subscribers have signed up yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubscribers(
                                filteredSubscribers.map((s) => s.id)
                              );
                            } else {
                              setSelectedSubscribers([]);
                            }
                          }}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Subscribed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.includes(
                              subscriber.id
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubscribers([
                                  ...selectedSubscribers,
                                  subscriber.id,
                                ]);
                              } else {
                                setSelectedSubscribers(
                                  selectedSubscribers.filter(
                                    (id) => id !== subscriber.id
                                  )
                                );
                              }
                            }}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {subscriber.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              {
                                published: "bg-green-100 text-green-800",
                                draft: "bg-yellow-100 text-yellow-800",
                                archived: "bg-gray-100 text-gray-800",
                              }[subscriber.status]
                            }`}
                          >
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(
                            subscriber.date_created
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Results info */}
          {!loading && filteredSubscribers.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Showing {filteredSubscribers.length} of {subscribers.length}{" "}
              subscribers
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
