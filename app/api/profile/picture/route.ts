import { config } from "@/config";
import { NextResponse } from "next/server";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { uploadImageFromBase64 } from "@/lib/utils/image-upload";

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

    if (!data.hasOwnProperty("imageData") || !data.imageData) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    // Validate base64 image data
    if (!data.imageData.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image data format" },
        { status: 400 }
      );
    }

    let imageUrl: string;
    try {
      imageUrl = await uploadImageFromBase64(data.imageData, "profile-images");
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload profile image" },
        { status: 500 }
      );
    }

    const payload = {
      image: imageUrl,
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
            result.errors?.[0]?.message || "Failed to update profile picture",
          details: result.errors,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: "Profile picture updated successfully",
        result: true,
        imageUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile picture update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile picture", details: error },
      { status: 500 }
    );
  }
}
