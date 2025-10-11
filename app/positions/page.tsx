"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/ui/Loader";
import { Position } from "@/lib/types";

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/positions");

      if (!response.ok) {
        throw new Error("Failed to fetch positions");
      }

      const data = await response.json();
      setPositions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">
              <h3 className="font-medium">Error loading positions</h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              JnUCSU Election Positions
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the various leadership positions available in the
              Jagannath University Central Students&apos; Union. Each position
              plays a vital role in representing and serving the student
              community.
            </p>
          </div>
        </div>

        {/* Positions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {positions.map((position) => (
            <div
              key={position.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {position.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Order: {position.order}
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {position.allocated_slots}{" "}
                      {position.allocated_slots === 1
                        ? "position"
                        : "positions"}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      position.allocated_slots === 1
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {position.allocated_slots === 1 ? "Single" : "Multiple"}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    Available Slots
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {position.allocated_slots}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {position.allocated_slots === 1
                      ? "Only one candidate can be elected"
                      : `Up to ${position.allocated_slots} candidates can be elected`}
                  </div>
                </div>

                {/* Position Description based on name */}
                <div className="text-sm text-gray-600">
                  {getPositionDescription(position.name)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Election Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">
                  {positions.length}
                </div>
                <div className="text-sm text-blue-700">Total Positions</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">
                  {positions.reduce((sum, pos) => sum + pos.allocated_slots, 0)}
                </div>
                <div className="text-sm text-green-700">
                  Total Slots Available
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">
                  {positions.filter((pos) => pos.allocated_slots > 1).length}
                </div>
                <div className="text-sm text-purple-700">
                  Multi-Slot Positions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Helper function to get position descriptions
function getPositionDescription(positionName: string): string {
  const descriptions: Record<string, string> = {
    "Vice President":
      "Assists the President in leading the student union and represents students in major decisions.",
    "General Secretary":
      "Manages daily operations, maintains records, and coordinates between different committees.",
    "Joint General Secretary":
      "Supports the General Secretary and handles additional administrative responsibilities.",
    "Secretary of History and Heritage":
      "Preserves university traditions and organizes heritage-related events.",
    "Secretary of Education and Research":
      "Promotes academic excellence and research activities among students.",
    "Secretary of Common Room and Cafeteria":
      "Manages student common areas and food services.",
    "Secretary of International Affairs":
      "Handles international student programs and cultural exchange activities.",
    "Secretary of Literature, Publications and Culture":
      "Organizes literary events, publications, and cultural programs.",
    "Finance Secretary":
      "Manages union finances, budgets, and financial planning.",
    "Sports Secretary":
      "Organizes sports events, tournaments, and promotes athletic activities.",
    "Student Transport Secretary":
      "Manages student transportation services and related facilities.",
    "Social Service Secretary":
      "Coordinates community service and social welfare programs.",
    "Library and Seminar Secretary":
      "Manages library services and organizes academic seminars.",
    "Executive Member":
      "Supports various union activities and represents specific student groups or departments.",
  };

  return (
    descriptions[positionName] ||
    "Contributes to the overall leadership and management of student union activities."
  );
}
