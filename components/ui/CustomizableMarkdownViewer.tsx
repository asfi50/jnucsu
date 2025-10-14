"use client";

import React, { useState } from "react";
import MarkdownViewer from "./MarkdownViewer";
import {
  Type,
  Palette,
  Settings,
  Eye,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface CustomizableMarkdownViewerProps {
  content: string;
  showControls?: boolean;
  initialTheme?: "light" | "dark";
  initialFontSize?: "small" | "medium" | "large" | "xl";
  className?: string;
}

type FontSize = "small" | "medium" | "large" | "xl";
type Theme = "light" | "dark";

const fontSizeMap = {
  small: "0.875rem",
  medium: "1rem",
  large: "1.125rem",
  xl: "1.25rem",
};

const CustomizableMarkdownViewer: React.FC<CustomizableMarkdownViewerProps> = ({
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
    <div className={`customizable-markdown-container ${className}`}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

                {/* Reading Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Eye className="w-4 h-4 inline mr-1" />
                    Reading Mode
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="reading-mode"
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label
                      htmlFor="reading-mode"
                      className="text-sm text-gray-600"
                    >
                      Focus mode
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Markdown Content */}
      <div
        className="markdown-content-wrapper"
        style={{
          fontSize: fontSizeMap[fontSize],
        }}
      >
        <MarkdownViewer
          content={content}
          theme={theme}
          className={`customizable-markdown ${theme}-theme font-size-${fontSize}`}
          height="auto"
        />
      </div>

      {/* Custom Styles for Different Font Sizes and Themes */}
      <style jsx global>{`
        .customizable-markdown-container .markdown-content-wrapper {
          transition: font-size 0.3s ease;
        }

        .customizable-markdown.font-size-small .wmde-markdown {
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .customizable-markdown.font-size-medium .wmde-markdown {
          font-size: 1rem;
          line-height: 1.6;
        }

        .customizable-markdown.font-size-large .wmde-markdown {
          font-size: 1.125rem;
          line-height: 1.7;
        }

        .customizable-markdown.font-size-xl .wmde-markdown {
          font-size: 1.25rem;
          line-height: 1.8;
        }

        /* Dark theme enhancements */
        .customizable-markdown.dark-theme {
          background-color: #1f2937;
          border-radius: 0.5rem;
          padding: 1.5rem;
        }

        .customizable-markdown.light-theme {
          background-color: transparent;
        }

        /* Reading mode styles */
        .reading-mode .customizable-markdown-container {
          max-width: 65ch;
          margin: 0 auto;
        }

        /* Smooth transitions */
        .customizable-markdown * {
          transition: color 0.3s ease, background-color 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default CustomizableMarkdownViewer;
