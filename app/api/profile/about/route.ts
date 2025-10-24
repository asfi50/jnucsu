import { config } from "@/config";
import { NextResponse } from "next/server";
import { VerifyAuthToken } from "@/middleware/verify-token";

export async function PATCH(req: Request) {
  const authResult = await VerifyAuthToken(req);
  if (authResult instanceof Response) return authResult;
  const { token, info } = authResult;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!info.userId) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  try {
    const data = await req.json();

    if (!data.hasOwnProperty("about")) {
      return NextResponse.json(
        { error: "About field is required" },
        { status: 400 }
      );
    }

    const payload = {
      about: data.about || "",
    };

    const response = await fetch(
      `${config.serverBaseUrl}/items/profile/${info.profileId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            result.errors?.[0]?.message || "Failed to update about section",
          details: result.errors,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "About section updated successfully", result: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("About update error:", error);
    return NextResponse.json(
      { error: "Failed to update about section", details: error },
      { status: 500 }
    );
  }
}
