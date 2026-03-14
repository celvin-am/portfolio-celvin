import axios from "axios";
import { UMAMI_ACCOUNT } from "@/common/constants/umami";
import { UmamiResponse, UmamiDataPoint } from "@/common/types/umami";

const { api_key, endpoint, base_url, parameters, websites } = UMAMI_ACCOUNT;

const getWebsiteIdByDomain = (domain: string) => {
  const found = websites.find((w) => w.domain === domain);
  return found?.website_id;
};

// Fungsi Helper untuk format response agar TypeScript gak marah
const formatResponse = (status: number, data: any, error: string | null = null) => ({
  status,
  data,
  error
});

export const getPageViewsByDataRange = async (domain: string) => {
  const website_id = getWebsiteIdByDomain(domain);
  if (!website_id) return formatResponse(404, {}, `Website not found for ${domain}`);

  const url = `${base_url}/websites/${website_id}${endpoint.page_views}`;

  try {
    const response = await axios.get(url, {
      headers: { "x-umami-api-key": api_key || "" },
      params: parameters,
    });
    return formatResponse(response.status, response.data);
  } catch (error: any) {
    return formatResponse(error?.response?.status || 500, {}, error.message);
  }
};

export const getWebsiteStats = async (domain: string) => {
  const website_id = getWebsiteIdByDomain(domain);
  if (!website_id) return formatResponse(404, {}, `Website not found for ${domain}`);

  const url = `${base_url}/websites/${website_id}${endpoint.sessions}`;

  try {
    const response = await axios.get(url, {
      headers: { "x-umami-api-key": api_key || "" },
      params: { startAt: parameters.startAt, endAt: parameters.endAt },
    });
    return formatResponse(response.status, response.data);
  } catch (error: any) {
    return formatResponse(error?.response?.status || 500, {}, error.message);
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
    combined.websiteStats.pageviews.value += result?.websiteStats?.pageviews?.value || 0;
    combined.websiteStats.visitors.value += result?.websiteStats?.visitors?.value || 0;
    combined.websiteStats.visits.value += result?.websiteStats?.visits?.value || 0;
    combined.websiteStats.events.value += result?.websiteStats?.events?.value || 0;
    combined.websiteStats.countries.value = Math.max(
      combined.websiteStats.countries.value,
      result?.websiteStats?.countries?.value || 0
    );

    const mergeChart = (target: UmamiDataPoint[], source: UmamiDataPoint[] = []) => {
      if (!Array.isArray(source)) return;
      source.forEach((item) => {
        const existing = target.find((p) => p.x === item.x);
        if (existing) existing.y += item.y;
        else target.push({ ...item });
      });
    };

    mergeChart(combined.pageviews, result?.pageviews);
    mergeChart(combined.sessions, result?.sessions);
  });

  combined.pageviews.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
  combined.sessions.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());

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