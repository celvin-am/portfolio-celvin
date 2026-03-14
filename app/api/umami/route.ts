import { type NextRequest, NextResponse } from "next/server";
import {
  getPageViewsByDataRange,
  getWebsiteStats,
  getWebsiteMetrics,
  getAllWebsiteData,
} from "@/services/umami";

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  try {
    const domain = req.nextUrl.searchParams.get("domain");

    if (domain === "all" || !domain) {
      const combinedData = await getAllWebsiteData();
      return NextResponse.json(combinedData, { status: 200 });
    }

    const pageViews = await getPageViewsByDataRange(domain);
    const stats = await getWebsiteStats(domain);
    const countries = await getWebsiteMetrics(domain, "country");
    const events = await getWebsiteMetrics(domain, "event");
    const totalEvents = events.reduce((acc: number, curr: any) => acc + curr.y, 0);

    const pvs = [];
    const ss = [];
    // Menghasilkan 4 bulan terakhir secara dinamis
    for (let i = 3; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01 00:00:00`;
        
        const foundPv = pageViews.data.pageviews?.find((p: any) => p.x.substring(0, 7) === monthStr.substring(0, 7));
        const foundSs = pageViews.data.sessions?.find((s: any) => s.x.substring(0, 7) === monthStr.substring(0, 7));
        
        pvs.push({ x: monthStr, y: foundPv?.y || 0 });
        ss.push({ x: monthStr, y: foundSs?.y || 0 });
    }

    return NextResponse.json(
      {
        pageviews: pvs,
        sessions: ss,
        websiteStats: {
          pageviews: { value: stats.data?.pageviews?.value || stats.data?.pageviews || 0 },
          visitors: { value: stats.data?.visitors?.value || stats.data?.visitors || 0 },
          visits: { value: stats.data?.visits?.value || stats.data?.visits || 0 },
          countries: { value: countries.length || 0 },
          events: { value: totalEvents || 0 },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};