import { config } from "@/config";
import { signJWT } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare the payload for Directus
    const payload = {
      email,
      password,
      first_name: fullName,
      role: config.studentRole,
    };

    // Save user in Directus
    const response = await fetch(`${config.serverBaseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`, // Admin token
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errors?.[0]?.message || "Failed to register user" },
        { status: response.status }
      );
    }

    const createProfileResponse = await fetch(
      `${config.serverBaseUrl}/items/profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`, // Admin token
        },
        body: JSON.stringify({
          user: data.data.id,
          name: fullName,
        }),
      }
    );

    const profileData = await createProfileResponse.json();

    if (!createProfileResponse.ok) {
      return NextResponse.json(
        {
          error: profileData.errors?.[0]?.message || "Failed to create profile",
        },
        { status: createProfileResponse.status }
      );
    }

    // Create JWT token
    const token = signJWT(
      {
        userId: data.data.id,
        profileId: profileData.data.id,
      },
      "7d"
    );

    return NextResponse.json(
      {
        message: "User registered successfully",
        data: {
          access_token: token,
          user: { id: data.data.id, profileId: profileData.data.id },
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
