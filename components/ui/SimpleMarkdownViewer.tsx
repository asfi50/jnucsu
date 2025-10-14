"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

interface SimpleMarkdownViewerProps {
  content: string;
  className?: string;
  theme?: "light" | "dark";
  fontSize?: "sm" | "base" | "lg" | "xl";
}

const SimpleMarkdownViewer: React.FC<SimpleMarkdownViewerProps> = ({
  content,
  className = "",
  theme = "light",
  fontSize = "base",
}) => {
  const fontSizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div
      className={`simple-markdown-viewer ${fontSizeClasses[fontSize]} ${className}`}
      data-color-mode={theme}
    >
      <MDEditor
        value={content}
        preview="preview"
        hideToolbar={true}
        visibleDragbar={false}
        height="auto"
        data-color-mode={theme}
      />

      <style jsx global>{`
        .simple-markdown-viewer .w-md-editor {
          background-color: transparent !important;
          border: none !important;
        }

        .simple-markdown-viewer .w-md-editor-preview {
          background-color: transparent !important;
          padding: 0 !important;
        }

        .simple-markdown-viewer .w-md-editor-preview-inner {
          padding: 0 !important;
        }

        /* Clean, simple markdown styles */
        .simple-markdown-viewer .wmde-markdown {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            sans-serif;
          color: #374151;
          line-height: 1.7;
        }

        .simple-markdown-viewer .wmde-markdown h1,
        .simple-markdown-viewer .wmde-markdown h2,
        .simple-markdown-viewer .wmde-markdown h3,
        .simple-markdown-viewer .wmde-markdown h4,
        .simple-markdown-viewer .wmde-markdown h5,
        .simple-markdown-viewer .wmde-markdown h6 {
          color: #111827;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .simple-markdown-viewer .wmde-markdown h1 {
          font-size: 2rem;
          border-bottom: 2px solid #f97316;
          padding-bottom: 0.5rem;
        }

        .simple-markdown-viewer .wmde-markdown h2 {
          font-size: 1.5rem;
        }

        .simple-markdown-viewer .wmde-markdown h3 {
          font-size: 1.25rem;
        }

        .simple-markdown-viewer .wmde-markdown p {
          margin-bottom: 1rem;
        }

        .simple-markdown-viewer .wmde-markdown a {
          color: #f97316;
          text-decoration: none;
        }

        .simple-markdown-viewer .wmde-markdown a:hover {
          text-decoration: underline;
        }

        .simple-markdown-viewer .wmde-markdown code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          color: #dc2626;
        }

        .simple-markdown-viewer .wmde-markdown pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .simple-markdown-viewer .wmde-markdown pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }

        .simple-markdown-viewer .wmde-markdown blockquote {
          border-left: 4px solid #f97316;
          margin: 1rem 0;
          padding-left: 1rem;
          color: #6b7280;
          font-style: italic;
        }

        .simple-markdown-viewer .wmde-markdown ul,
        .simple-markdown-viewer .wmde-markdown ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .simple-markdown-viewer .wmde-markdown li {
          margin-bottom: 0.25rem;
        }

        .simple-markdown-viewer .wmde-markdown img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .simple-markdown-viewer .wmde-markdown table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .simple-markdown-viewer .wmde-markdown th,
        .simple-markdown-viewer .wmde-markdown td {
          border: 1px solid #e5e7eb;
          padding: 0.5rem;
          text-align: left;
        }

        .simple-markdown-viewer .wmde-markdown th {
          background-color: #f9fafb;
          font-weight: 600;
        }

        /* Dark theme */
        [data-color-mode="dark"] .simple-markdown-viewer .wmde-markdown {
          color: #f3f4f6;
        }

        [data-color-mode="dark"] .simple-markdown-viewer .wmde-markdown h1,
        [data-color-mode="dark"] .simple-markdown-viewer .wmde-markdown h2,
        [data-color-mode="dark"] .simple-markdown-viewer .wmde-markdown h3,
        [data-color-mode="dark"] .simple-markdown-viewer .wmde-markdown h4,
        [data-color-mode="dark"] .simple-markdown-viewer .wmde-markdown h5,
        [data-color-mode="dark"] .simple-markdown-viewer .wmde-markdown h6 {
          color: #ffffff;
        }

        [data-color-mode="dark"]
          .simple-markdown-viewer
          .wmde-markdown
          blockquote {
          color: #9ca3af;
        }

        [data-color-mode="dark"] .simple-markdown-viewer .wmde-markdown code {
          background-color: #374151;
          color: #fbbf24;
        }

        [data-color-mode="dark"] .simple-markdown-viewer .wmde-markdown th {
          background-color: #374151;
        }

        [data-color-mode="dark"] .simple-markdown-viewer .wmde-markdown th,
        [data-color-mode="dark"] .simple-markdown-viewer .wmde-markdown td {
          border-color: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default SimpleMarkdownViewer;
