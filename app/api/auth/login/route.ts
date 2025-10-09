//email,password coming and password contains hashed password;doing login features

import { config } from "@/config";
import { signJWT } from "@/lib/jwt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { email, password, isRememberMe } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Fetch user from Directus by email
    const response = await fetch(`${config.serverBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const data = await response.json();

    const access_token = data.data.access_token;
    const decodedToken = jwt.decode(access_token) as {
      role: string;
      id: string;
    };

    if (!decodedToken || !decodedToken.role) {
      return NextResponse.json(
        { message: "Invalid token", details: decodedToken },
        { status: 401 }
      );
    }
    if (decodedToken.role !== config.studentRole) {
      return NextResponse.json({ error: "Unauthorized role" }, { status: 403 });
    }

    const userId = decodedToken.id;
    const profileResponse = await fetch(
      `${config.serverBaseUrl}/items/profile?filter[user][_eq]=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`, // Admin token
        },
      }
    );

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 401 }
      );
    }

    const profileData = await profileResponse.json();
    if (profileData.data.length === 0) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }
    // Create JWT token
    const token = signJWT(
      {
        userId: userId,
        profileId: profileData.data[0].id,
      },
      isRememberMe ? "30d" : "1d"
    );
    return NextResponse.json(
      {
        message: "Login successful",
        data: {
          access_token: token,
          user: {
            id: userId,
            profileId: profileData.data[0].id,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Login error:", error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message: string }).message
        : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
