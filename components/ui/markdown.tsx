// Markdown Viewers Export
export { default as MarkdownViewer } from "./MarkdownViewer";
export { default as SimpleMarkdownViewer } from "./SimpleMarkdownViewer";
export { default as CustomizableMarkdownViewer } from "./CustomizableMarkdownViewer";
export { default as ReactMarkdownViewer } from "./ReactMarkdownViewer";
export { default as FallbackMarkdownViewer } from "./FallbackMarkdownViewer";
export { default as ProductionMarkdownViewer } from "./ProductionMarkdownViewer";

// 🎯 RECOMMENDED FOR PRODUCTION
export { default } from "./ProductionMarkdownViewer";

// Usage Examples:
//
// 🎯 PRODUCTION SOLUTION (RECOMMENDED):
// import ProductionMarkdownViewer from '@/components/ui/ProductionMarkdownViewer';
// // OR
// import MarkdownViewer from '@/components/ui/markdown'; // Default export
//
// <ProductionMarkdownViewer
//   content={markdownContent}
//   showControls={true}
//   initialTheme="light"
//   initialFontSize="medium"
//   className="blog-content"
// />
//
// Alternative Options:
//
// 1. Basic Markdown Viewer (@uiw/react-md-editor):
// import { MarkdownViewer } from '@/components/ui/markdown';
// <MarkdownViewer content={markdownContent} theme="light" />
//
// 2. Simple Markdown Viewer (react-markdown, minimal styling):
// import { ReactMarkdownViewer } from '@/components/ui/markdown';
// <ReactMarkdownViewer content={markdownContent} theme="light" />
//
// 3. Fallback Viewer (no dependencies, HTML parsing):
// import { FallbackMarkdownViewer } from '@/components/ui/markdown';
// <FallbackMarkdownViewer content={markdownContent} />
