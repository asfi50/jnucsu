import { notFound } from 'next/navigation';
import { dummyLeaders } from '@/lib/data';
import { generateMetadata as generateSEOMetadata, generateStructuredData, KEYWORDS, combineKeywords } from '@/lib/seo';
import { Metadata } from 'next';
import CandidateProfileClient from '@/components/candidates/CandidateProfileClient';

interface CandidateProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: CandidateProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const leader = dummyLeaders.find(l => l.id === id);

  if (!leader) {
    return generateSEOMetadata({
      title: "Candidate Not Found",
      description: "The requested candidate profile could not be found.",
      noIndex: true,
    });
  }

  const candidateKeywords = [
    leader.name,
    leader.title,
    leader.department,
    `${leader.name} JnUCSU`,
    `${leader.title.replace(' - JnUCSU', '')} candidate`,
    ...leader.tags,
  ];

  return generateSEOMetadata({
    title: `${leader.name} - ${leader.title}`,
    description: `Meet ${leader.name}, candidate for ${leader.title.replace(' - JnUCSU', '')} at Jagannath University Central Students' Union. ${leader.description} Vote and engage with their profile to learn more about their vision and plans.`,
    keywords: combineKeywords(
      KEYWORDS.general,
      KEYWORDS.candidates,
      KEYWORDS.leadership,
      candidateKeywords
    ),
    image: leader.avatar,
    type: 'profile',
    url: `/candidates/${id}`,
  });
}

export default async function CandidateProfilePage({ params }: CandidateProfilePageProps) {
  const { id } = await params;
  const leader = dummyLeaders.find(l => l.id === id);

  if (!leader) {
    notFound();
  }

  // Generate structured data for the candidate
  const candidateStructuredData = generateStructuredData({
    type: 'Person',
    data: {
      name: leader.name,
      description: leader.description,
      image: leader.avatar,
      url: `/candidates/${leader.id}`,
      jobTitle: leader.title,
      worksFor: {
        '@type': 'Organization',
        name: 'Jagannath University',
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Jagannath University',
        department: leader.department,
      },
      seeks: {
        '@type': 'Role',
        roleName: leader.title.replace(' - JnUCSU', ''),
        description: leader.description,
      },
    },
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(candidateStructuredData) }}
      />
      
      <CandidateProfileClient leader={leader} />
    </>
  );
}