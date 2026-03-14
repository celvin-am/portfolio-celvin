import { WAKATIME_ACCOUNT } from "@/common/constants/wakatime";
import axios from "axios";
import { unstable_cache } from "next/cache";

const { base_url, all_time_endpoint, stats_endpoint } = WAKATIME_ACCOUNT;

const fetchReadStats = async () => {
  try {
    const API_KEY = process.env.WAKATIME_API_KEY?.trim() || "";
    if (!API_KEY) throw new Error("API Key kosong!");

    const API_KEY_BASE64 = Buffer.from(API_KEY).toString("base64");

    // KITA TEMBAK LANGSUNG ENDPOINTNYA BIAR GAK TYPO
    const response = await axios.get(
      `${base_url}/users/current/stats/last_7_days`,
      { headers: { Authorization: `Basic ${API_KEY_BASE64}` } }
    );

    const getData = response.data;
    return {
      data: {
        start_date: getData?.data?.start,
        end_date: getData?.data?.end,
        last_update: getData?.data?.modified_at,
        best_day: {
          date: getData?.data?.best_day?.date,
          text: getData?.data?.best_day?.text,
        },
        human_readable_daily_average: getData?.data?.human_readable_daily_average_including_other_language,
        human_readable_total: getData?.data?.human_readable_total_including_other_language,
        languages: getData?.data?.languages?.slice(0, 6),
        editors: getData?.data?.editors,
      },
    };
  } catch (error: any) {
    console.error("❌ Wakatime Stats Error Detail:", error?.response?.data || error.message);
    return { data: {} as any };
  }
};

const fetchAllTimeSinceToday = async () => {
  try {
    const API_KEY = process.env.WAKATIME_API_KEY?.trim() || "";
    if (!API_KEY) throw new Error("API Key kosong!");

    const API_KEY_BASE64 = Buffer.from(API_KEY).toString("base64");

    const response = await axios.get(`${base_url}/users/current/all_time_since_today`, {
      headers: { Authorization: `Basic ${API_KEY_BASE64}` },
    });

    const resData = response.data;
    
    // Mapping sesuai JSON terminal lu: resData.data.text
    return {
      data: {
        text: resData?.data?.text || "N/A",
        total_seconds: resData?.data?.total_seconds || 0,
      },
    };
  } catch (error: any) {
    console.error("❌ Wakatime All Time Error Detail:", error?.response?.data || error.message);
    return { data: { text: "N/A", total_seconds: 0 } as any };
  }
};

export const getReadStats = unstable_cache(
  async () => fetchReadStats(),
  ["wakatime-stats-v501"], 
  { revalidate: 3600, tags: ["wakatime-stats-v501"] },
);

export const getAllTimeSinceToday = unstable_cache(
  async () => fetchAllTimeSinceToday(),
  ["wakatime-alltime-v501"], 
  { revalidate: 3600, tags: ["wakatime-alltime-v501"] },
);