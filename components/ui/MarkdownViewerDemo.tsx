"use client";

import React, { useState } from "react";
import {
  MarkdownViewer,
  SimpleMarkdownViewer,
  CustomizableMarkdownViewer,
} from "./markdown";

const sampleMarkdown = `# Markdown Viewer Demo

Welcome to the **customizable markdown viewer** demonstration! This content showcases various markdown features.

## Features Showcase

### Text Formatting
- **Bold text** and *italic text*
- ~~Strikethrough text~~
- \`Inline code\` formatting
- [Links to external sites](https://github.com)

### Code Blocks

\`\`\`javascript
// JavaScript example
function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to the markdown viewer!\`;
}

greetUser("Developer");
\`\`\`

\`\`\`python
# Python example
def calculate_reading_time(content):
    words = len(content.split())
    reading_time = words / 200  # Average reading speed
    return f"{math.ceil(reading_time)} min read"
\`\`\`

### Lists and Organization

#### Unordered Lists
- Feature-rich markdown rendering
- Customizable themes (Light/Dark)
- Responsive design
- Syntax highlighting
  - Multiple language support
  - Clean code presentation
  - Copy-to-clipboard functionality

#### Ordered Lists
1. **Performance optimized** - Fast rendering
2. **Accessible** - Screen reader friendly
3. **Customizable** - Multiple viewer types
4. **Mobile responsive** - Works on all devices

### Tables

| Feature | BasicViewer | SimpleViewer | CustomizableViewer |
|---------|-------------|--------------|-------------------|
| Theme Support | ✅ | ✅ | ✅ |
| Font Controls | ❌ | ✅ | ✅ |
| User Controls | ❌ | ❌ | ✅ |
| Performance | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

### Blockquotes

> "The best way to predict the future is to create it." 
> 
> — Peter Drucker

### Images and Media

![Placeholder Image](https://via.placeholder.com/600x300/f97316/ffffff?text=Markdown+Image+Example)

---

## Usage Examples

Here's how you can implement each viewer type:

### 1. Basic Markdown Viewer
\`\`\`tsx
<MarkdownViewer
  content={markdownContent}
  theme="light"
  className="blog-content"
/>
\`\`\`

### 2. Simple Markdown Viewer
\`\`\`tsx
<SimpleMarkdownViewer
  content={markdownContent}
  fontSize="lg"
  theme="dark"
/>
\`\`\`

### 3. Customizable Markdown Viewer
\`\`\`tsx
<CustomizableMarkdownViewer
  content={markdownContent}
  showControls={true}
  initialTheme="light"
  initialFontSize="medium"
/>
\`\`\`

---

## Mathematical Expressions

When you need to display mathematical formulas:

The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

---

This demonstration shows the power and flexibility of our markdown rendering system. Choose the viewer that best fits your use case!`;

const MarkdownViewerDemo: React.FC = () => {
  const [activeViewer, setActiveViewer] = useState<
    "basic" | "simple" | "customizable"
  >("customizable");

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Markdown Viewer Demonstration
        </h1>
        <p className="text-lg text-gray-600">
          Compare different markdown viewers and their capabilities
        </p>
      </div>

      {/* Viewer Selector */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveViewer("basic")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeViewer === "basic"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Basic Viewer
        </button>
        <button
          onClick={() => setActiveViewer("simple")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeViewer === "simple"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Simple Viewer
        </button>
        <button
          onClick={() => setActiveViewer("customizable")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeViewer === "customizable"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Customizable Viewer
        </button>
      </div>

      {/* Viewer Display */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {activeViewer === "basic" && "Basic Markdown Viewer"}
            {activeViewer === "simple" && "Simple Markdown Viewer"}
            {activeViewer === "customizable" && "Customizable Markdown Viewer"}
          </h2>
          <p className="text-sm text-gray-600">
            {activeViewer === "basic" &&
              "Full-featured markdown rendering with comprehensive styling"}
            {activeViewer === "simple" &&
              "Lightweight, minimal markdown viewer optimized for performance"}
            {activeViewer === "customizable" &&
              "Advanced viewer with user controls and customization options"}
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {activeViewer === "basic" && (
            <MarkdownViewer
              content={sampleMarkdown}
              theme="light"
              className="demo-basic-viewer"
            />
          )}

          {activeViewer === "simple" && (
            <SimpleMarkdownViewer
              content={sampleMarkdown}
              theme="light"
              fontSize="base"
              className="demo-simple-viewer"
            />
          )}

          {activeViewer === "customizable" && (
            <CustomizableMarkdownViewer
              content={sampleMarkdown}
              showControls={true}
              initialTheme="light"
              initialFontSize="medium"
              className="demo-customizable-viewer"
            />
          )}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Feature Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Feature
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                  Basic
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                  Simple
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                  Customizable
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Theme Support
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ✅
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ✅
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ✅
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  Font Size Control
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ❌
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ✅
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ✅
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  User Controls
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ❌
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ❌
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ✅
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  Bundle Size
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  Medium
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  Small
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  Large
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Performance
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ⭐⭐⭐
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ⭐⭐⭐⭐
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ⭐⭐
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  Best Use Case
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  General content
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Comments, previews
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Blog posts, articles
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarkdownViewerDemo;
