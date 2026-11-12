// Cloudflare Worker：轉接 Linggle API（解決 CORS）
// 環境變數（可選）：ALLOW_ORIGIN = https://你的帳號.github.io
export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOW_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Content-Type": "application/json; charset=utf-8",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const q = new URL(req.url).searchParams.get("q");
    if (!q) return new Response('{"error":"missing q"}', { status: 400, headers: cors });
    const api = "https://search.linggle.com/api/ngram/" + encodeURIComponent(q.replace(/\//g, "@"));
    try {
      const r = await fetch(api, { headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json" } });
      return new Response(await r.text(), { status: r.status, headers: cors });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), { status: 502, headers: cors });
    }
  },
};
