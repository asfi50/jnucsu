//email,password coming and password contains hashed password;doing login features

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "@/config";
const { serverBaseUrl, adminToken, jwtSecret } = config;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Fetch user from Directus by email
    const response = await fetch(`${serverBaseUrl}/items/users?filter[email][_eq]=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`, // Admin token
      },
    });
    const data = await response.json();
    if (!response.ok || data.data.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const user = data.data[0];
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    // Create JWT token
    const token = await jwt.sign({ id: user.id, email: user.email }, jwtSecret as string, { expiresIn: "7d" });
    return NextResponse.json({ message: "Login successful", user, token }, { status: 200 });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
