/** Web app manifest: makes Mzizi installable with its name, icons, start page and shortcuts. */
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Mzizi",
    short_name: "Mzizi",
    description: "Evidence-based African knowledge, mapped through time and place.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "any",
    lang: "en",
    dir: "ltr",
    background_color: "#f4efe5",
    theme_color: "#1d1a16",
    categories: ["education", "government", "reference"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Explore Kenya", short_name: "Kenya", url: "/ke", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Who leads", short_name: "Leaders", url: "/ke?view=leaders", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Read the Constitution", short_name: "Law", url: "/ke?view=law", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
