import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopCandidatesClient from "@/components/home/TopCandidatesClient";
import RecentBlogsSection from "@/components/home/RecentBlogsSection";
import SidebarBlogsSection from "@/components/home/SidebarBlogsSection";
import CallToActionBanner from "@/components/ui/CallToActionBanner";
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
import { TopCandidate } from "./api/candidate/top/route";
import { NewCandidateData } from "./api/candidate/new/route";
import NewCandidatesClient from "@/components/home/NewCandidatesClient";
import { PanelMember } from "./api/panel/public-choice/route";
import TrendingPanelMembers from "@/components/home/public-choice";

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
      next: { revalidate: 300 }, // Revalidate every 5 minutes
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

async function getTopCandidates(): Promise<TopCandidate[] | null> {
  try {
    const response = await fetch(`${config.clientUrl}/api/candidate/top`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error("Failed to fetch top candidates:", response.status);
      return null;
    }

    const data = await response.json();
    return data as TopCandidate[];
  } catch (error) {
    console.error("Error fetching top candidates:", error);
    return null;
  }
}

async function getTrendingpanel(): Promise<PanelMember[] | null> {
  try {
    const response = await fetch(
      `${config.clientUrl}/api/panel/public-choice`,
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );
    if (!response.ok) {
      console.error("Failed to fetch trending panel members:", response.status);
      return null;
    }
    const data = await response.json();
    return data as PanelMember[];
  } catch (error) {
    console.error("Error fetching trending panel members:", error);
    return null;
  }
}

// Server-side function to fetch new candidates
async function getNewCandidates(): Promise<NewCandidateData[] | null> {
  try {
    const response = await fetch(`${config.clientUrl}/api/candidate/new`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error("Failed to fetch new candidates:", response.status);
      return null;
    }

    const data = await response.json();
    return data as NewCandidateData[];
  } catch (error) {
    console.error("Error fetching new candidates:", error);
    return null;
  }
}

// Server-side function to fetch recent blogs
interface RecentBlogData {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  views: number;
  likes: number;
  loves: number;
  totalReactions: number;
}

async function getRecentBlogs(): Promise<RecentBlogData[] | null> {
  try {
    const response = await fetch(
      `${config.clientUrl}/api/blog/recent?limit=6`,
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch recent blogs:", response.status);
      return null;
    }

    const data = await response.json();
    return data as RecentBlogData[];
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    return null;
  }
}

// Server-side function to fetch trending blogs
async function getTrendingBlogs(): Promise<RecentBlogData[] | null> {
  try {
    const response = await fetch(
      `${config.clientUrl}/api/blog/trending?limit=2`,
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch trending blogs:", response.status);
      return null;
    }

    const data = await response.json();
    return data as RecentBlogData[];
  } catch (error) {
    console.error("Error fetching trending blogs:", error);
    return null;
  }
}

export default async function Home() {
  // Fetch all data server-side
  let panelLoading = true;
  const featuredBlog = await getFeaturedBlog();
  const topCandidates = await getTopCandidates();
  const trendingPanelMembers = await getTrendingpanel().then((data) => {
    panelLoading = false;
    return data;
  });
  const newCandidates = await getNewCandidates();
  const recentBlogs = await getRecentBlogs();
  const trendingBlogs = await getTrendingBlogs();

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

            <TrendingPanelMembers
              initialData={trendingPanelMembers ?? undefined}
              isLoading={panelLoading}
            />

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

              <TopCandidatesClient initialData={topCandidates ?? undefined} />
            </section>

            {/* New Candidates Section */}
            <NewCandidatesClient initialData={newCandidates ?? undefined} />

            {/* Recent Articles Section */}
            <RecentBlogsSection initialData={recentBlogs ?? undefined} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <SidebarBlogsSection
              initialFeaturedBlog={featuredBlog}
              initialTrendingBlogs={trendingBlogs ?? undefined}
            />

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
