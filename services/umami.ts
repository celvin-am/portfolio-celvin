import axios from "axios";
import { UMAMI_ACCOUNT } from "@/common/constants/umami";
import { UmamiResponse, UmamiDataPoint } from "@/common/types/umami";

const { api_key, endpoint, base_url, parameters, websites } = UMAMI_ACCOUNT;

const getWebsiteIdByDomain = (domain: string) => {
  const found = websites.find((w) => w.domain === domain);
  return found?.website_id;
};

// Fungsi sakti buat ambil angka gimanapun formatnya
const getValue = (obj: any): number => {
  if (!obj) return 0;
  if (typeof obj === 'number') return obj;
  if (typeof obj.value === 'number') return obj.value;
  return 0;
};

export const getPageViewsByDataRange = async (domain: string) => {
  const website_id = getWebsiteIdByDomain(domain);
  if (!website_id) return { status: 404, data: { pageviews: [], sessions: [] } };

  const url = `${base_url}/websites/${website_id}${endpoint.page_views}`;
  try {
    const response = await axios.get(url, {
      headers: { "x-umami-api-key": api_key || "" },
      params: { ...parameters, endAt: Date.now() },
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    return { status: 500, data: { pageviews: [], sessions: [] } };
  }
};

export const getWebsiteStats = async (domain: string) => {
  const website_id = getWebsiteIdByDomain(domain);
  if (!website_id) return { status: 404, data: {} };

  const url = `${base_url}/websites/${website_id}${endpoint.sessions}`;
  try {
    const response = await axios.get(url, {
      headers: { "x-umami-api-key": api_key || "" },
      params: { startAt: parameters.startAt, endAt: Date.now() },
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    return { status: 500, data: {} };
  }
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
    
    // Update kotak-kotak atas dengan getValue agar tidak 0
    combined.websiteStats.pageviews.value += getValue(stats?.pageviews);
    combined.websiteStats.visitors.value += getValue(stats?.visitors);
    combined.websiteStats.visits.value += getValue(stats?.visits);
    combined.websiteStats.events.value += getValue(stats?.events);
    combined.websiteStats.countries.value += getValue(stats?.countries);

    // Gabungkan Chart
    if (result.pageviews && Array.isArray(result.pageviews)) {
      result.pageviews.forEach((item: any) => {
        const existing = combined.pageviews.find((p) => p.x === item.x);
        if (existing) existing.y += item.y;
        else combined.pageviews.push({ ...item });
      });
    }
  });

  combined.pageviews.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
  return combined;
};

export const getAllWebsiteData = async (): Promise<UmamiResponse> => {
  const results = await Promise.all(
    websites.map(async (w) => {
      const pv = await getPageViewsByDataRange(w.domain);
      const st = await getWebsiteStats(w.domain);
      return {
        pageviews: pv?.data?.pageviews || [],
        sessions: pv?.data?.sessions || [],
        websiteStats: st?.data || {},
      };
    })
  );
  return mergeData(results);
};