'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  height?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  label,
  error,
  height = 400
}: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div 
          className="w-full border border-gray-300 rounded-lg p-4 bg-gray-50"
          style={{ height: `${height}px` }}
        >
          <p className="text-gray-400 text-sm">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2" data-color-mode="light">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className={error ? 'border-2 border-red-300 rounded-lg' : ''}>
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          preview="edit"
          height={height}
          textareaProps={{
            placeholder: placeholder,
          }}
          previewOptions={{
            rehypePlugins: [],
          }}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
