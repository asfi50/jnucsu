import Header from '@/app/components/layout/Header';
import LeaderCard from '@/app/components/features/LeaderCard';
import { dummyLeaders } from '@/lib/data';
import { Users, Search } from 'lucide-react';

export default function LeadersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Student Leaders</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Meet the student leaders who are shaping the future of Jagannath University. 
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
                placeholder="Search leaders..."
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

        {/* Leaders Grid */}
        <div className="space-y-4">
          {dummyLeaders.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors">
            Load More Leaders
          </button>
        </div>
      </div>
    </div>
  );
}