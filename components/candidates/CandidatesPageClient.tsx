"use client";

import { useState, useMemo, useEffect } from "react";
import CandidateCard from "@/components/home/CandidateCard";
import { Search } from "lucide-react";
import { useServerData } from "@/hooks/use-server-data";
import Fuse from "fuse.js";
import { Candidate } from "@/app/api/candidate/route";

interface CandidatesPageClientProps {
  candidates: Candidate[];
}

export default function CandidatesPageClient({
  candidates,
}: CandidatesPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [visibleCount, setVisibleCount] = useState(20);
  const { departments } = useServerData();

  // Debounce search term to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Initialize Fuse.js for fuzzy searching
  const fuse = useMemo(() => {
    const fuseOptions = {
      // Define which fields to search with their importance weights
      keys: [
        { name: "name", weight: 0.4 }, // Name is most important
        { name: "title", weight: 0.3 }, // Position title is second most important
        { name: "department", weight: 0.2 }, // Department is third
        { name: "description", weight: 0.1 }, // Description is least important
      ],
      threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
      distance: 100, // Maximum distance for character matching
      minMatchCharLength: 1, // Minimum characters needed to trigger search
      includeScore: true, // Include relevance scores
      ignoreLocation: true, // Don't care where in the string the match occurs
      ignoreFieldNorm: true, // Don't normalize scores by field length
    };
    return new Fuse(candidates, fuseOptions);
  }, [candidates]);

  // Filter and sort candidates with fuzzy search
  const filteredAndSortedCandidates = useMemo(() => {
    let filtered: Candidate[];

    // Apply fuzzy search if there's a search term
    if (debouncedSearchTerm.trim()) {
      const searchResults = fuse.search(debouncedSearchTerm);
      filtered = searchResults.map((result) => result.item);
    } else {
      filtered = [...candidates];
    }

    // Apply department filter
    if (selectedDepartment) {
      filtered = filtered.filter(
        (candidate) => candidate.department === selectedDepartment
      );
    }

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "department":
          return (a.department || "").localeCompare(b.department || "");
        case "position":
          return (a.position || "").localeCompare(b.position || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [candidates, debouncedSearchTerm, selectedDepartment, sortBy, fuse]);

  // CandidateItem now has all the fields needed for CandidateCard

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const visibleCandidates = filteredAndSortedCandidates.slice(0, visibleCount);
  const hasMoreCandidates = filteredAndSortedCandidates.length > visibleCount;

  return (
    <>
      {/* Filters and Search */}
      <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                searchTerm !== debouncedSearchTerm
                  ? "text-orange-500 animate-pulse"
                  : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search candidates by name, position, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${
                searchTerm !== debouncedSearchTerm
                  ? "border-orange-300 bg-orange-50"
                  : "border-gray-300 bg-white"
              }`}
            />
            {searchTerm !== debouncedSearchTerm && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="department">Sort by Department</option>
            <option value="position">Sort by Position</option>
          </select>
        </div>

        {/* Results count */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {visibleCandidates.length} of{" "}
            {filteredAndSortedCandidates.length} candidates
            {candidates.length !== filteredAndSortedCandidates.length && (
              <span className="ml-2 text-gray-500">
                (filtered from {candidates.length} total)
              </span>
            )}
            {debouncedSearchTerm && (
              <span className="ml-2 text-orange-600 font-medium">
                • Smart search active
              </span>
            )}
          </div>
          {(searchTerm || selectedDepartment) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setDebouncedSearchTerm("");
                setSelectedDepartment("");
                setSortBy("name");
              }}
              className="text-sm text-orange-500 hover:text-orange-600 underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Search suggestions */}
        {!searchTerm && !selectedDepartment && (
          <div className="mt-3 text-xs text-gray-500">
            💡 Try searching with partial matches like &ldquo;pres&rdquo; for
            President, &ldquo;compu&rdquo; for Computer Science, or even with
            typos!
          </div>
        )}
      </div>

      {/* Candidates Grid */}
      <div
        className="
        grid gap-6
        grid-cols-1
        lg:grid-cols-2
      
      "
      >
        {visibleCandidates.length > 0 ? (
          visibleCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} leader={candidate} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No candidates found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setDebouncedSearchTerm("");
                setSelectedDepartment("");
                setSortBy("name");
              }}
              className="mt-4 text-orange-500 hover:text-orange-600 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMoreCandidates && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
          >
            Load More Candidates (
            {filteredAndSortedCandidates.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </>
  );
}
