import { type NextRequest, NextResponse } from "next/server";
import { getAllWebsiteData, getPageViewsByDataRange, getWebsiteStats, getWebsiteMetrics, getMonthPrefix } from "@/services/umami";

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
    const jakartaNow = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));

    for (let i = 3; i >= 0; i--) {
      const d = new Date(jakartaNow.getFullYear(), jakartaNow.getMonth() - i, 1);
      const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const key = `${prefix}-01 00:00:00`;

      // Filter yang aman dari bug timezone Vercel
      const valPv = pv.data.pageviews?.filter((p: any) => getMonthPrefix(p.x) === prefix)
                      .reduce((acc: number, curr: any) => acc + curr.y, 0) || 0;
      const valSs = pv.data.sessions?.filter((s: any) => getMonthPrefix(s.x) === prefix)
                      .reduce((acc: number, curr: any) => acc + curr.y, 0) || 0;

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