//email,password coming and password contains hashed password;doing login features

import { NextResponse } from "next/server";

import config from "@/config";
const { serverBaseUrl } = config;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Fetch user from Directus by email
    const response = await fetch(`${serverBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const data = await response.json();
    console.log("Login data:", data);
    const userResponse = await fetch(`${serverBaseUrl}/users/me?fields=*`, {
      headers: {
        Authorization: `Bearer ${data.data.access_token}`,
      },
    });

    const userData = await userResponse.json();
    console.log(userData);

    // Create JWT token
    return NextResponse.json({ message: "Login successful", user: userData, tokenData: data }, { status: 200 });
  } catch (error: unknown) {
    console.error("Login error:", error);
    const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error);
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}
