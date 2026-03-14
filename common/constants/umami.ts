export const UMAMI_ACCOUNT = {
  username: "Celvin Andra Maulana",
  // Gunakan hardcode dulu untuk memastikan koneksi tembus
  api_key: "api_0LZpZ8A2ITOJ6KWxEd3IFVvGxCZZfQTV", 
  base_url: "https://api.umami.is/v1",
  endpoint: {
    page_views: "/pageviews",
    sessions: "/stats",
  },
  parameters: {
    startAt: 1672531200000, // 1 Jan 2023
    endAt: Date.now(),      // Sampai detik ini (Dinamis)
    unit: "day",
    timezone: "UTC",
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