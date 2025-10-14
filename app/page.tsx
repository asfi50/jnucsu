import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrendingCandidates from "@/components/home/TrendingCandidates";
import CompactCandidateCard from "@/components/home/CompactCandidateCard";
import NewCandidates from "@/components/home/NewCandidates";
import BlogCard from "@/components/home/BlogCard";
import CallToActionBanner from "@/components/ui/CallToActionBanner";
import NewsletterCTASection from "@/components/shared/NewsletterCTASection";
import { dummyLeaders, dummyBlogPosts } from "@/lib/data";
import { generateMetadata, KEYWORDS, combineKeywords } from "@/lib/seo";
import {
  convertApiBlogToInterface,
  ApiBlogResponse,
} from "@/lib/utils/blog-conversion";
import { BlogPost } from "@/lib/types/blogs.types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { config } from "@/config";

export const metadata: Metadata = generateMetadata({
  title: "Home - Student Leadership Platform",
  description:
    "Discover trending student leaders, explore candidate profiles, and read the latest articles from Jagannath University Central Students' Union. Join our democratic community and make your voice heard.",
  keywords: combineKeywords(
    KEYWORDS.general,
    KEYWORDS.candidates,
    KEYWORDS.leadership,
    [
      "trending candidates",
      "student democracy",
      "university community",
      "student engagement",
    ]
  ),
  type: "website",
  url: "/",
});

// Server-side function to fetch featured blog
async function getFeaturedBlog(): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${config.clientUrl}/api/blog/featured`, {
      // next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error("Failed to fetch featured blog:", response.status);
      return null;
    }

    const apiData: ApiBlogResponse = await response.json();
    return convertApiBlogToInterface(apiData);
  } catch (error) {
    console.error("Error fetching featured blog:", error);
    return null;
  }
}

export default async function Home() {
  // Fetch featured blog server-side
  const featuredBlog = await getFeaturedBlog();

  // Sort candidates by votes for trending (top 5)
  const trendingCandidates = [...dummyLeaders]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);

  // Sort candidates by votes for top candidates section (top 6, excluding trending)
  const topCandidates = [...dummyLeaders]
    .sort((a, b) => b.votes - a.votes)
    .slice(5, 11);

  // Sort candidates by creation date for new candidates (most recent 4)
  const newCandidates = [...dummyLeaders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  // Fallback to dummy data for other blogs (you can implement similar server-side fetching for these too)
  const recentBlogs = dummyBlogPosts.slice(1, 7); // Get 6 recent posts
  const trendingBlogs = [...dummyBlogPosts]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 2); // Top 2 trending posts by likes

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Call to Action Banner for Candidates */}
            <CallToActionBanner type="candidate" />

            {/* Trending Candidates Section */}
            <TrendingCandidates candidates={trendingCandidates} />

            {/* Newsletter CTA Section */}
            <NewsletterCTASection variant="compact" />

            {/* Top Candidates Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Top Candidates
                </h2>
                <Link
                  href="/candidates"
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 transition-colors group"
                >
                  <span>View all</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topCandidates.map((candidate) => (
                  <CompactCandidateCard
                    key={candidate.id}
                    candidate={candidate}
                  />
                ))}
              </div>
            </section>

            {/* New Candidates Section */}
            <NewCandidates candidates={newCandidates} />

            {/* Recent Articles Section - Moved from sidebar */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Recent Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentBlogs.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* View all posts button */}
              <div className="mt-6 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-colors group"
                >
                  <span>View all posts</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Featured Blog */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Featured Article
                </h2>
                <Link
                  href="/blog"
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 transition-colors group"
                >
                  <span>View blog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {featuredBlog ? (
                <BlogCard post={featuredBlog} featured />
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-gray-500 text-center">
                    No featured article available
                  </p>
                </div>
              )}
            </section>

            {/* Recent Articles */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trending Posts
              </h3>
              <div className="space-y-4">
                {trendingBlogs.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Get Involved
              </h3>
              <div className="space-y-3">
                <Link
                  href="/submit-candidate"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 px-4 rounded-lg transition-colors"
                >
                  Candidate
                </Link>
                <Link
                  href="/submit-blog"
                  className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 text-center py-2 px-4 rounded-lg transition-colors"
                >
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
