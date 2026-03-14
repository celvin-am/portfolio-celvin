export const UMAMI_ACCOUNT = {
  username: "Celvin Andra Maulana", // Sudah abang ganti jadi namamu 😎
  api_key: process.env.UMAMI_API_KEY,
  base_url: "https://api.umami.is/v1/websites",
  endpoint: {
    page_views: "/pageviews",
    sessions: "/sessions/stats",
  },
  parameters: {
    startAt: 1741885200000, 
    endAt: 1767190799000, 
    unit: "month",
    timezone: "Asia/Jakarta",
  },
  is_active: true,
  websites: [
    {
      // Kita set ke localhost dulu buat testing di komputer kamu
      domain: "celvinandra.my.id", 
      website_id: process.env.UMAMI_WEBSITE_ID,
      umami_url: "https://cloud.umami.is/websites/957f8e50-cea6-43bb-87b0-7b58328c4497",
    },
    // Nanti kalau web kamu udah di-hosting/online, tinggal tambah domain aslimu di bawah sini
  ],
};