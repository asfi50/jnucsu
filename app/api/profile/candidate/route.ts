import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";
import { mapApiResponseToCandidateProfile } from "./structure";

export async function GET(req: Request) {
  const authResult = await VerifyAuthToken(req);
  if (authResult instanceof Response) return authResult;
  const { token, info } = authResult;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!info.userId || !info.profileId) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  try {
    const candidateRes = await fetch(
      `${config.serverBaseUrl}/items/candidate_page?filter[profile][_eq]=${info.profileId}&fields=*,user.*,profile.*.*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );
    const candidateData = await candidateRes.json();
    if (candidateData.data.length === 0) {
      return NextResponse.json(
        { message: "Candidate profile not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      mapApiResponseToCandidateProfile(candidateData.data[0]),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching candidate profile:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
