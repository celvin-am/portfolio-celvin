import axios from "axios";
import { UMAMI_ACCOUNT } from "@/common/constants/umami";
import { UmamiResponse } from "@/common/types/umami";

const { api_key, endpoint, base_url, parameters, websites } = UMAMI_ACCOUNT;

const getWebsiteIdByDomain = (domain: string) => 
  websites.find((w) => w.domain === domain)?.website_id;

const getValue = (obj: any): number => {
  if (!obj) return 0;
  if (typeof obj === 'number') return obj;
  return obj.value ?? 0;
};

export const getPageViewsByDataRange = async (domain: string) => {
  const website_id = getWebsiteIdByDomain(domain);
  try {
    const response = await axios.get(`${base_url}/websites/${website_id}${endpoint.page_views}`, {
      headers: { "x-umami-api-key": api_key || "" },
      params: { ...parameters, endAt: Date.now() },
    });
    return { status: response.status, data: response.data };
  } catch (error) { return { status: 500, data: { pageviews: [], sessions: [] } }; }
};

export const getWebsiteStats = async (domain: string) => {
  const website_id = getWebsiteIdByDomain(domain);
  try {
    const response = await axios.get(`${base_url}/websites/${website_id}${endpoint.sessions}`, {
      headers: { "x-umami-api-key": api_key || "" },
      params: { startAt: parameters.startAt, endAt: Date.now() },
    });
    return { status: response.status, data: response.data };
  } catch (error) { return { status: 500, data: {} }; }
};

export const getWebsiteMetrics = async (domain: string, type: string) => {
  const website_id = getWebsiteIdByDomain(domain);
  try {
    const response = await axios.get(`${base_url}/websites/${website_id}/metrics`, {
      headers: { "x-umami-api-key": api_key || "" },
      params: { startAt: parameters.startAt, endAt: Date.now(), type },
    });
    return response.data;
  } catch (error) { return []; }
};

const mergeData = (allResults: any[]): UmamiResponse => {
  const combined: UmamiResponse = {
    pageviews: [],
    sessions: [],
    websiteStats: { pageviews: { value: 0 }, visitors: { value: 0 }, visits: { value: 0 }, countries: { value: 0 }, events: { value: 0 } },
  };

  // 1. Generate placeholder 4 bulan (Des, Jan, Feb, Mar)
  const now = new Date();
  for (let i = 3; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01 00:00:00`;
    combined.pageviews.push({ x: key, y: 0 });
    combined.sessions.push({ x: key, y: 0 });
  }

  allResults.forEach((res) => {
    // Akumulasi Stats (Page views, Visitors, dll)
    combined.websiteStats.pageviews.value += getValue(res.websiteStats?.pageviews);
    combined.websiteStats.visitors.value += getValue(res.websiteStats?.visitors);
    combined.websiteStats.visits.value += getValue(res.websiteStats?.visits);
    combined.websiteStats.countries.value += res.countriesCount || 0;
    combined.websiteStats.events.value += res.eventsCount || 0;

    // Mapping Pageviews ke keranjang bulan yang tepat
    res.pageviews?.forEach((item: any) => {
      const target = combined.pageviews.find(p => p.x.substring(0, 7) === item.x.substring(0, 7));
      if (target) target.y += item.y;
    });
    // Mapping Sessions
    res.sessions?.forEach((item: any) => {
      const target = combined.sessions.find(s => s.x.substring(0, 7) === item.x.substring(0, 7));
      if (target) target.y += item.y;
    });
  });

  return combined;
};

export const getAllWebsiteData = async (): Promise<UmamiResponse> => {
  const results = await Promise.all(websites.map(async (w) => {
    const [pv, st, co, ev] = await Promise.all([
      getPageViewsByDataRange(w.domain),
      getWebsiteStats(w.domain),
      getWebsiteMetrics(w.domain, "country"),
      getWebsiteMetrics(w.domain, "event")
    ]);
    const totalEvents = (ev || []).reduce((acc: number, cur: any) => acc + (cur.y || 0), 0);
    return {
      pageviews: pv.data.pageviews || [],
      sessions: pv.data.sessions || [],
      websiteStats: st.data || {},
      countriesCount: (co || []).length,
      eventsCount: totalEvents
    };
  }));
  return mergeData(results);
};