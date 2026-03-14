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

// LOGIC BARU: Konversi UTC dari Umami ke kalender Jakarta biar nggak meleset ke bulan lalu
export const getMonthPrefix = (x: string) => {
  try {
    const safeString = x.includes('T') ? x : x.replace(' ', 'T') + 'Z';
    const d = new Date(safeString);
    if (isNaN(d.getTime())) return x.substring(0, 7);
    
    // Paksa output format YYYY-MM berdasarkan zona waktu Jakarta
    const dateString = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(d);
    
    return dateString.substring(0, 7);
  } catch (e) {
    return x.substring(0, 7);
  }
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

  // Patokan bulan ini pakai waktu Jakarta, bukan server Vercel
  const jakartaNow = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
  
  for (let i = 3; i >= 0; i--) {
    const d = new Date(jakartaNow.getFullYear(), jakartaNow.getMonth() - i, 1);
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const key = `${prefix}-01 00:00:00`; 
    combined.pageviews.push({ x: key, y: 0 });
    combined.sessions.push({ x: key, y: 0 });
  }

  allResults.forEach((res) => {
    combined.websiteStats.pageviews.value += getValue(res.websiteStats?.pageviews);
    combined.websiteStats.visitors.value += getValue(res.websiteStats?.visitors);
    combined.websiteStats.visits.value += getValue(res.websiteStats?.visits);
    combined.websiteStats.countries.value += res.countriesCount || 0;
    combined.websiteStats.events.value += res.eventsCount || 0;

    // Cocokkan data dengan prefix Jakarta yang udah difilter
    res.pageviews?.forEach((item: any) => {
      const prefix = getMonthPrefix(item.x);
      const target = combined.pageviews.find(p => p.x.startsWith(prefix));
      if (target) target.y += item.y;
    });
    res.sessions?.forEach((item: any) => {
      const prefix = getMonthPrefix(item.x);
      const target = combined.sessions.find(s => s.x.startsWith(prefix));
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