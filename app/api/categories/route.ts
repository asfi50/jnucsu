import { config } from "@/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `${config.serverBaseUrl}/items/category?fields=id,text`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch categories" }),
        { status: res.status }
      );
    }

    const { data } = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
