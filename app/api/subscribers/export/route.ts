import { config } from "@/config";
import { VerifyAdminToken } from "@/middleware/verify-admin";
import { NextResponse } from "next/server";

// GET - Export subscribers data (admin only)
export async function GET(req: Request) {
  // Verify admin authentication
  const authResult = await VerifyAdminToken(req);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "json";
    const status = searchParams.get("status");
    const activeOnly = searchParams.get("active_only") === "true";

    // Build filter query
    const filters: string[] = [];

    if (status && status !== "all") {
      filters.push(`filter[status][_eq]=${status}`);
    }

    if (activeOnly) {
      filters.push(`filter[is_active][_eq]=true`);
    }

    const filterQuery = filters.length > 0 ? `&${filters.join("&")}` : "";

    // Fetch all subscribers
    const res = await fetch(
      `${config.serverBaseUrl}/items/subscribers?fields=id,email,date_created,date_updated,status,is_active&sort=-date_created${filterQuery}`,
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
        { error: "Failed to fetch subscribers" },
        { status: res.status }
      );
    }

    const { data } = await res.json();

    // Format data based on requested format
    switch (format) {
      case "csv": {
        const csvHeaders = [
          "ID",
          "Email",
          "Status",
          "Active",
          "Created",
          "Updated",
        ];
        const csvRows = data.map((sub: any) => [
          sub.id,
          sub.email,
          sub.status,
          sub.is_active ? "Yes" : "No",
          new Date(sub.date_created).toISOString(),
          sub.date_updated ? new Date(sub.date_updated).toISOString() : "",
        ]);

        const csvContent = [
          csvHeaders.join(","),
          ...csvRows.map((row: any[]) =>
            row
              .map((field) =>
                typeof field === "string" && field.includes(",")
                  ? `"${field}"`
                  : field
              )
              .join(",")
          ),
        ].join("\n");

        return new Response(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="subscribers_${
              new Date().toISOString().split("T")[0]
            }.csv"`,
          },
        });
      }

      case "xlsx": {
        // For XLSX, we'll return JSON with a specific structure that frontend can convert
        return NextResponse.json(
          {
            data: data.map((sub: any) => ({
              ID: sub.id,
              Email: sub.email,
              Status: sub.status,
              Active: sub.is_active ? "Yes" : "No",
              Created: new Date(sub.date_created).toISOString(),
              Updated: sub.date_updated
                ? new Date(sub.date_updated).toISOString()
                : "",
            })),
            filename: `subscribers_${
              new Date().toISOString().split("T")[0]
            }.xlsx`,
            format: "xlsx",
          },
          { status: 200 }
        );
      }

      case "json":
      default: {
        return NextResponse.json(
          {
            subscribers: data,
            exported_at: new Date().toISOString(),
            total_count: data.length,
            filters_applied: {
              status: status || "all",
              active_only: activeOnly,
            },
          },
          {
            headers: {
              "Content-Disposition": `attachment; filename="subscribers_${
                new Date().toISOString().split("T")[0]
              }.json"`,
            },
          }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to export subscribers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
