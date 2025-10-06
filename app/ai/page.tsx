import { Metadata } from 'next';
import AIChatClient from '@/components/ai/AIChatClient';
import { generateMetadata as generateSEOMetadata, KEYWORDS, combineKeywords } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'AI Assistant - JnUCSU',
  description: 'Get AI-powered assistance for your questions about Jagannath University Central Students\' Union, candidates, and campus activities.',
  keywords: combineKeywords(KEYWORDS.general, ['AI', 'assistant', 'chatbot', 'help', 'support']),
  url: '/ai',
});

export default function AIPage() {
  return <AIChatClient />;
}
