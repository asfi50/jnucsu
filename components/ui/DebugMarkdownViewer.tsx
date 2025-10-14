"use client";

import React from "react";

interface DebugMarkdownViewerProps {
  content: string;
}

const DebugMarkdownViewer: React.FC<DebugMarkdownViewerProps> = ({
  content,
}) => {
  return (
    <div className="debug-markdown-viewer border-2 border-red-500 p-4 bg-yellow-50">
      <h3 className="text-lg font-bold text-red-600 mb-4">
        Debug: Raw Content
      </h3>
      <div className="bg-white p-4 border rounded">
        <strong>Content length:</strong> {content?.length || 0}
        <br />
        <strong>Content type:</strong> {typeof content}
        <br />
        <strong>First 200 chars:</strong>
        <pre className="text-xs bg-gray-100 p-2 mt-2 overflow-auto">
          {content?.substring(0, 200) || "No content"}
        </pre>
      </div>

      <h3 className="text-lg font-bold text-red-600 mb-4 mt-6">
        Debug: Rendered as HTML
      </h3>
      <div className="bg-white p-4 border rounded">
        <div dangerouslySetInnerHTML={{ __html: content || "No content" }} />
      </div>

      <h3 className="text-lg font-bold text-red-600 mb-4 mt-6">
        Debug: Rendered as Text
      </h3>
      <div className="bg-white p-4 border rounded whitespace-pre-wrap">
        {content || "No content"}
      </div>
    </div>
  );
};

export default DebugMarkdownViewer;
