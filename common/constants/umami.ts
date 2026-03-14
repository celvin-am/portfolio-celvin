export const UMAMI_ACCOUNT = {
  username: "Celvin Andra Maulana", 
  api_key: process.env.UMAMI_API_KEY,
  // Gue hapus /websites karena di endpoint biasanya sudah ditambahin otomatis
  base_url: "https://api.umami.is/v1", 
  endpoint: {
    // Pastikan diawali slash kalau kodingan lu nggak otomatis nambahin
    page_views: "/websites", 
    sessions: "/websites",
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
      domain: "celvinandra.my.id", 
      website_id: process.env.UMAMI_WEBSITE_ID,
      // URL ini sudah valid, nggak akan bikin error 'Invalid URL' lagi
      umami_url: "https://cloud.umami.is/websites/957f8e50-cea6-43bb-87b0-7b58328c4497",
    },
  ],
};