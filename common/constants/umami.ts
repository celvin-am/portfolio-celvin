export const UMAMI_ACCOUNT = {
  username: "Celvin Andra Maulana",
  api_key: "api_0LZpZ8A2ITOJ6KWxEd3IFVvGxCZZfQTV", 
  base_url: "https://api.umami.is/v1",
  endpoint: {
    page_views: "/pageviews",
    sessions: "/stats",
  },
  parameters: {
    // 120 hari = 4 bulan terakhir
    startAt: Date.now() - (120 * 24 * 60 * 60 * 1000), 
    endAt: Date.now(),      
    unit: "month", 
    timezone: "Asia/Jakarta",
  },
  is_active: true,
  websites: [
    {
      domain: "celvinandra.my.id",
      website_id: "957f8e50-cea6-43bb-87b0-7b58328c4497",
      umami_url: "https://cloud.umami.is/websites/957f8e50-cea6-43bb-87b0-7b58328c4497",
    },
  ],
};