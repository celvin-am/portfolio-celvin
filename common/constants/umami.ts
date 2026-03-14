export const UMAMI_ACCOUNT = {
  username: "Celvin Andra Maulana", // Sudah abang ganti jadi namamu 😎
  api_key: process.env.UMAMI_API_KEY,
  base_url: "https://api.umami.is/v1/websites",
  endpoint: {
    page_views: "/pageviews",
    sessions: "/sessions/stats",
  },
  parameters: {
    startAt: 1717174800000, 
    endAt: 1767190799000, 
    unit: "month",
    timezone: "Asia/Jakarta",
  },
  is_active: true,
  websites: [
    {
      // Kita set ke localhost dulu buat testing di komputer kamu
      domain: "localhost:3000", 
      website_id: process.env.UMAMI_WEBSITE_ID,
      umami_url: "",
    },
    // Nanti kalau web kamu udah di-hosting/online, tinggal tambah domain aslimu di bawah sini
  ],
};