import { NextResponse } from "next/server";
import config from "@/config";

const { serverBaseUrl, adminToken } = config;

export async function POST(request: Request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prepare the payload for Directus
    const payload = {
      email,
      password,
      first_name: fullName,
      last_name: "",
      role: "9708200e-3280-47af-ac3d-58c756bdf6b0",
    };

    // Save user in Directus
    const response = await fetch(`${serverBaseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`, // Admin token
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.errors?.[0]?.message || "Failed to register user" }, { status: response.status });
    }

    // Create JWT token

    return NextResponse.json({ message: "User registered successfully", user: data.data }, { status: 201 });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}
