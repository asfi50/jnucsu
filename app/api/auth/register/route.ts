import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "@/config";

const { serverBaseUrl, adminToken, jwtSecret } = config;

export async function POST(request: Request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare the payload for Directus
    const payload = {
      fullName, // if using custom collection
      email,
      password: hashedPassword,
    };

    // Save user in Directus
    const response = await fetch(`${serverBaseUrl}/items/users`, {
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
    const token = await jwt.sign({ id: data.data.id, email: data.data.email }, jwtSecret as string, { expiresIn: "7d" });

    return NextResponse.json({ message: "User registered successfully", user: data.data, token }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
