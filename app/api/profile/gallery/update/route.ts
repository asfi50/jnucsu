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

export async function PATCH(request: Request) {
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
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    if (!itemId) {
      return NextResponse.json(
        { message: "Item ID is required" },
        { status: 400 }
      );
    }

    // Get current item details
    const currentItemRes = await fetch(
      `${config.serverBaseUrl}/items/gallery/${itemId}?fields=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!currentItemRes.ok) {
      return NextResponse.json(
        { message: "Gallery item not found" },
        { status: 404 }
      );
    }

    const { data: currentItem } = await currentItemRes.json();

    // Verify ownership
    if (currentItem.user !== info.profileId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const contentType = request.headers.get("content-type");
    const updateData: {
      title?: string;
      description?: string;
      url?: string;
      cloudinary_public_id?: string;
      user_updated: string;
    } = {
      user_updated: info.userId,
    };

    if (contentType?.includes("multipart/form-data")) {
      // Handle form data with potential new image upload
      const formData = await request.formData();
      const file = formData.get("image") as File;
      const title = formData.get("title") as string;
      const description = (formData.get("description") as string) || "";

      updateData.title = title?.trim() || "Untitled";
      updateData.description = description.trim();

      // If new image is uploaded
      if (file && file.size > 0) {
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

        // Upload new image to Cloudinary
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

        updateData.url = uploadResult.secure_url;
        updateData.cloudinary_public_id = uploadResult.public_id;

        // Delete old image from Cloudinary if it exists
        if (currentItem.cloudinary_public_id) {
          try {
            await cloudinary.uploader.destroy(currentItem.cloudinary_public_id);
          } catch (deleteError) {
            console.error("Failed to delete old image:", deleteError);
          }
        }
      }
    } else {
      // Handle JSON data (title/description update only)
      const body = await request.json();
      const { title, description } = body;

      updateData.title = title?.trim() || "Untitled";
      updateData.description = description?.trim() || "";
    }

    // Update in database
    const updateRes = await fetch(
      `${config.serverBaseUrl}/items/gallery/${itemId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!updateRes.ok) {
      return NextResponse.json(
        { message: "Failed to update gallery item" },
        { status: updateRes.status }
      );
    }

    const { data } = await updateRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Gallery update error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
