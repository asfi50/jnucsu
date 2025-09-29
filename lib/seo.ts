import { Metadata } from 'next';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
}

const DEFAULT_CONFIG = {
  siteName: 'JnUCSU - Jagannath University Central Students\' Union',
  defaultTitle: 'JnUCSU - Jagannath University Central Students\' Union',
  defaultDescription: 'Official platform of Jagannath University Central Students\' Union. Discover student leaders, read insightful articles, and engage with the vibrant campus community. Vote for your favorite candidates and stay updated with university news.',
  defaultImage: 'https://api.dicebear.com/7.x/initials/svg?seed=JnUCSU&backgroundColor=f97316',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://jnucsu.vercel.app',
  twitterHandle: '@JnUCSU',
  facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
};

export function generateMetadata(config: SEOConfig): Metadata {
  const title = config.title 
    ? `${config.title} | ${DEFAULT_CONFIG.siteName}`
    : DEFAULT_CONFIG.defaultTitle;
  
  const description = config.description || DEFAULT_CONFIG.defaultDescription;
  const image = config.image || DEFAULT_CONFIG.defaultImage;
  const url = config.url ? `${DEFAULT_CONFIG.baseUrl}${config.url}` : DEFAULT_CONFIG.baseUrl;
  
  const metadata: Metadata = {
    title,
    description,
    keywords: config.keywords?.join(', '),
    authors: config.author ? [{ name: config.author }] : [{ name: DEFAULT_CONFIG.siteName }],
    
    // Open Graph
    openGraph: {
      title,
      description,
      url,
      siteName: DEFAULT_CONFIG.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: config.title || DEFAULT_CONFIG.siteName,
        },
      ],
      type: config.type || 'website',
      ...(config.publishedTime && { publishedTime: config.publishedTime }),
      ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
      ...(config.section && { section: config.section }),
      ...(config.tags && { tags: config.tags }),
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: DEFAULT_CONFIG.twitterHandle,
      site: DEFAULT_CONFIG.twitterHandle,
    },
    
    // Additional SEO
    robots: {
      index: !config.noIndex,
      follow: !config.noIndex,
      googleBot: {
        index: !config.noIndex,
        follow: !config.noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Verification and other meta tags
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      other: {
        'facebook-domain-verification': process.env.NEXT_PUBLIC_FACEBOOK_VERIFICATION || '',
      },
    },
  };

  return metadata;
}

export function generateStructuredData(config: {
  type: 'Organization' | 'Article' | 'Person' | 'WebSite';
  data: Record<string, unknown>;
}) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': config.type,
  };

  switch (config.type) {
    case 'Organization':
      return {
        ...baseStructuredData,
        name: DEFAULT_CONFIG.siteName,
        url: DEFAULT_CONFIG.baseUrl,
        logo: DEFAULT_CONFIG.defaultImage,
        description: DEFAULT_CONFIG.defaultDescription,
        sameAs: [
          'https://github.com/asfi50/jnucsu',
          // Add more social media URLs here
        ],
        ...config.data,
      };
    
    case 'WebSite':
      return {
        ...baseStructuredData,
        name: DEFAULT_CONFIG.siteName,
        url: DEFAULT_CONFIG.baseUrl,
        description: DEFAULT_CONFIG.defaultDescription,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${DEFAULT_CONFIG.baseUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        ...config.data,
      };
    
    case 'Article': {
      const articleData = config.data as {
        title?: string;
        description?: string;
        author?: { name?: string };
        publishedTime?: string;
        modifiedTime?: string;
        image?: string;
        url?: string;
      };
      
      return {
        ...baseStructuredData,
        headline: articleData.title,
        description: articleData.description,
        author: {
          '@type': 'Person',
          name: articleData.author?.name || 'JnUCSU Team',
        },
        publisher: {
          '@type': 'Organization',
          name: DEFAULT_CONFIG.siteName,
          logo: {
            '@type': 'ImageObject',
            url: DEFAULT_CONFIG.defaultImage,
          },
        },
        datePublished: articleData.publishedTime,
        dateModified: articleData.modifiedTime || articleData.publishedTime,
        image: articleData.image,
        url: articleData.url,
        mainEntityOfPage: articleData.url,
        ...config.data,
      };
    }
    
    case 'Person': {
      const personData = config.data as {
        name?: string;
        description?: string;
        image?: string;
        url?: string;
        jobTitle?: string;
      };
      
      return {
        ...baseStructuredData,
        name: personData.name,
        description: personData.description,
        image: personData.image,
        url: personData.url,
        jobTitle: personData.jobTitle,
        affiliation: {
          '@type': 'Organization',
          name: 'Jagannath University',
        },
        ...config.data,
      };
    }
    
    default:
      return { ...baseStructuredData, ...config.data };
  }
}

// Common keyword sets for different page types
export const KEYWORDS = {
  general: [
    'Jagannath University',
    'JnU',
    'student union',
    'student leadership',
    'university politics',
    'student government',
    'Bangladesh university',
    'student democracy'
  ],
  candidates: [
    'student candidates',
    'election candidates',
    'student leaders',
    'university election',
    'student politics',
    'candidate profiles',
    'voting',
    'student representatives'
  ],
  blog: [
    'university blog',
    'student articles',
    'campus news',
    'student insights',
    'leadership articles',
    'student journalism',
    'university updates',
    'student perspectives'
  ],
  leadership: [
    'student leadership',
    'leadership development',
    'student mentorship',
    'leadership skills',
    'student empowerment',
    'campus leadership',
    'student activism'
  ],
};

export function combineKeywords(...keywordSets: string[][]): string[] {
  return [...new Set(keywordSets.flat())];
}