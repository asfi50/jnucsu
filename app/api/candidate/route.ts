import { config } from "@/config";
import { NextResponse } from "next/server";
import { flattenCandidate } from "./format";

export async function GET() {
  try {
    const fields = [
      "id",
      "profile.id",
      "profile.name",
      "profile.image",
      "profile.department.name",
      "profile.academic_year",
      "position.name",
      "profile.comments.id",
      "profile.student_id",
      "biography",
    ];
    const res = await fetch(
      `${
        config.serverBaseUrl
      }/items/candidate_page?filter[status][_eq]=approved&filter[isParticipating][_eq]=true&sort=profile.name&fields=${fields.join(
        ","
      )}&limit=-1`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch candidates: ${res.statusText}`);
    }
    const { data } = await res.json();
    return NextResponse.json(flattenCandidate(data), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch candidates",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
