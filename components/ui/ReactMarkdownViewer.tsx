"use client";

import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";

interface ReactMarkdownViewerProps {
  content: string;
  className?: string;
  theme?: "light" | "dark";
}

const ReactMarkdownViewer: React.FC<ReactMarkdownViewerProps> = ({
  content,
  className = "",
  theme = "light",
}) => {
  return (
    <div
      className={`react-markdown-viewer ${theme}-theme ${className}`}
      data-color-mode={theme}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom components for better styling
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-6 pb-2 border-b-2 border-orange-500">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 mt-5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-3">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-gray-700 mb-4 leading-relaxed text-justify">
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-orange-600 hover:text-orange-700 underline font-medium"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-orange-500 pl-4 py-2 my-4 bg-orange-50 italic text-gray-700">
              {children}
            </blockquote>
          ),
          code: ({
            className,
            children,
            ...props
          }: React.HTMLProps<HTMLElement>) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            return isInline ? (
              <code
                className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-orange-500 text-white">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2">{children}</td>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-orange-50 transition-colors">{children}</tr>
          ),
          img: (props) => (
            <Image
              src={typeof props.src === "string" ? props.src : ""}
              alt={props.alt || ""}
              width={800}
              height={600}
              className="max-w-full h-auto rounded-lg shadow-md my-4 mx-auto block"
            />
          ),
          hr: () => <hr className="my-6 border-t-2 border-orange-300" />,
        }}
      >
        {content}
      </ReactMarkdown>

      <style jsx global>{`
        /* Dark theme styles */
        [data-color-mode="dark"] .react-markdown-viewer h1,
        [data-color-mode="dark"] .react-markdown-viewer h2,
        [data-color-mode="dark"] .react-markdown-viewer h3,
        [data-color-mode="dark"] .react-markdown-viewer h4 {
          color: #ffffff !important;
        }

        [data-color-mode="dark"] .react-markdown-viewer p {
          color: #e5e7eb !important;
        }

        [data-color-mode="dark"] .react-markdown-viewer blockquote {
          background-color: #374151 !important;
          color: #d1d5db !important;
        }

        [data-color-mode="dark"] .react-markdown-viewer ul,
        [data-color-mode="dark"] .react-markdown-viewer ol {
          color: #e5e7eb !important;
        }

        [data-color-mode="dark"] .react-markdown-viewer code {
          background-color: #374151 !important;
          color: #fbbf24 !important;
        }

        [data-color-mode="dark"] .react-markdown-viewer table {
          background-color: #1f2937 !important;
        }

        [data-color-mode="dark"] .react-markdown-viewer th,
        [data-color-mode="dark"] .react-markdown-viewer td {
          border-color: #4b5563 !important;
          color: #e5e7eb !important;
        }

        [data-color-mode="dark"] .react-markdown-viewer tr:hover {
          background-color: #374151 !important;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .react-markdown-viewer h1 {
            font-size: 1.75rem !important;
          }

          .react-markdown-viewer h2 {
            font-size: 1.5rem !important;
          }

          .react-markdown-viewer h3 {
            font-size: 1.25rem !important;
          }

          .react-markdown-viewer p {
            text-align: left !important;
          }

          .react-markdown-viewer table {
            font-size: 0.875rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReactMarkdownViewer;
