import { notFound } from "next/navigation";
import {
  generateMetadata as generateSEOMetadata,
  generateStructuredData,
  KEYWORDS,
  combineKeywords,
} from "@/lib/seo";
import { Metadata } from "next";
import { ElectionCandidate } from "@/lib/types/candidate.profile.types";
import CandidateProfileClient from "@/components/candidates/CandidateProfileClient";
import { config } from "@/config";

interface CandidateProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Fetch candidate data from API
async function fetchCandidateData(
  id: string
): Promise<ElectionCandidate | null> {
  try {
    const res = await fetch(`${config.clientUrl}/api/candidate/${id}`, {
      cache: "no-store", // Ensure fresh data
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching candidate data:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: CandidateProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const candidateData = await fetchCandidateData(id);

  if (!candidateData) {
    return generateSEOMetadata({
      title: "Candidate Not Found",
      description: "The requested candidate profile could not be found.",
      noIndex: true,
    });
  }

  const candidateKeywords = [
    candidateData.name,
    candidateData.title,
    candidateData.department,
    `${candidateData.name} JnUCSU`,
    `${candidateData.title.replace(" - JnUCSU", "")} candidate`,
    ...candidateData.tags,
  ];

  return generateSEOMetadata({
    title: `${candidateData.name} - ${candidateData.title}`,
    description: `Meet ${
      candidateData.name
    }, candidate for ${candidateData.title.replace(
      " - JnUCSU",
      ""
    )} at Jagannath University Central Students' Union. ${
      candidateData.description
    } Vote and engage with their profile to learn more about their vision and plans.`,
    keywords: combineKeywords(
      KEYWORDS.general,
      KEYWORDS.candidates,
      KEYWORDS.leadership,
      candidateKeywords
    ),
    image: candidateData.avatar,
    type: "profile",
    url: `/candidates/${id}`,
  });
}

export default async function CandidateProfilePage({
  params,
}: CandidateProfilePageProps) {
  const { id } = await params;
  const candidateData = await fetchCandidateData(id);

  if (!candidateData) {
    notFound();
  }

  // Generate structured data for the candidate
  const candidateStructuredData = generateStructuredData({
    type: "Person",
    data: {
      name: candidateData.name,
      description: candidateData.description,
      image: candidateData.avatar,
      url: `/candidates/${candidateData.id}`,
      jobTitle: candidateData.title,
      worksFor: {
        "@type": "Organization",
        name: "Jagannath University",
      },
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Jagannath University",
        department: candidateData.department,
      },
      seeks: {
        "@type": "Role",
        roleName: candidateData.title.replace(" - JnUCSU", ""),
        description: candidateData.description,
      },
    },
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(candidateStructuredData),
        }}
      />

      <CandidateProfileClient leader={candidateData} />
    </>
  );
}
