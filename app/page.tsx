import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrendingCandidates from "@/components/home/TrendingCandidates";
import CompactCandidateCard from "@/components/home/CompactCandidateCard";
import NewCandidates from "@/components/home/NewCandidates";
import BlogCard from "@/components/home/BlogCard";
import { dummyLeaders, dummyBlogPosts } from "@/lib/data";
import { generateMetadata, KEYWORDS, combineKeywords } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Home - Student Leadership Platform",
  description: "Discover trending student leaders, explore candidate profiles, and read the latest articles from Jagannath University Central Students' Union. Join our democratic community and make your voice heard.",
  keywords: combineKeywords(KEYWORDS.general, KEYWORDS.candidates, KEYWORDS.leadership, ["trending candidates", "student democracy", "university community", "student engagement"]),
  type: "website",
  url: "/",
});

export default function Home() {
  // Sort candidates by votes for trending (top 5)
  const trendingCandidates = [...dummyLeaders].sort((a, b) => b.votes - a.votes).slice(0, 5);

  // Sort candidates by votes for top candidates section (top 6, excluding trending)
  const topCandidates = [...dummyLeaders].sort((a, b) => b.votes - a.votes).slice(5, 11);

  // Sort candidates by creation date for new candidates (most recent 4)
  const newCandidates = [...dummyLeaders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  const featuredBlog = dummyBlogPosts[0];
  const recentBlogs = dummyBlogPosts.slice(1, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Trending Candidates Section */}
            <TrendingCandidates candidates={trendingCandidates} />

            {/* Top Candidates Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Top Candidates</h2>
                <Link href="/candidates" className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 transition-colors group">
                  <span>View all</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topCandidates.map((candidate) => (
                  <CompactCandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </section>

            {/* New Candidates Section */}
            <NewCandidates candidates={newCandidates} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Featured Blog */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Featured Article</h2>
                <Link href="/blog" className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 transition-colors group">
                  <span>View blog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <BlogCard post={featuredBlog} featured />
            </section>

            {/* Recent Articles */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Articles</h3>
              <div className="space-y-4">
                {recentBlogs.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Involved</h3>
              <div className="space-y-3">
                <Link href="/candidates/add" className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 px-4 rounded-lg transition-colors">
                  Add Candidate Profile
                </Link>
                <Link href="/blog/write" className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 text-center py-2 px-4 rounded-lg transition-colors">
                  Write Article
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
