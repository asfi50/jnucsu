'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Clock } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';
import { useState } from 'react';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
    }
  };

  if (featured) {
    return (
      <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
        <div className="relative h-64">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <Link href={`/blog/${post.id}`} className="group">
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-tight mb-2">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-gray-600 mb-4 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="text-sm">
                <p className="text-gray-900 font-medium">{post.author.name}</p>
                <p className="text-gray-500">{formatRelativeTime(post.publishedAt)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-colors ${
                  hasLiked ? 'text-red-500' : 'hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
      <div className="relative h-48">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <Link href={`/blog/${post.id}`} className="group">
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors leading-tight mb-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span>{post.author.name}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{post.readTime}m</span>
            </div>
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors ${
                hasLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <Heart className={`w-3 h-3 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}