import axios from "axios";
import { UMAMI_ACCOUNT } from "@/common/constants/umami";
import { UmamiResponse, UmamiDataPoint } from "@/common/types/umami";

const { api_key, endpoint, base_url, parameters, websites } = UMAMI_ACCOUNT;

const getWebsiteIdByDomain = (domain: string) => {
  const found = websites.find((w) => w.domain === domain);
  return found?.website_id;
};

const getValue = (obj: any): number => {
  if (!obj) return 0;
  if (typeof obj === 'number') return obj;
  if (typeof obj.value === 'number') return obj.value;
  return 0;
};

export const getPageViewsByDataRange = async (domain: string) => {
  const website_id = getWebsiteIdByDomain(domain);
  if (!website_id) return { status: 404, data: { pageviews: [], sessions: [] } };
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
  if (!website_id) return { status: 404, data: {} };
  try {
    const response = await axios.get(`${base_url}/websites/${website_id}${endpoint.sessions}`, {
      headers: { "x-umami-api-key": api_key || "" },
      params: { startAt: parameters.startAt, endAt: Date.now() },
    });
    return { status: response.status, data: response.data };
  } catch (error) { return { status: 500, data: {} }; }
};

// --- FUNGSI BARU BUAT NEGARA ---
export const getWebsiteMetrics = async (domain: string, type: string = "country") => {
  const website_id = getWebsiteIdByDomain(domain);
  try {
    const response = await axios.get(`${base_url}/websites/${website_id}/metrics`, {
      headers: { "x-umami-api-key": api_key || "" },
      params: { startAt: parameters.startAt, endAt: Date.now(), type },
    });
    return response.data; // Ini array [{x: 'ID', y: 1}, ...]
  } catch (error) { return []; }
};

const mergeData = (allResults: any[]): UmamiResponse => {
  const combined: UmamiResponse = {
    pageviews: [],
    sessions: [],
    websiteStats: {
      pageviews: { value: 0 },
      visitors: { value: 0 },
      visits: { value: 0 },
      countries: { value: 0 },
      events: { value: 0 },
    },
  };

  allResults.forEach((result) => {
    const stats = result?.websiteStats;
    combined.websiteStats.pageviews.value += getValue(stats?.pageviews);
    combined.websiteStats.visitors.value += getValue(stats?.visitors);
    combined.websiteStats.visits.value += getValue(stats?.visits);
    combined.websiteStats.countries.value += result?.countriesCount || 0;
    combined.websiteStats.events.value += getValue(stats?.events);

    if (result.pageviews && Array.isArray(result.pageviews)) {
      result.pageviews.forEach((item: any) => {
        const existing = combined.pageviews.find((p) => p.x === item.x);
        if (existing) existing.y += item.y;
        else combined.pageviews.push({ ...item });
      });
    }
  });

  return combined;
};

export const getAllWebsiteData = async (): Promise<UmamiResponse> => {
  const results = await Promise.all(
    websites.map(async (w) => {
      const pv = await getPageViewsByDataRange(w.domain);
      const st = await getWebsiteStats(w.domain);
      const countries = await getWebsiteMetrics(w.domain, "country");
      return {
        pageviews: pv?.data?.pageviews || [],
        sessions: pv?.data?.sessions || [],
        websiteStats: st?.data || {},
        countriesCount: countries.length // Jumlah negara unik
      };
    })
  );
  return mergeData(results);
};