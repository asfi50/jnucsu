'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import QRCode from '@/components/candidates/QRCode';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/ui/LoginModal';
import { formatRelativeTime } from '@/lib/utils';
import { StudentLeader } from '@/lib/types';
import { useAuth } from '@/lib/contexts/AuthContext';
import { 
  ChevronUp, 
  MessageCircle, 
  Share2, 
  Calendar,
  GraduationCap,
  MapPin,
  Send,
  User,
  Target,
  ImageIcon,
  Download,
  Phone,
  Mail,
  Home,
  Award,
  X,
  FileText,
  Lock,
  Sparkles
} from 'lucide-react';

interface CandidateProfileClientProps {
  leader: StudentLeader;
}

export default function CandidateProfileClient({ leader }: CandidateProfileClientProps) {
  const [votes, setVotes] = useState(leader.votes);
  const [hasVoted, setHasVoted] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(leader.comments);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();

  // Mock blog posts for candidate
  const [blogs] = useState([
    {
      id: '1',
      title: 'My Vision for Student Welfare',
      excerpt: 'As a candidate, I want to share my plans for improving student welfare on campus.',
      publishedAt: '2024-01-20T10:00:00Z',
      tags: ['Leadership', 'Welfare']
    },
    {
      id: '2',
      title: 'Building a Better Campus Community',
      excerpt: 'My thoughts on creating an inclusive environment for all students.',
      publishedAt: '2024-01-15T10:00:00Z',
      tags: ['Community', 'Inclusion']
    }
  ]);

  // Mock candidate's comments made across the site
  const [candidateComments] = useState(leader.candidateComments || [
    {
      id: 'c1',
      author: {
        id: leader.id,
        name: leader.name,
        avatar: leader.avatar,
        email: leader.email || 'candidate@jnu.ac.bd'
      },
      content: 'Great initiative! I believe student welfare should always be our top priority. Looking forward to contributing to this discussion.',
      createdAt: '2024-01-18T14:30:00Z',
      replies: [],
      context: {
        type: 'blog' as const,
        title: 'Improving Campus Facilities',
        url: '/blog/5'
      }
    },
    {
      id: 'c2',
      author: {
        id: leader.id,
        name: leader.name,
        avatar: leader.avatar,
        email: leader.email || 'candidate@jnu.ac.bd'
      },
      content: 'I appreciate the diverse perspectives being shared here. This is exactly the kind of dialogue we need.',
      createdAt: '2024-01-16T09:15:00Z',
      replies: [],
      context: {
        type: 'candidate' as const,
        title: 'Discussion on Student Rights',
        url: '/candidates/3'
      }
    }
  ]);

  const handleVote = () => {
    if (!isAuthenticated) {
      // Show login modal instead of redirecting
      setShowLoginModal(true);
      return;
    }

    if (hasVoted) {
      // Remove vote
      setVotes(votes - 1);
      setHasVoted(false);
    } else {
      // Add vote
      setVotes(votes + 1);
      setHasVoted(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${leader.name} - ${leader.title}`,
          text: `Check out ${leader.name}'s profile for ${leader.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownloadIDCard = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98] // Credit card size
      });

      // Background
      pdf.setFillColor(255, 120, 60); // Orange
      pdf.rect(0, 0, 85.6, 53.98, 'F');

      // White content area
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(3, 3, 79.6, 47.98, 2, 2, 'F');

      // Title
      pdf.setFontSize(10);
      pdf.setTextColor(255, 120, 60);
      pdf.setFont('helvetica', 'bold');
      pdf.text('JnUCSU Candidate ID', 42.8, 8, { align: 'center' });

      // Name
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(leader.name, 6, 16);

      // Position
      pdf.setFontSize(8);
      pdf.setTextColor(255, 120, 60);
      pdf.text(leader.title.replace(' - JnUCSU', ''), 6, 21);

      // Details
      pdf.setFontSize(7);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`ID: ${leader.studentId}`, 6, 27);
      pdf.text(`${leader.department}`, 6, 31);
      pdf.text(`Year ${leader.year}`, 6, 35);

      // QR Code (placeholder - in real implementation, you'd embed actual QR)
      const qrSize = 30;
      const qrX = 85.6 - qrSize - 5;
      const qrY = (53.98 - qrSize) / 2;
      
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(qrX, qrY, qrSize, qrSize);
      
      // QR code URL text
      pdf.setFontSize(5);
      pdf.text('Scan for profile', qrX + qrSize/2, qrY + qrSize + 2, { align: 'center' });

      // Footer
      pdf.setFontSize(6);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Jagannath University CSU', 42.8, 51, { align: 'center' });

      pdf.save(`${leader.name.replace(/\s+/g, '_')}_ID_Card.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating ID card. Please try again.');
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // Show login modal instead of redirecting
      setShowLoginModal(true);
      return;
    }

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
                  >
                    <ChevronUp className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-lg font-bold">{votes}</div>
                      <div className="text-xs">{hasVoted ? 'Upvoted' : 'Upvote'}</div>
                    </div>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleShare}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Share2 className="w-5 h-5 text-gray-600" />
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
                  >
                    <ChevronUp className="w-6 h-6" />
                    <span className="text-lg font-bold">{votes}</span>
                    <span className="text-xs">{hasVoted ? 'Upvoted' : 'Upvote'}</span>
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
                      <button 
                        onClick={handleShare}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Share profile"
                      >
                        <Share2 className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {leader.description}
                  </p>

                  {/* Additional Profile Fields */}
                  {(leader.phone || leader.email || leader.address) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                      {leader.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-orange-600 flex-shrink-0" />
                          <span>{leader.phone}</span>
                        </div>
                      )}
                      {leader.email && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-orange-600 flex-shrink-0" />
                          <span className="truncate">{leader.email}</span>
                        </div>
                      )}
                      {leader.address && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 md:col-span-2">
                          <Home className="w-4 h-4 text-orange-600 flex-shrink-0" />
                          <span>{leader.address}</span>
                        </div>
                      )}
                    </div>
                  )}

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

            {/* AI Review Section */}
            <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-lg border border-orange-200 p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">AI Performance Review</h2>
                  <p className="text-sm text-gray-600">Automated analysis of candidate activity</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">Engagement Score: </span>
                    Based on {leader.votes} upvotes and {leader.comments.length} community comments, {leader.name} demonstrates strong community engagement and active participation in student discussions.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">Vision & Planning: </span>
                    The candidate has articulated a clear vision for {leader.title.replace(' - JnUCSU', '')}, with comprehensive plans addressing student welfare, academic excellence, and campus development.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">Community Presence: </span>
                    {leader.workGallery.length > 0 ? `With ${leader.workGallery.length} documented activities in their work gallery, ${leader.name} shows consistent involvement in campus initiatives and student programs.` : `${leader.name} is building their portfolio and actively working on campus initiatives.`}
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">Overall Assessment: </span>
                    {leader.name} presents as a {leader.votes > 50 ? 'highly popular' : 'promising'} candidate with strong credentials in {leader.department}. Their {leader.year === 1 ? 'fresh perspective' : 'experience'} as a Year {leader.year} student brings valuable insights to the role.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 italic">
                    * This AI-generated review is based on publicly available candidate information and community engagement metrics. It provides an automated, objective assessment to help voters make informed decisions.
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            {leader.achievements && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Achievements</h2>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {leader.achievements}
                </p>
              </div>
            )}

            {/* Work Gallery Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-4 md:mb-6">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Work Gallery</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {leader.workGallery.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <Image
                        src={image}
                        alt={`${leader.name}'s work sample ${index + 1}`}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Lightbox Modal */}
            {selectedImage && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
              >
                <button
                  className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-8 h-8" />
                </button>
                <div className="relative max-w-6xl max-h-[90vh] w-full">
                  <Image
                    src={selectedImage}
                    alt="Gallery image"
                    width={1200}
                    height={800}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Blog Posts Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-4 md:mb-6">
                <FileText className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Blog Posts ({blogs.length})
                </h2>
              </div>
              {blogs.length > 0 ? (
                <div className="space-y-4">
                  {blogs.map((blog) => (
                    <Link key={blog.id} href={`/blog/${blog.id}`}>
                      <div className="border-b border-gray-100 pb-4 last:border-b-0 hover:bg-gray-50 transition-colors p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{blog.title}</h3>
                        <p className="text-xs md:text-sm text-gray-600 mb-2">{blog.excerpt}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                          <div className="flex gap-2">
                            {blog.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm md:text-base">No blog posts yet.</p>
              )}
            </div>

            {/* Candidate's Comments Across Site */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-4 md:mb-6">
                <MessageCircle className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  {leader.name}&apos;s Comments ({candidateComments.length})
                </h2>
              </div>
              {candidateComments.length > 0 ? (
                <div className="space-y-4">
                  {candidateComments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex space-x-3 md:space-x-4">
                        <div className="flex-shrink-0">
                          <Image
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900 text-sm md:text-base">
                                {comment.author.name}
                              </span>
                              <span className="text-xs md:text-sm text-gray-500">
                                commented on
                              </span>
                            </div>
                            <span className="text-xs md:text-sm text-gray-500">
                              {formatRelativeTime(comment.createdAt)}
                            </span>
                          </div>
                          {comment.context && (
                            <Link href={comment.context.url} className="inline-flex items-center text-xs md:text-sm text-orange-600 hover:text-orange-700 mb-2">
                              <FileText className="w-3 h-3 mr-1" />
                              {comment.context.title}
                            </Link>
                          )}
                          <p className="text-gray-700 leading-relaxed text-sm md:text-base break-words bg-gray-50 p-3 rounded-lg">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm md:text-base">No comments yet.</p>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-4 md:mb-6">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Comments on this Candidate ({comments.length})
                </h2>
              </div>

              {/* Add Comment Form */}
              {isAuthenticated ? (
                <form onSubmit={handleComment} className="mb-6 md:mb-8">
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex-shrink-0 hidden sm:block">
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm md:text-base"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm md:text-base"
                        >
                          <Send className="w-4 h-4" />
                          <span>Comment</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mb-6 md:mb-8 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <Lock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Comments are locked</h4>
                  <p className="text-gray-600 mb-4">Please log in to share your thoughts about this candidate.</p>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    <span>Log In to Comment</span>
                  </button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4 md:space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-4 md:pb-6 last:border-b-0">
                    <div className="flex space-x-3 md:space-x-4">
                      <div className="flex-shrink-0">
                        <Link href={`/users/${comment.author.id}`}>
                          <Image
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            width={40}
                            height={40}
                            className="rounded-full cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                          <Link href={`/users/${comment.author.id}`} className="font-medium text-gray-900 text-sm md:text-base hover:text-orange-600 transition-colors">
                            {comment.author.name}
                          </Link>
                          <span className="text-xs md:text-sm text-gray-500">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base break-words">
                          {comment.content}
                        </p>

                        {/* Comment Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-3 md:mt-4 ml-3 md:ml-4 space-y-3 md:space-y-4 border-l-2 border-gray-200 pl-3 md:pl-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex space-x-2 md:space-x-3">
                                <div className="flex-shrink-0">
                                  <Link href={`/users/${reply.author.id}`}>
                                    <Image
                                      src={reply.author.avatar}
                                      alt={reply.author.name}
                                      width={32}
                                      height={32}
                                      className="rounded-full cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all"
                                    />
                                  </Link>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                                    <Link href={`/users/${reply.author.id}`} className="font-medium text-gray-900 text-xs md:text-sm hover:text-orange-600 transition-colors">
                                      {reply.author.name}
                                    </Link>
                                    <span className="text-xs text-gray-500">
                                      {formatRelativeTime(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-xs md:text-sm leading-relaxed break-words">
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
                    <p className="text-sm md:text-base">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Mobile: QR Code next to image - shown only on mobile */}
            <div className="lg:hidden bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Share Profile
                  </h3>
                  <p className="text-xs text-gray-600">Scan to visit profile</p>
                </div>
                <div className="flex-shrink-0">
                  <QRCode 
                    url={typeof window !== 'undefined' ? `${window.location.origin}/candidates/${leader.id}` : `https://jnucsu.vercel.app/candidates/${leader.id}`}
                    title=""
                    size={100}
                  />
                </div>
              </div>
              <button
                onClick={handleDownloadIDCard}
                className="w-full mt-3 flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download ID Card</span>
              </button>
            </div>

            {/* Desktop: QR Code Section */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 text-center">
                Share Profile
              </h3>
              <QRCode 
                url={typeof window !== 'undefined' ? `${window.location.origin}/candidates/${leader.id}` : `https://jnucsu.vercel.app/candidates/${leader.id}`}
                title={`${leader.name}'s profile`}
                size={160}
              />
              <button
                onClick={handleDownloadIDCard}
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors text-sm md:text-base"
              >
                <Download className="w-4 h-4" />
                <span>Download ID Card</span>
              </button>
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
                <button 
                  onClick={handleShare}
                  className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm md:text-base flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        returnUrl={`/candidates/${leader.id}`}
        message="Please log in to upvote or comment on this candidate profile."
      />
    </div>
  );
}