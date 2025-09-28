import Header from '@/components/layout/Header';
import CandidateCard from '@/components/candidates/CandidateCard';
import BlogCard from '@/components/home/BlogCard';
import { dummyLeaders, dummyBlogPosts } from '@/lib/data';
import Link from 'next/link';
import { TrendingUp, Users, BookOpen, ArrowRight } from 'lucide-react';

export default function Home() {
  const topCandidates = dummyLeaders.slice(0, 3);
  const featuredBlog = dummyBlogPosts[0];
  const recentBlogs = dummyBlogPosts.slice(1, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              JnU<span className="text-orange-500">CSU</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover and support student candidates at Jagannath University. 
              Vote for your favorite candidates and engage with the community.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{dummyLeaders.length}</div>
                <div className="text-sm text-gray-600">Student Candidates</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {dummyLeaders.reduce((acc, leader) => acc + leader.votes, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Votes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{dummyBlogPosts.length}</div>
                <div className="text-sm text-gray-600">Blog Posts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Top Candidates Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Top Student Candidates</h2>
                <Link 
                  href="/candidates" 
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 transition-colors"
                >
                  <span>View all</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {topCandidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Featured Blog */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Featured Article</h2>
                <Link 
                  href="/blog" 
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 transition-colors"
                >
                  <span>View blog</span>
                  <ArrowRight className="w-4 h-4" />
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
                <Link 
                  href="/candidates/add"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 px-4 rounded-lg transition-colors"
                >
                  Add Candidate Profile
                </Link>
                <Link 
                  href="/blog/write"
                  className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 text-center py-2 px-4 rounded-lg transition-colors"
                >
                  Write Article
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
