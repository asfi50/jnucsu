import { config } from "@/config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const payload = {
      ...data,
      student_id: data.studentId || null,
      academic_year: data.year || null,
      department: data.did ? data.did : null,
      facebook: data.links?.facebook || null,
      linkedin: data.links?.linkedin || null,
      instagram: data.links?.instagram || null,
      twitter: data.links?.twitter || null,
      website: data.links?.website || null,
    };
    const response = await fetch(
      `${config.serverBaseUrl}/items/profile/${data.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`, // Admin token
        },
        body: JSON.stringify(payload),
      }
    );
    const result = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: result.errors?.[0]?.message || "Failed to update profile" },
        { status: response.status }
      );
    }
    return NextResponse.json(
      { message: "Profile updated successfully", result: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create profile", details: error },
      { status: 500 }
    );
  }
}
