import { config } from "@/config";
import { NextResponse } from "next/server";

export interface Developer {
  name: string;
  title: string;
  description: string;
  image: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

export async function GET() {
  try {
    const res = await fetch(
      `${config.serverBaseUrl}/items/developers_team?fields=name,title,description,image,github,linkedin,email&sort=order`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch developers" },
        { status: res.status }
      );
    }

    const { data } = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
