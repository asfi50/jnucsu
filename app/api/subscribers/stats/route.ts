import { config } from "@/config";
import { VerifyAdminToken } from "@/middleware/verify-admin";
import { NextResponse } from "next/server";
import { Subscriber } from "@/lib/types/subscribers.types";

// GET - Get subscriber statistics (admin only)
export async function GET(req: Request) {
  // Verify admin authentication
  const authResult = await VerifyAdminToken(req);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    // Fetch all subscribers for statistics
    const res = await fetch(
      `${config.serverBaseUrl}/items/subscribers?fields=id,email,date_created,status,is_active&sort=-date_created`,
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

    // Calculate statistics
    const total = data.length;
    const active = data.filter((sub: Subscriber) => sub.is_active).length;
    const inactive = total - active;

    // Status breakdown
    const statusBreakdown = {
      published: data.filter((sub: Subscriber) => sub.status === "published")
        .length,
      draft: data.filter((sub: Subscriber) => sub.status === "draft").length,
      archived: data.filter((sub: Subscriber) => sub.status === "archived")
        .length,
    };

    // Growth statistics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSubscribers = data.filter(
      (sub: Subscriber) => new Date(sub.date_created) >= thirtyDaysAgo
    );

    // Weekly breakdown for the last 4 weeks
    const weeklyGrowth = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i * 7);

      const weeklyCount = data.filter((sub: Subscriber) => {
        const createdDate = new Date(sub.date_created);
        return createdDate >= weekStart && createdDate < weekEnd;
      }).length;

      weeklyGrowth.unshift({
        week: `Week ${4 - i}`,
        start_date: weekStart.toISOString().split("T")[0],
        end_date: weekEnd.toISOString().split("T")[0],
        new_subscribers: weeklyCount,
      });
    }

    // Most recent subscribers
    const recentTop10 = data
      .sort(
        (a: Subscriber, b: Subscriber) =>
          new Date(b.date_created).getTime() -
          new Date(a.date_created).getTime()
      )
      .slice(0, 10)
      .map((sub: Subscriber) => ({
        id: sub.id,
        email: sub.email,
        date_created: sub.date_created,
        status: sub.status,
        is_active: sub.is_active,
      }));

    return NextResponse.json(
      {
        overview: {
          total_subscribers: total,
          active_subscribers: active,
          inactive_subscribers: inactive,
          activity_rate:
            total > 0 ? ((active / total) * 100).toFixed(2) + "%" : "0%",
        },
        status_breakdown: statusBreakdown,
        growth_analytics: {
          last_30_days: recentSubscribers.length,
          weekly_breakdown: weeklyGrowth,
          average_weekly_growth:
            weeklyGrowth.length > 0
              ? (
                  weeklyGrowth.reduce(
                    (sum, week) => sum + week.new_subscribers,
                    0
                  ) / weeklyGrowth.length
                ).toFixed(1)
              : "0",
        },
        recent_subscribers: recentTop10,
        generated_at: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
