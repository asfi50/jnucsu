import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { NotificationProvider } from "@/context/NotificationContext";
import {
  generateMetadata,
  generateStructuredData,
  KEYWORDS,
  combineKeywords,
} from "@/lib/seo";
import { AuthProvider } from "@/context/auth-context";
import { ServerDataProvider } from "@/components/providers/ServerDataProvider";
import { ReCaptchaProvider } from "@/context/recaptcha-context";
import { Suspense } from "react";
import OAuthHandler from "@/components/auth/OAuthHandler";
import { fetchServerSideData } from "@/lib/data/server-data";

// Using system fonts instead of Google Fonts for better reliability
const fontVariables =
  "--font-geist-sans: ui-sans-serif, system-ui, sans-serif; --font-geist-mono: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;";

export const metadata: Metadata = generateMetadata({
  title: "JnUCSU - Jagannath University Central Students' Union",
  description:
    "Official platform of Jagannath University Central Students' Union. Discover student leaders, read insightful articles, and engage with the vibrant campus community. Vote for your favorite candidates and stay updated with university news.",
  keywords: combineKeywords(KEYWORDS.general, KEYWORDS.leadership),
  type: "website",
  url: "/",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch server-side data
  const { positions, departments, categories, panels } =
    await fetchServerSideData();
  // Generate structured data for the organization
  const organizationStructuredData = generateStructuredData({
    type: "Organization",
    data: {
      name: "Jagannath University Central Students' Union",
      alternateName: "JnUCSU",
      description:
        "The official central students' union of Jagannath University, representing student interests and fostering campus leadership.",
      foundingDate: "1968",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BD",
        addressLocality: "Dhaka",
        streetAddress: "Jagannath University, Dhaka-1100",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "General Inquiries",
        email: "info@jnucsu.org",
      },
    },
  });

  const websiteStructuredData = generateStructuredData({
    type: "WebSite",
    data: {},
  });

  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{ __html: `:root { ${fontVariables} }` }}
        />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body className="antialiased min-h-screen font-sans bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <ReCaptchaProvider>
          <AuthProvider>
            <ServerDataProvider
              initialPositions={positions}
              initialDepartments={departments}
              initialCategories={categories}
              initialPanels={panels}
            >
              <NotificationProvider>
                <ToastProvider>
                  <Suspense fallback={null}>
                    <OAuthHandler />
                  </Suspense>
                  {children}
                </ToastProvider>
              </NotificationProvider>
            </ServerDataProvider>
          </AuthProvider>
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
