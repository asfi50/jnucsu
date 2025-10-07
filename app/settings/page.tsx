'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from "qrcode.react";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useNotifications } from '@/lib/contexts/NotificationContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { settings, updateSettings } = useNotifications();
  const [notificationSettings, setNotificationSettings] = useState(settings);
  const isVerified = true; // you can fetch this dynamically later
  const profileLink = "https://yourapp.com/profile/john-doe"; // dynamic user link

  // Update local state when context settings change
  useEffect(() => {
    setNotificationSettings(settings);
  }, [settings]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'John'}!</h2>
                    {isVerified ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">✅ Verified</span> : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">❌ Not Verified</span>}
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Here&apos;s what&apos;s happening with your leadership profile today.</p>
                </div>
                <div className="hidden sm:block flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-600">
                      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'JD'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Votes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">1,234</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xl">📊</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-green-600">+12% from last week</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profile Views</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">567</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xl">👁️</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-blue-600">+8% from last week</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ranking</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">#3</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 text-xl">🏆</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-yellow-600">+2 positions up</span>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Profile</h3>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <QRCodeSVG value={profileLink} size={128} />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-gray-600 mb-2">Share this link with others:</p>
                  <a href={profileLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all text-sm">
                    {profileLink}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
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

            {/* Notification Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <p className="text-sm text-gray-600 mb-6">Choose what notifications you want to receive</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">Blog Comments</h4>
                    <p className="text-xs text-gray-500 mt-1">Get notified when someone comments on your blog posts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.blogComments}
                      onChange={(e) => {
                        const newSettings = { ...notificationSettings, blogComments: e.target.checked };
                        setNotificationSettings(newSettings);
                        updateSettings(newSettings);
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">Candidate Profile Comments</h4>
                    <p className="text-xs text-gray-500 mt-1">Get notified when someone comments on your candidate page</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.candidateComments}
                      onChange={(e) => {
                        const newSettings = { ...notificationSettings, candidateComments: e.target.checked };
                        setNotificationSettings(newSettings);
                        updateSettings(newSettings);
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">Message Replies</h4>
                    <p className="text-xs text-gray-500 mt-1">Get notified when someone replies to your messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.messageReplies}
                      onChange={(e) => {
                        const newSettings = { ...notificationSettings, messageReplies: e.target.checked };
                        setNotificationSettings(newSettings);
                        updateSettings(newSettings);
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">Mentions</h4>
                    <p className="text-xs text-gray-500 mt-1">Get notified when someone mentions you in a comment</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.mentions}
                      onChange={(e) => {
                        const newSettings = { ...notificationSettings, mentions: e.target.checked };
                        setNotificationSettings(newSettings);
                        updateSettings(newSettings);
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
