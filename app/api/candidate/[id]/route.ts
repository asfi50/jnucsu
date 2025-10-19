import { config } from "@/config";
import { NextResponse } from "next/server";
import { formatCandidateApiResponse } from "./format";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const res = await fetch(
      `${config.serverBaseUrl}/items/profile/${id}?fields=*.*.*.*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error("Failed to fetch application data:", data);
      return NextResponse.json(
        { message: "Failed to fetch application data", error: res.statusText },
        { status: res.status }
      );
    }

    const formattedData = formatCandidateApiResponse(data.data);
    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
