"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownViewerProps {
  content: string;
  className?: string;
  theme?: "light" | "dark";
  height?: number | string;
  visibleDragbar?: boolean;
  hideToolbar?: boolean;
  preview?: "edit" | "live" | "preview";
  [key: string]: unknown;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  className = "",
  theme = "light",
  height = "auto",
  visibleDragbar = false,
  hideToolbar = true,
  preview = "preview",
  ...props
}) => {
  return (
    <div className={`markdown-viewer ${className}`} data-color-mode={theme}>
      <MDEditor
        value={content}
        preview={preview}
        hideToolbar={hideToolbar}
        visibleDragbar={visibleDragbar}
        height={height}
        data-color-mode={theme}
        {...props}
      />

      <style jsx global>{`
        .markdown-viewer .w-md-editor {
          background-color: transparent !important;
          border: none !important;
        }

        .markdown-viewer .w-md-editor-preview {
          background-color: transparent !important;
          padding: 0 !important;
        }

        .markdown-viewer .w-md-editor-preview-inner {
          padding: 0 !important;
        }

        /* Custom markdown styles */
        .markdown-viewer .wmde-markdown {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", sans-serif;
          font-size: 1.125rem;
          line-height: 1.75;
          color: #374151;
        }

        .markdown-viewer .wmde-markdown h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
          border-bottom: 2px solid #f97316;
          padding-bottom: 0.5rem;
        }

        .markdown-viewer .wmde-markdown h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.75rem;
          margin-bottom: 0.875rem;
          color: #111827;
        }

        .markdown-viewer .wmde-markdown h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }

        .markdown-viewer .wmde-markdown h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .markdown-viewer .wmde-markdown p {
          margin-bottom: 1.25rem;
          text-align: justify;
        }

        .markdown-viewer .wmde-markdown ul,
        .markdown-viewer .wmde-markdown ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }

        .markdown-viewer .wmde-markdown li {
          margin-bottom: 0.5rem;
        }

        .markdown-viewer .wmde-markdown blockquote {
          border-left: 4px solid #f97316;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          background-color: #fff7ed;
          padding: 1rem;
          border-radius: 0.375rem;
        }

        .markdown-viewer .wmde-markdown code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #dc2626;
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
        }

        .markdown-viewer .wmde-markdown pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .markdown-viewer .wmde-markdown pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }

        .markdown-viewer .wmde-markdown table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          background-color: white;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .markdown-viewer .wmde-markdown th,
        .markdown-viewer .wmde-markdown td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .markdown-viewer .wmde-markdown th {
          background-color: #f97316;
          color: white;
          font-weight: 600;
        }

        .markdown-viewer .wmde-markdown tr:hover {
          background-color: #fff7ed;
        }

        .markdown-viewer .wmde-markdown a {
          color: #f97316;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .markdown-viewer .wmde-markdown a:hover {
          color: #ea580c;
          text-decoration: underline;
        }

        .markdown-viewer .wmde-markdown img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .markdown-viewer .wmde-markdown hr {
          border: none;
          height: 2px;
          background: linear-gradient(to right, #f97316, #ea580c, #f97316);
          margin: 2rem 0;
          border-radius: 1px;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .markdown-viewer .wmde-markdown {
            font-size: 1rem;
            line-height: 1.6;
          }

          .markdown-viewer .wmde-markdown h1 {
            font-size: 1.875rem;
          }

          .markdown-viewer .wmde-markdown h2 {
            font-size: 1.5rem;
          }

          .markdown-viewer .wmde-markdown h3 {
            font-size: 1.25rem;
          }

          .markdown-viewer .wmde-markdown table {
            font-size: 0.875rem;
          }

          .markdown-viewer .wmde-markdown th,
          .markdown-viewer .wmde-markdown td {
            padding: 0.5rem;
          }
        }

        /* Dark mode styles */
        [data-color-mode="dark"] .markdown-viewer .wmde-markdown {
          color: #f3f4f6;
        }

        [data-color-mode="dark"] .markdown-viewer .wmde-markdown h1,
        [data-color-mode="dark"] .markdown-viewer .wmde-markdown h2,
        [data-color-mode="dark"] .markdown-viewer .wmde-markdown h3,
        [data-color-mode="dark"] .markdown-viewer .wmde-markdown h4 {
          color: #ffffff;
        }

        [data-color-mode="dark"] .markdown-viewer .wmde-markdown blockquote {
          background-color: #1f2937;
          border-left-color: #f97316;
        }

        [data-color-mode="dark"] .markdown-viewer .wmde-markdown code {
          background-color: #374151;
          color: #fbbf24;
        }

        [data-color-mode="dark"] .markdown-viewer .wmde-markdown table {
          background-color: #1f2937;
        }

        [data-color-mode="dark"] .markdown-viewer .wmde-markdown th,
        [data-color-mode="dark"] .markdown-viewer .wmde-markdown td {
          border-bottom-color: #374151;
        }

        [data-color-mode="dark"] .markdown-viewer .wmde-markdown tr:hover {
          background-color: #374151;
        }
      `}</style>
    </div>
  );
};

export default MarkdownViewer;
