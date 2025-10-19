import { config } from "@/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `${config.serverBaseUrl}/items/panel?filter[status][_eq]=published&fields=id,name,logo,banner,mission,vision&sort=name`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch panels: ${res.statusText}`);
    }

    const { data } = await res.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Error fetching panels:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch panels",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
