"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  User,
  GraduationCap,
  FileText,
  ChevronRight,
  Users,
  Filter,
} from "lucide-react";
import { Panel, PanelMember } from "@/lib/types/panel";

interface PanelDetailsClientProps {
  panelData: Panel;
}

export default function PanelDetailsClient({
  panelData,
}: PanelDetailsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique positions for filtering
  const positions = useMemo(() => {
    const positionSet = new Set<string>();
    panelData.members.forEach((member) => {
      if (member.positionName) {
        positionSet.add(member.positionName);
      }
    });
    return Array.from(positionSet);
  }, [panelData.members]);

  // Filter members based on search and position
  const filteredMembers = useMemo(() => {
    let filtered = panelData.members;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (member) =>
          member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.positionName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          member.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply position filter
    if (selectedPosition) {
      filtered = filtered.filter(
        (member) => member.positionName === selectedPosition
      );
    }

    return filtered;
  }, [panelData.members, searchTerm, selectedPosition]);

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search members by name, department, position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Position Filter */}
          <div className="sm:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Positions</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Toggle - Hidden on mobile, show on large devices */}
          <div className="hidden lg:flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === "grid"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === "list"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredMembers.length} of {panelData.members.length}{" "}
            members
          </span>
          {selectedPosition && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
              Position: {selectedPosition}
            </span>
          )}
        </div>
      </div>

      {/* Members Display */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Members Found
          </h3>
          <p className="text-gray-600">
            No members match your current search criteria. Try adjusting your
            filters.
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "lg:space-y-4 grid grid-cols-1 md:grid-cols-2 lg:block gap-6"
          }
        >
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}

// Member Card Component
interface MemberCardProps {
  member: PanelMember;
  viewMode: "grid" | "list";
}

function MemberCard({ member, viewMode }: MemberCardProps) {
  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-100">
                <Image
                  src={member.image || "/images/default-avatar.svg"}
                  alt={member.name || "Member"}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/default-avatar.svg";
                  }}
                />
              </div>
            </div>

            {/* Member Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {member.name || "Unknown Member"}
                  </h3>
                  <p className="text-orange-600 font-medium text-sm">
                    {member.positionName}
                  </p>
                </div>
                <Link
                  href={`/candidates/${member.id}`}
                  className="flex items-center space-x-1 text-orange-600 hover:text-orange-800 text-sm font-medium"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-2 space-y-1 text-sm text-gray-600">
                {member.studentId && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>ID: {member.studentId}</span>
                  </div>
                )}
                {member.department && (
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{member.department}</span>
                  </div>
                )}
              </div>

              {member.biography && (
                <p className="mt-3 text-gray-700 text-sm line-clamp-2">
                  {member.biography.slice(0, 100)}...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden h-full">
      <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col items-center text-center flex-grow">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-100">
              <Image
                src={member.image || "/images/default-avatar.svg"}
                alt={member.name || "Member"}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default-avatar.svg";
                }}
              />
            </div>
          </div>

          {/* Member Info */}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {member.name || "Unknown Member"}
            </h3>
            <p className="text-orange-600 font-medium text-sm mb-3">
              {member.positionName}
            </p>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {member.studentId && (
                <div className="flex items-center justify-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>ID: {member.studentId}</span>
                </div>
              )}
              {member.department && (
                <div className="flex items-center justify-center space-x-2">
                  <GraduationCap className="w-4 h-4" />
                  <span className="truncate">{member.department}</span>
                </div>
              )}
            </div>

            {member.biography && (
              <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                {member.biography.slice(0, 120)}...
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-4 space-y-2 w-full">
            <Link
              href={`/candidates/${member.id}`}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>View Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
