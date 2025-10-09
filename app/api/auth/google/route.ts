import { config } from "@/config";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await fetch(`${config.serverBaseUrl}/auth/login/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
