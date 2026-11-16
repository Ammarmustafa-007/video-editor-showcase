/**
 * Same-site relay for the "Ask about my work" chat.
 *
 * The browser only ever talks to artbyqureshi.me/api/abq. This function forwards the call to the chat server
 * (Nova) from Vercel's side, so the server's address never shows in the visitor's network tab, and no cross-site
 * request is needed. Only the four chat operations pass, with size limits; everything else is refused.
 *
 * Settings (Vercel → Project → Settings → Environment Variables), none of them required to work:
 *   NOVA_CHAT_URL   where the chat server lives (default below)
 *   ABQ_PROXY_KEY   shared secret; when set here AND in Nova, Nova trusts this relay's visitor address for rate limits
 */
const NOVA = String(process.env.NOVA_CHAT_URL || "https://novaclipshq.studio").replace(/\/+$/, "");
const KEY = String(process.env.ABQ_PROXY_KEY || "");
const SITE = "https://artbyqureshi.me";
const OPS = { chat: "POST", human: "POST", poll: "GET", chats: "GET" };
const ALLOWED_QUERY = new Set(["visitor", "token", "after"]);

const json = (body, status) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });

async function relay(req) {
  const url = new URL(req.url);
  const op = url.searchParams.get("op") || "";
  if (!Object.prototype.hasOwnProperty.call(OPS, op) || OPS[op] !== req.method) return json({ detail: "Not found" }, 404);

  // only pages of this site may use it (browsers mark every fetch with Sec-Fetch-Site)
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return json({ detail: "Not allowed" }, 403);

  const q = new URLSearchParams();
  for (const [k, v] of url.searchParams) {
    // ids and tokens are letters, digits, - and _ only: anything else never reaches the server
    if (ALLOWED_QUERY.has(k)) q.set(k, v.replace(/[^\w-]/g, "").slice(0, 120));
  }
  const target = `${NOVA}/api/abq/${op}${[...q].length ? `?${q}` : ""}`;

  let body;
  if (req.method === "POST") {
    body = await req.text();
    if (body.length > 4000) return json({ detail: "That message is too long" }, 413);
    try {
      JSON.parse(body);
    } catch {
      return json({ detail: "Bad request" }, 400);
    }
  }

  const ip = (req.headers.get("x-real-ip") || (req.headers.get("x-forwarded-for") || "").split(",")[0] || "").trim().slice(0, 64);
  const headers = { "Content-Type": "application/json", Origin: SITE, "X-Requested-With": "novaclips", "X-ABQ-Client-IP": ip };
  if (KEY) headers["X-ABQ-Key"] = KEY;

  const r = await fetch(target, { method: req.method, body, headers, signal: AbortSignal.timeout(28000) });
  const text = await r.text();
  let out;
  try {
    out = JSON.parse(text);
  } catch {
    return json({ detail: "Away right now" }, 503);
  }
  return json(out, r.status);
}

async function handle(req) {
  try {
    return await relay(req);
  } catch {
    return json({ detail: "Away right now" }, 503);
  }
}

export function GET(req) {
  return handle(req);
}

export function POST(req) {
  return handle(req);
}
