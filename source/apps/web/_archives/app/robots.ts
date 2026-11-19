import type { MetadataRoute } from "next";

/** Crawlers may read everything the app serves; the sitemap lists the canonical addresses. */
export default function robots(): MetadataRoute.Robots {
  const site = process.env.SITE_URL ?? "http://localhost:3300";
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site}/sitemap.xml` };
}
