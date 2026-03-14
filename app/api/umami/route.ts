import { type NextRequest, NextResponse } from "next/server";
import { getAllWebsiteData, getPageViewsByDataRange, getWebsiteStats, getWebsiteMetrics } from "@/services/umami";

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  try {
    const domain = req.nextUrl.searchParams.get("domain");
    if (!domain || domain === "all") {
      return NextResponse.json(await getAllWebsiteData());
    }

    const [pv, st, co, ev] = await Promise.all([
      getPageViewsByDataRange(domain),
      getWebsiteStats(domain),
      getWebsiteMetrics(domain, "country"),
      getWebsiteMetrics(domain, "event")
    ]);

    const pvs: any[] = [];
    const sss: any[] = [];
    const now = new Date();

    // Buat 4 batang bulan (Des, Jan, Feb, Mar)
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01 00:00:00`;
      const prefix = key.substring(0, 7);

      const valPv = pv.data.pageviews?.find((p: any) => p.x.startsWith(prefix))?.y || 0;
      const valSs = pv.data.sessions?.find((s: any) => s.x.startsWith(prefix))?.y || 0;

      pvs.push({ x: key, y: valPv });
      sss.push({ x: key, y: valSs });
    }

    return NextResponse.json({
      pageviews: pvs,
      sessions: sss,
      websiteStats: {
        pageviews: { value: getValue(st.data?.pageviews) },
        visitors: { value: getValue(st.data?.visitors) },
        visits: { value: getValue(st.data?.visits) },
        countries: { value: (co || []).length },
        events: { value: (ev || []).reduce((acc: number, cur: any) => acc + (cur.y || 0), 0) }
      }
    });
  } catch (e) { return NextResponse.json({ error: "API Error" }, { status: 500 }); }
};

const getValue = (obj: any) => (typeof obj === 'number' ? obj : obj?.value || 0);