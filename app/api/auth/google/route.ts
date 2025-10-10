import { config } from "@/config";
import { NextRequest, NextResponse } from "next/server";

// GET: Redirect to Google OAuth
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get("redirect") || request.nextUrl.origin;

    // Redirect directly to Directus Google OAuth endpoint
    const directusOAuthUrl = `${
      config.serverBaseUrl
    }/auth/login/google?redirect=${encodeURIComponent(redirectUrl)}`;

    return NextResponse.redirect(directusOAuthUrl);
  } catch (error: unknown) {
    console.error("Google OAuth redirect error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Google OAuth" },
      { status: 500 }
    );
  }
}

// POST: Handle OAuth callback/token exchange
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, state } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    // Exchange the authorization code for tokens via Directus
    const res = await fetch(`${config.serverBaseUrl}/auth/login/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        state,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Google OAuth error:", data);
      return NextResponse.json(
        { error: data.message || "Google authentication failed" },
        { status: res.status }
      );
    }

    // Return the authentication data (access_token, refresh_token, user info)
    return NextResponse.json({
      success: true,
      data: {
        access_token: data.data.access_token,
        refresh_token: data.data.refresh_token,
        expires: data.data.expires,
        user: data.data.user,
      },
    });
  } catch (error: unknown) {
    console.error("Google OAuth error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
