"use client";

import React, { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import {
  Type,
  Palette,
  Settings,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import "highlight.js/styles/github.css";

interface ProductionMarkdownViewerProps {
  content: string;
  showControls?: boolean;
  initialTheme?: "light" | "dark";
  initialFontSize?: "small" | "medium" | "large" | "xl";
  className?: string;
}

type FontSize = "small" | "medium" | "large" | "xl";
type Theme = "light" | "dark";

const fontSizeClasses = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  xl: "text-xl",
};

const ProductionMarkdownViewer: React.FC<ProductionMarkdownViewerProps> = ({
  content,
  showControls = true,
  initialTheme = "light",
  initialFontSize = "medium",
  className = "",
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [fontSize, setFontSize] = useState<FontSize>(initialFontSize);
  const [showControlPanel, setShowControlPanel] = useState(false);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize);
  };

  const resetSettings = () => {
    setTheme("light");
    setFontSize("medium");
  };

  const increaseFontSize = () => {
    const sizes: FontSize[] = ["small", "medium", "large", "xl"];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes: FontSize[] = ["small", "medium", "large", "xl"];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  return (
    <div className={`production-markdown-container ${className}`}>
      {/* Control Panel */}
      {showControls && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Theme Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Theme:
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`p-2 rounded ${
                      theme === "light"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    } transition-colors`}
                    title="Light theme"
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`p-2 rounded ${
                      theme === "dark"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    } transition-colors`}
                    title="Dark theme"
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Font Size Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Font:</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={decreaseFontSize}
                    disabled={fontSize === "small"}
                    className="p-2 rounded bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Decrease font size"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 py-1 bg-white rounded text-sm font-medium text-gray-700 min-w-[4rem] text-center">
                    {fontSize}
                  </span>
                  <button
                    onClick={increaseFontSize}
                    disabled={fontSize === "xl"}
                    className="p-2 rounded bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Increase font size"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Controls Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowControlPanel(!showControlPanel)}
                className="p-2 rounded bg-white text-gray-600 hover:bg-gray-100 transition-colors"
                title="Advanced settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={resetSettings}
                className="p-2 rounded bg-white text-gray-600 hover:bg-gray-100 transition-colors"
                title="Reset to defaults"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Advanced Control Panel */}
          {showControlPanel && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Font Size Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Type className="w-4 h-4 inline mr-1" />
                    Font Size
                  </label>
                  <select
                    value={fontSize}
                    onChange={(e) =>
                      handleFontSizeChange(e.target.value as FontSize)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xl">Extra Large</option>
                  </select>
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette className="w-4 h-4 inline mr-1" />
                    Color Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => handleThemeChange(e.target.value as Theme)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Markdown Content */}
      <div
        className={`markdown-content-wrapper ${fontSizeClasses[fontSize]} ${
          theme === "dark" ? "bg-gray-900 rounded-lg p-6" : ""
        }`}
        data-color-mode={theme}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            h1: ({ children }) => (
              <h1
                className={`text-3xl font-bold mb-4 mt-6 pb-2 border-b-2 border-orange-500 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2
                className={`text-2xl font-semibold mb-3 mt-5 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                className={`text-xl font-semibold mb-2 mt-4 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4
                className={`text-lg font-semibold mb-2 mt-3 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p
                className={`mb-4 leading-relaxed text-justify ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {children}
              </p>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-orange-600 hover:text-orange-700 underline font-medium"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={
                  href?.startsWith("http") ? "noopener noreferrer" : undefined
                }
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote
                className={`border-l-4 border-orange-500 pl-4 py-2 my-4 italic ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-orange-50 text-gray-700"
                }`}
              >
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
                  className={`px-1 py-0.5 rounded text-sm font-mono ${
                    theme === "dark"
                      ? "bg-gray-700 text-yellow-400"
                      : "bg-gray-100 text-red-600"
                  }`}
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
              <ul
                className={`list-disc list-inside mb-4 space-y-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol
                className={`list-decimal list-inside mb-4 space-y-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table
                  className={`min-w-full border-collapse border rounded-lg shadow-sm ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-800"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-orange-500 text-white">{children}</thead>
            ),
            th: ({ children }) => (
              <th
                className={`border px-4 py-2 text-left font-semibold ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                }`}
              >
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td
                className={`border px-4 py-2 ${
                  theme === "dark"
                    ? "border-gray-600 text-gray-300"
                    : "border-gray-300"
                }`}
              >
                {children}
              </td>
            ),
            tr: ({ children }) => (
              <tr
                className={`transition-colors ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-orange-50"
                }`}
              >
                {children}
              </tr>
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
          {content || "No content available"}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ProductionMarkdownViewer;
