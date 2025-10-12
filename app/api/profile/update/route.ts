import { config } from "@/config";
import { NextResponse } from "next/server";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { uploadImageFromBase64 } from "@/lib/utils/image-upload";

export async function POST(req: Request) {
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

    // Handle image upload if new image data is provided
    let imageUrl = data.image; // Keep existing image if no new one
    if (data.newImageData && data.newImageData.startsWith("data:image/")) {
      try {
        imageUrl = await uploadImageFromBase64(
          data.newImageData,
          "profile-images"
        );
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload profile image" },
          { status: 500 }
        );
      }
    }

    const payload = {
      ...data,
      image: imageUrl, // Use the uploaded image URL or existing one
      student_id: data.studentId || null,
      academic_year: data.year || null,
      department: data.did ? data.did : null,
      facebook: data.links?.facebook || null,
      linkedin: data.links?.linkedin || null,
      instagram: data.links?.instagram || null,
      twitter: data.links?.twitter || null,
      website: data.links?.website || null,
      // Remove the newImageData from the payload
      newImageData: undefined,
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
