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

    if (!res.ok) {
      return NextResponse.json(
        {
          message: "Failed to fetch application data",
        },
        { status: res.status }
      );
    }
    const { data } = await res.json();

    const views = data.views || 0;
    const updatedViews = views + 1;

    await fetch(`${config.serverBaseUrl}/items/profile/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
      body: JSON.stringify({
        views: updatedViews,
      }),
    });

    const formattedData = formatCandidateApiResponse(data);
    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
