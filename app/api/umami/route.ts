import { type NextRequest, NextResponse } from "next/server";
import {
  getPageViewsByDataRange,
  getWebsiteStats,
  getAllWebsiteData,
} from "@/services/umami";

export const dynamic = 'force-dynamic';

// Helper untuk format stat individu agar sama dengan format 'All'
const formatIndividualStats = (stats: any) => {
  const getValue = (obj: any) => (typeof obj === 'number' ? obj : obj?.value || 0);
  return {
    pageviews: { value: getValue(stats?.pageviews) },
    visitors: { value: getValue(stats?.visitors) },
    visits: { value: getValue(stats?.visits) },
    countries: { value: getValue(stats?.countries) },
    events: { value: getValue(stats?.events) },
  };
};

export const GET = async (req: NextRequest) => {
  try {
    const domain = req.nextUrl.searchParams.get("domain");

    if (domain === "all" || !domain) {
      const combinedData = await getAllWebsiteData();
      return NextResponse.json(combinedData, { status: 200 });
    }

    const pageViews = await getPageViewsByDataRange(domain);
    const stats = await getWebsiteStats(domain);

    return NextResponse.json(
      {
        pageviews: pageViews.data.pageviews || [],
        sessions: pageViews.data.sessions || [],
        websiteStats: formatIndividualStats(stats.data),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};