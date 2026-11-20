/** Web app manifest: makes Mzizi installable with its name, icons, start page and shortcuts. */
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/demo",
    name: "Mzizi Demo",
    short_name: "Mzizi Demo",
    description: "Evidence-based African knowledge, mapped through time and place.",
    start_url: "/demo?source=pwa",
    scope: "/demo",
    display: "standalone",
    orientation: "any",
    lang: "en",
    dir: "ltr",
    background_color: "#f4efe5",
    theme_color: "#1d1a16",
    categories: ["education", "government", "reference"],
    icons: [
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Explore Kenya", short_name: "Kenya", url: "/demo/ke", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      {
        name: "Who leads",
        short_name: "Leaders",
        url: "/demo/ke?view=leaders",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Read the Constitution",
        short_name: "Law",
        url: "/demo/ke?view=law",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
