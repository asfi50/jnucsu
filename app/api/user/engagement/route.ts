// This API endpoint is deprecated as of [current date]
// User engagement data (reacted blogs and voted candidates) is now included
// directly in the /api/profile/me endpoint and available in the auth context's userProfile
// No separate API call is needed anymore - use userProfile.reacted and userProfile.voted

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message:
        "This API endpoint is deprecated. Use /api/profile/me instead - user engagement data is included there.",
      deprecated: true,
      alternative: "/api/profile/me",
      data: {
        reacted: [],
        voted: [],
      },
    },
    { status: 410 } // 410 Gone status code for deprecated endpoints
  );
}
