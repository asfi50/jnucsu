import type { Metadata } from "next";
import "./globals.css";

// Using system fonts instead of Google Fonts for better reliability
const fontVariables = "--font-geist-sans: ui-sans-serif, system-ui, sans-serif; --font-geist-mono: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;";

export const metadata: Metadata = {
  title: "JnUCSU - Jagannath University Central Students' Union",
  description: "Coming Soon!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `:root { ${fontVariables} }` }} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
