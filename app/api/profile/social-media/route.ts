import { config } from "@/config";
import { NextResponse } from "next/server";
import { VerifyAuthToken } from "@/middleware/verify-token";

export async function PATCH(req: Request) {
  const authResult = await VerifyAuthToken(req);
  if (authResult instanceof Response) return authResult;
  const { token, info } = authResult;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!info.userId) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  try {
    const data = await req.json();

    if (!data.hasOwnProperty("links") || typeof data.links !== "object") {
      return NextResponse.json(
        { error: "Links object is required" },
        { status: 400 }
      );
    }

    // Extract username from URL helper function
    function extractUsernameFromUrl(url: string, type: string): string {
      if (!url) return "";

      // If it's already just a username (no protocol), return as is
      if (!url.includes("http") && !url.includes("//")) {
        return url.replace(/^@/, ""); // Remove @ prefix if present
      }

      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;

        switch (type) {
          case "facebook":
            // Extract from facebook.com/username or fb.me/username
            return pathname.split("/").filter((part) => part)[0] || "";
          case "instagram":
            // Extract from instagram.com/username
            return pathname.split("/").filter((part) => part)[0] || "";
          case "linkedin":
            // Extract from linkedin.com/in/username
            const parts = pathname.split("/").filter((part) => part);
            return parts[1] || parts[0] || ""; // Skip 'in' if present
          case "website":
            // For website, store the full URL
            return url;
          default:
            return pathname.split("/").filter((part) => part)[0] || "";
        }
      } catch {
        // If URL parsing fails, assume it's a username
        return url.replace(/^@/, "");
      }
    }

    // Validate social media data
    const validTypes = ["facebook", "linkedin", "instagram", "website"];
    const links = data.links;

    // Process each link and extract username
    const processedLinks: Record<string, string | null> = {};

    for (const [type, input] of Object.entries(links)) {
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: `Invalid social media type: ${type}` },
          { status: 400 }
        );
      }

      if (input && typeof input === "string" && input.trim() !== "") {
        // For website, validate as URL. For others, extract username
        if (type === "website") {
          try {
            new URL(input);
            processedLinks[type] = input;
          } catch {
            return NextResponse.json(
              { error: `Invalid URL for ${type}: ${input}` },
              { status: 400 }
            );
          }
        } else {
          // Extract username from URL or use as-is if it's already a username
          const username = extractUsernameFromUrl(input, type);
          processedLinks[type] = username || null;
        }
      } else {
        processedLinks[type] = null;
      }
    }

    // Prepare payload - store as JSON in links field for Directus
    const payload = {
      links: {
        facebook: processedLinks.facebook || null,
        linkedin: processedLinks.linkedin || null,
        instagram: processedLinks.instagram || null,
        website: processedLinks.website || null,
      },
    };

    const response = await fetch(
      `${config.serverBaseUrl}/items/profile/${info.profileId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            result.errors?.[0]?.message ||
            "Failed to update social media links",
          details: result.errors,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Social media links updated successfully", result: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update social media links", details: error },
      { status: 500 }
    );
  }
}
