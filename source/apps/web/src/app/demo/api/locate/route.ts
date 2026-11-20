/**
 * Where the request seems to come from, read from the headers a host or CDN adds (Vercel, Cloudflare). No outside
 * lookup is made and the address itself is never read or stored. Without such headers (local development) it answers empty.
 */
export function GET(request: Request) {
  const h = request.headers;
  const pick = (...names: string[]) => names.map((n) => h.get(n)).find((v) => v && v !== "XX") ?? "";
  const num = (v: string) => {
    const n = Number(v);
    return v && Number.isFinite(n) ? n : null;
  };
  const decode = (v: string) => {
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  const body = {
    country: pick("x-vercel-ip-country", "cf-ipcountry").toLowerCase(),
    region: decode(pick("x-vercel-ip-country-region", "cf-region")),
    city: decode(pick("x-vercel-ip-city", "cf-ipcity")),
    lat: num(pick("x-vercel-ip-latitude", "cf-iplatitude")),
    lon: num(pick("x-vercel-ip-longitude", "cf-iplongitude")),
  };
  return Response.json(body, { headers: { "Cache-Control": "no-store" } });
}
