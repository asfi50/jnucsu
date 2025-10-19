import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const authResult = await VerifyAuthToken(request);
  if (authResult instanceof Response) return authResult;
  const { token, info } = authResult;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!info.userId || !info.profileId) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";

    if (!file) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: `jnucsu/gallery/${info.profileId}`,
            public_id: `gallery_${Date.now()}`,
            transformation: [
              { quality: "auto", fetch_format: "auto" },
              { width: 1200, height: 800, crop: "limit" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("Upload failed without error"));
          }
        )
        .end(buffer);
    });

    // Save to database
    const res = await fetch(`${config.serverBaseUrl}/items/gallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
      body: JSON.stringify({
        title: title?.trim() || "Untitled",
        description: description?.trim() || "",
        url: uploadResult.secure_url,
        user: info.profileId,
        user_created: info.userId,
        user_updated: info.userId,
        cloudinary_public_id: uploadResult.public_id,
      }),
    });

    if (!res.ok) {
      // If database save fails, try to delete the uploaded image
      try {
        await cloudinary.uploader.destroy(uploadResult.public_id);
      } catch (cleanupError) {
        console.error("Failed to cleanup uploaded image:", cleanupError);
      }

      return NextResponse.json(
        { message: "Failed to save gallery item to database" },
        { status: res.status }
      );
    }

    const { data } = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
