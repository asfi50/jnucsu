import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Users, Shield } from "lucide-react";
import { Metadata } from "next";
import { config } from "@/config";
import { notFound } from "next/navigation";
import PanelDetailsClient from "@/components/panel/PanelDetailsClient";
import { Panel } from "@/lib/types/panel";

// Server-side data fetching
async function fetchPanelDetails(id: string): Promise<Panel | null> {
  try {
    const response = await fetch(`${config.clientUrl}/api/panel/${id}`, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error("Failed to fetch panel details:", response.statusText);
      return null;
    }

    const panelData = await response.json();
    return panelData;
  } catch (error) {
    console.error("Error fetching panel details:", error);
    return null;
  }
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const panel = await fetchPanelDetails(id);

  if (!panel) {
    return {
      title: "Panel Not Found",
      description: "The requested panel could not be found.",
    };
  }

  return {
    title: `${panel.name} - Political Panel`,
    description: `Meet the members of ${panel.name}. ${
      panel.mission || `View candidates and their positions in ${panel.name}.`
    }`,
    keywords: [
      "political panel",
      "student politics",
      "election candidates",
      panel.name,
      "JnUCSU",
      "Jagannath University",
    ],
    openGraph: {
      title: `${panel.name} - Political Panel`,
      description: panel.mission || `Members and candidates of ${panel.name}`,
      type: "website",
      url: `/panel/${id}`,
      images: panel.banner ? [{ url: panel.banner }] : [],
    },
  };
}

export default async function PanelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const panelData = await fetchPanelDetails(id);

  // If panel not found, show 404
  if (!panelData) {
    notFound();
  }

  // If no members are found, show a message
  if (!panelData.members || panelData.members.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Panel Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                {panelData.name}
              </h1>
            </div>
            {panelData.mission && (
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                <h2 className="text-lg font-semibold text-orange-800 mb-2">
                  Mission
                </h2>
                <p className="text-orange-700">{panelData.mission}</p>
              </div>
            )}
            {panelData.vision && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">
                  Vision
                </h2>
                <p className="text-blue-700">{panelData.vision}</p>
              </div>
            )}
          </div>

          {/* No Members Message */}
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Active Members
            </h3>
            <p className="text-gray-600 mb-6">
              This panel currently has no approved members participating in the
              election. Please check back later.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Panel Header */}
        <div className="mb-8">
          {/* Panel Title and Info */}
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              {panelData.name}
            </h1>
          </div>

          {/* Mission and Vision */}
          {panelData.mission && (
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
              <h2 className="text-lg font-semibold text-orange-800 mb-2">
                Mission
              </h2>
              <p className="text-orange-700">{panelData.mission}</p>
            </div>
          )}

          {panelData.vision && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                Vision
              </h2>
              <p className="text-blue-700">{panelData.vision}</p>
            </div>
          )}
        </div>
        {/* Panel Members Client Component */}
        return <PanelDetailsClient panelData={panelData} />;
      </div>

      <Footer />
    </div>
  );
}
