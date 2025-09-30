import { QRCodeSVG } from "qrcode.react";

export default function Dashboard() {
  const isVerified = true; // you can fetch this dynamically later
  const profileLink = "https://yourapp.com/profile/john-doe"; // dynamic user link

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back, John!</h2>
              {isVerified ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">✅ Verified</span> : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">❌ Not Verified</span>}
            </div>
            <p className="text-gray-600">Here&apos;s what&apos;s happening with your leadership profile today.</p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-600">JD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">📊</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+12% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">567</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">👁️</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600">+8% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ranking</p>
              <p className="text-2xl font-bold text-gray-900">#3</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">🏆</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600">+2 positions up</span>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Profile</h3>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <QRCodeSVG value={profileLink} size={128} />
          <div>
            <p className="text-gray-600 mb-2">Share this link with others:</p>
            <a href={profileLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
              {profileLink}
            </a>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left">
            <div className="text-lg mb-2">📝</div>
            <h4 className="font-medium text-gray-900">Update Profile</h4>
            <p className="text-sm text-gray-600">Edit your information and photo</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left">
            <div className="text-lg mb-2">📊</div>
            <h4 className="font-medium text-gray-900">View Analytics</h4>
            <p className="text-sm text-gray-600">See detailed performance metrics</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left">
            <div className="text-lg mb-2">💬</div>
            <h4 className="font-medium text-gray-900">Messages</h4>
            <p className="text-sm text-gray-600">Check your inbox</p>
          </button>
        </div>
      </div>
    </div>
  );
}