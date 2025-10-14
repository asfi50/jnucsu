import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CallToActionBanner from "@/components/ui/CallToActionBanner";
import CandidatesPageClient from "@/components/candidates/CandidatesPageClient";
import { CandidateItem } from "@/app/api/candidate/format";
import {
  generateMetadata,
  generateStructuredData,
  KEYWORDS,
  combineKeywords,
} from "@/lib/seo";
import { Users } from "lucide-react";
import { Metadata } from "next";
import { config } from "@/config";

export const metadata: Metadata = generateMetadata({
  title: "Student Candidates - Meet Our Leaders",
  description:
    "Explore profiles of student candidates running for positions at Jagannath University Central Students' Union. Vote for your favorite leaders, read their manifestos, and engage with the campus democratic process.",
  keywords: combineKeywords(
    KEYWORDS.general,
    KEYWORDS.candidates,
    KEYWORDS.leadership,
    [
      "candidate profiles",
      "student election",
      "university politics",
      "candidate manifestos",
      "student representatives",
    ]
  ),
  type: "website",
  url: "/candidates",
});

// Server-side data fetching
async function fetchCandidates(): Promise<CandidateItem[]> {
  try {
    const response = await fetch(`${config.clientUrl}/api/candidate`, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      console.error("Failed to fetch candidates:", response.statusText);
      return [];
    }

    const candidates = await response.json();
    return candidates;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
}

export default async function CandidatesPage() {
  const candidates = await fetchCandidates();

  // If no candidates are found, show a message
  if (!candidates || candidates.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                Student Candidates
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Meet the student candidates running for positions at Jagannath
              University.
            </p>
          </div>

          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Candidates Available
            </h3>
            <p className="text-gray-600 mb-6">
              There are currently no approved candidates participating in the
              election. Please check back later or contact the election
              committee.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate structured data for the candidates collection
  const candidatesStructuredData = generateStructuredData({
    type: "WebSite",
    data: {
      name: "JnUCSU Student Candidates",
      description:
        "Comprehensive profiles of student candidates running for election at Jagannath University Central Students' Union",
      url: "/candidates",
      mainEntity: candidates.map((candidate) => ({
        "@type": "Person",
        name: candidate.name || "Unknown",
        jobTitle: candidate.title || "Candidate",
        description: candidate.description || "Student candidate",
        url: `/candidates/${candidate.id}`,
        image: candidate.avatar || "",
      })),
    },
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(candidatesStructuredData),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Call to Action Banner for Candidates */}
          <CallToActionBanner type="candidate" />

          {/* Page Header */}
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                Student Candidates
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Meet the student candidates running for positions at Jagannath
              University. Vote for your favorites and engage with their
              profiles.
            </p>
          </div>

          {/* Candidates Client Component */}
          <CandidatesPageClient candidates={candidates} />
        </div>

        <Footer />
      </div>
    </>
  );
}
