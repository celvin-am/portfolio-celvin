export const UMAMI_ACCOUNT = {
  username: "Celvin Andra Maulana",
  api_key: process.env.UMAMI_API_KEY,
  // Cukup sampai /v1 agar tidak bentrok di service
  base_url: "https://api.umami.is/v1", 
  endpoint: {
    page_views: "/pageviews",
    sessions: "/stats",
  },
  parameters: {
    startAt: 1741885200000, // Tanggal hari ini dalam milidetik
    endAt: 1767190799000, 
    unit: "month",
    timezone: "Asia/Jakarta",
  },
  is_active: true,
  websites: [
    {
      domain: "celvinandra.my.id", 
      website_id: process.env.UMAMI_WEBSITE_ID,
      umami_url: "https://cloud.umami.is/websites/957f8e50-cea6-43bb-87b0-7b58328c4497",
    },
  ],
};