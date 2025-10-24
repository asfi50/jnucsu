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

    // Validate input data
    const allowedFields = [
      "name",
      "phone",
      "studentId",
      "did",
      "year",
      "address",
    ];
    const payload: Record<string, string | null> = {};

    // Only include provided fields in the payload
    allowedFields.forEach((field) => {
      if (data.hasOwnProperty(field)) {
        switch (field) {
          case "studentId":
            payload.student_id = data[field] || null;
            break;
          case "did":
            payload.department = data[field] || null;
            break;
          case "year":
            payload.academic_year = data[field] || null;
            break;
          default:
            payload[field] = data[field] || null;
        }
      }
    });

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

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
            result.errors?.[0]?.message || "Failed to update basic information",
          details: result.errors,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Basic information updated successfully", result: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Basic info update error:", error);
    return NextResponse.json(
      { error: "Failed to update basic information", details: error },
      { status: 500 }
    );
  }
}
