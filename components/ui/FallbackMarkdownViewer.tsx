"use client";

import React from "react";

interface FallbackMarkdownViewerProps {
  content: string;
  className?: string;
}

const FallbackMarkdownViewer: React.FC<FallbackMarkdownViewerProps> = ({
  content,
  className = "",
}) => {
  // Simple markdown parsing for basic elements
  const parseMarkdown = (text: string): string => {
    let html = text;

    // Headers
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-xl font-semibold text-gray-800 mb-2 mt-4">$1</h3>'
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-2xl font-semibold text-gray-800 mb-3 mt-5">$1</h2>'
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-3xl font-bold text-gray-900 mb-4 mt-6 pb-2 border-b-2 border-orange-500">$1</h1>'
    );

    // Bold and italic
    html = html.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold">$1</strong>'
    );
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Code blocks
    html = html.replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>'
    );

    // Inline code
    html = html.replace(
      /`(.*?)`/g,
      '<code class="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
    );

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-orange-600 hover:text-orange-700 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Line breaks
    html = html.replace(
      /\n\n/g,
      '</p><p class="text-gray-700 mb-4 leading-relaxed text-justify">'
    );
    html = html.replace(/\n/g, "<br>");

    // Wrap in paragraph tags
    html =
      '<p class="text-gray-700 mb-4 leading-relaxed text-justify">' +
      html +
      "</p>";

    // Clean up empty paragraphs
    html = html.replace(/<p[^>]*><\/p>/g, "");

    return html;
  };

  const parsedContent = parseMarkdown(content || "");

  return (
    <div className={`fallback-markdown-viewer ${className}`}>
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      />

      <style jsx global>{`
        .fallback-markdown-viewer {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            sans-serif;
          line-height: 1.7;
        }

        .fallback-markdown-viewer h1,
        .fallback-markdown-viewer h2,
        .fallback-markdown-viewer h3,
        .fallback-markdown-viewer h4 {
          font-weight: 600;
          color: #111827;
        }

        .fallback-markdown-viewer h1 {
          border-bottom: 2px solid #f97316;
          padding-bottom: 0.5rem;
        }

        .fallback-markdown-viewer p {
          margin-bottom: 1rem;
          color: #374151;
        }

        .fallback-markdown-viewer pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .fallback-markdown-viewer code {
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
        }

        .fallback-markdown-viewer a {
          color: #f97316;
          text-decoration: underline;
          font-weight: 500;
        }

        .fallback-markdown-viewer a:hover {
          color: #ea580c;
        }

        .fallback-markdown-viewer strong {
          font-weight: 600;
          color: #111827;
        }

        .fallback-markdown-viewer em {
          font-style: italic;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default FallbackMarkdownViewer;
