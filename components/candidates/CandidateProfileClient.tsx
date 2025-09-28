'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import QRCode from '@/components/candidates/QRCode';
import Footer from '@/components/layout/Footer';
import { formatRelativeTime } from '@/lib/utils';
import { StudentLeader } from '@/lib/types';
import { 
  ChevronUp, 
  MessageCircle, 
  Share2, 
  Calendar,
  GraduationCap,
  MapPin,
  Send,
  Heart,
  User,
  Target,
  ImageIcon
} from 'lucide-react';

interface CandidateProfileClientProps {
  leader: StudentLeader;
}

export default function CandidateProfileClient({ leader }: CandidateProfileClientProps) {
  const [votes, setVotes] = useState(leader.votes);
  const [hasVoted, setHasVoted] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(leader.comments);

  const handleVote = () => {
    if (!hasVoted) {
      setVotes(votes + 1);
      setHasVoted(true);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        author: {
          id: '1',
          name: 'Anonymous User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous',
          email: 'anonymous@jnu.ac.bd'
        },
        content: newComment,
        createdAt: new Date().toISOString(),
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 md:space-y-8">
            {/* Candidate Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-8">
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                {/* Mobile: Vote and Action Buttons Row */}
                <div className="w-full md:hidden flex items-center justify-between mb-4">
                  <button
                    onClick={handleVote}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      hasVoted 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    disabled={hasVoted}
                  >
                    <ChevronUp className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-lg font-bold">{votes}</div>
                      <div className="text-xs">votes</div>
                    </div>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Desktop: Vote Section */}
                <div className="hidden md:flex flex-col items-center space-y-2">
                  <button
                    onClick={handleVote}
                    className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                      hasVoted 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    disabled={hasVoted}
                  >
                    <ChevronUp className="w-6 h-6" />
                    <span className="text-lg font-bold">{votes}</span>
                    <span className="text-xs">votes</span>
                  </button>
                </div>

                {/* Candidate Info */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
                      <div className="w-24 h-24 md:w-32 md:h-32 mx-auto md:mx-0 rounded-full overflow-hidden ring-4 ring-orange-100">
                        <Image
                          src={leader.avatar}
                          alt={leader.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                          {leader.name}
                        </h1>
                        <p className="text-base md:text-lg text-orange-600 font-semibold mb-3">
                          Competing for {leader.title.replace(' - JnUCSU', '')}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-sm text-gray-600">
                          <div className="flex items-center justify-center md:justify-start space-x-1">
                            <GraduationCap className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{leader.department}</span>
                          </div>
                          <div className="flex items-center justify-center md:justify-start space-x-1">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{leader.university}</span>
                          </div>
                          <div className="flex items-center justify-center md:justify-start space-x-1">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>Year {leader.year}</span>
                          </div>
                          <div className="flex items-center justify-center md:justify-start space-x-1">
                            <User className="w-4 h-4 flex-shrink-0" />
                            <span>ID: {leader.studentId}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Action Buttons */}
                    <div className="hidden md:flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Heart className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {leader.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {leader.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Future Plans Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Future Plans</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {leader.futurePlans}
              </p>
            </div>

            {/* Work Gallery Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-4 md:mb-6">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Work Gallery</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {leader.workGallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image}
                        alt={`${leader.name}'s work sample ${index + 1}`}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-4 md:mb-6">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Comments ({comments.length})
                </h2>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleComment} className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <Image
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
                      alt="Your avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts about this candidate..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        <span>Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex space-x-4">
                      <Image
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.author.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>

                        {/* Comment Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-4 ml-4 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex space-x-3">
                                <Image
                                  src={reply.author.avatar}
                                  alt={reply.author.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900 text-sm">
                                      {reply.author.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatRelativeTime(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* QR Code Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 text-center">
                Share Profile
              </h3>
              <QRCode 
                url={typeof window !== 'undefined' ? `${window.location.origin}/candidates/${leader.id}` : `https://jnucsu.vercel.app/candidates/${leader.id}`}
                title={`${leader.name}'s profile`}
                size={160}
              />
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm md:text-base">Total Votes</span>
                  <span className="font-semibold text-orange-600 text-sm md:text-base">{votes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm md:text-base">Comments</span>
                  <span className="font-semibold text-sm md:text-base">{comments.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm md:text-base">Academic Year</span>
                  <span className="font-semibold text-sm md:text-base">{leader.year}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <div className="space-y-3">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors text-sm md:text-base">
                  Follow
                </button>
                <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm md:text-base">
                  Message
                </button>
                <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm md:text-base">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}