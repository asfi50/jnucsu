import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LeaderCard from '@/components/home/LeaderCard';
import { dummyLeaders } from '@/lib/data';
import { generateMetadata, generateStructuredData, KEYWORDS, combineKeywords } from '@/lib/seo';
import { Users, Search } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: "Student Candidates - Meet Our Leaders",
  description: "Explore profiles of student candidates running for positions at Jagannath University Central Students' Union. Vote for your favorite leaders, read their manifestos, and engage with the campus democratic process.",
  keywords: combineKeywords(
    KEYWORDS.general,
    KEYWORDS.candidates,
    KEYWORDS.leadership,
    ['candidate profiles', 'student election', 'university politics', 'candidate manifestos', 'student representatives']
  ),
  type: 'website',
  url: '/candidates',
});

export default function CandidatesPage() {
  // Generate structured data for the candidates collection
  const candidatesStructuredData = generateStructuredData({
    type: 'WebSite',
    data: {
      name: 'JnUCSU Student Candidates',
      description: 'Comprehensive profiles of student candidates running for election at Jagannath University Central Students\' Union',
      url: '/candidates',
      mainEntity: dummyLeaders.map(leader => ({
        '@type': 'Person',
        name: leader.name,
        jobTitle: leader.title,
        description: leader.description,
        url: `/candidates/${leader.id}`,
        image: leader.avatar,
      })),
    },
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(candidatesStructuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{/* Page Header */}
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Student Candidates</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Meet the student candidates running for positions at Jagannath University. 
            Vote for your favorites and engage with their profiles.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search candidates..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
              <option value="">All Departments</option>
              <option value="cse">Computer Science & Engineering</option>
              <option value="english">English</option>
              <option value="political">Political Science</option>
              <option value="arts">Fine Arts</option>
              <option value="pe">Physical Education</option>
            </select>

            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
              <option value="votes">Sort by Votes</option>
              <option value="name">Sort by Name</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="space-y-4">
          {dummyLeaders.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors">
            Load More Candidates
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
    </>
  );
}