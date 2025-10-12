import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
    const res = await fetch(
      `${config.serverBaseUrl}/items/gallery?filter[user][_eq]=${info.profileId}&fields=id,title,description,url,date_created,date_updated&sort=-date_created`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch gallery items" },
        { status: res.status }
      );
    }

    const { data } = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

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
    const body = await request.json();
    const { title, description, url } = body;
    if (!title || !description || !url) {
      return NextResponse.json(
        { message: "Title, description, and URL are required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${config.serverBaseUrl}/items/gallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
      body: JSON.stringify({
        title,
        description,
        url,
        user: info.profileId,
        user_created: info.userId,
        user_updated: info.userId,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to add gallery item" },
        { status: res.status }
      );
    }

    const { data } = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
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

    // Verify ownership of the gallery item
    const verifyRes = await fetch(
      `${config.serverBaseUrl}/items/gallery/${itemId}?fields=user.id`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!verifyRes.ok) {
      return NextResponse.json(
        { message: "Failed to verify gallery item" },
        { status: verifyRes.status }
      );
    }

    const { data: verifyData } = await verifyRes.json();
    if (verifyData.user.id !== info.profileId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Proceed to delete the gallery item
    const deleteRes = await fetch(
      `${config.serverBaseUrl}/items/gallery/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!deleteRes.ok) {
      return NextResponse.json(
        { message: "Failed to delete gallery item" },
        { status: deleteRes.status }
      );
    }

    return NextResponse.json(
      { message: "Gallery item deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const { title, description, url } = body;
    if (!title || !description || !url) {
      return NextResponse.json(
        { message: "Title, description, and URL are required" },
        { status: 400 }
      );
    }

    // Verify ownership of the gallery item
    const verifyRes = await fetch(
      `${config.serverBaseUrl}/items/gallery/${itemId}?fields=user.id`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!verifyRes.ok) {
      return NextResponse.json(
        { message: "Failed to verify gallery item" },
        { status: verifyRes.status }
      );
    }

    const { data: verifyData } = await verifyRes.json();
    if (verifyData.user.id !== info.profileId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Proceed to update the gallery item
    const updateRes = await fetch(
      `${config.serverBaseUrl}/items/gallery/${itemId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          url,
          user_updated: info.userId,
        }),
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
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
