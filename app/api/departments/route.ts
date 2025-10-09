import { config } from "@/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${config.serverBaseUrl}/items/department`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch departments" },
        { status: res.status }
      );
    }

    const { data } = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
