"use client";

/** Pictures, videos and social posts. Remote items keep their raw URL; embeddable ones open in a sandboxed frame on demand. */
import { useState } from "react";

import type { MediaItem } from "#/lib/site/insights.ts";

const PLATFORM_LABEL: Record<string, string> = { youtube: "YouTube", tiktok: "TikTok", facebook: "Facebook", instagram: "Instagram", x: "X", vimeo: "Vimeo", pexels: "Photo", dicebear: "Avatar", website: "Web" };

export function Embed({ item }: { item: MediaItem }) {
  const [open, setOpen] = useState(false);
  const label = PLATFORM_LABEL[item.platform ?? ""] ?? "Link";
  if (open && item.embedUrl) {
    return (
      <iframe title={item.title ?? label} src={item.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        allow="encrypted-media; picture-in-picture; fullscreen" className="aspect-video w-full rounded-2xl border border-border-default" />
    );
  }
  return (
    <div className="glass card-lift relative flex aspect-video w-full flex-col justify-end overflow-hidden rounded-2xl p-3">
      {item.thumbnailUrl ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={item.thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" /> : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="relative flex items-center justify-between gap-2 text-white">
        <span className="min-w-0 truncate text-sm font-semibold">{item.title ?? label}</span>
        {item.embedUrl ? (
          <button type="button" className="btn btn-primary shrink-0 !py-1.5" onClick={() => setOpen(true)} aria-label={`Play ${item.title ?? label}`}>▶ {label}</button>
        ) : (
          <a className="btn btn-ghost shrink-0 !py-1.5 !text-white" href={item.url} target="_blank" rel="noreferrer">Open on {label} ↗</a>
        )}
      </div>
      <div className="relative">
        {item.embedUrl ? null : <span className="mt-1 inline-block rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white/90">Embed not available: this is a profile link, not a single post</span>}
      </div>
    </div>
  );
}

/** A responsive gallery: stored photographs and stock pictures as tiles, videos and posts as embeds. */
export function Gallery({ items, empty }: { items: readonly MediaItem[]; empty?: string }) {
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const pictures = items.filter((i) => i.kind !== "video" && (i.stored || i.platform === "pexels" || i.platform === "dicebear"));
  const remote = items.filter((i) => !pictures.includes(i));
  if (items.length === 0) return empty ? <p className="text-sm text-content-muted">{empty}</p> : null;
  return (
    <div className="space-y-4">
      {pictures.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {pictures.map((p) => (
            <button key={p.url} type="button" onClick={() => setLightbox(p)} className="glass card-lift group relative aspect-[4/3] overflow-hidden rounded-2xl" aria-label={`Enlarge ${p.title ?? "picture"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.title ?? ""} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              {p.platform === "pexels" ? <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-white">Pexels</span> : null}
            </button>
          ))}
        </div>
      ) : null}
      {remote.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {remote.map((r) => <Embed key={r.url} item={r} />)}
        </div>
      ) : null}
      {lightbox ? (
        <div role="dialog" aria-modal="true" aria-label={lightbox.title ?? "Picture"} className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={() => setLightbox(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox.url} alt={lightbox.title ?? ""} className="max-h-[88vh] max-w-full rounded-2xl shadow-2xl" />
          <button type="button" className="btn btn-ghost absolute right-4 top-4 !text-white" onClick={() => setLightbox(null)}>Close ✕</button>
        </div>
      ) : null}
    </div>
  );
}

/** An avatar: a stored or remote portrait, or the initials when there is none or it cannot load (offline, blocked). */
export function Avatar({ src, name, size = 56 }: { src?: string | null; name: string; size?: number }) {
  const [broken, setBroken] = useState(false);
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  // Generated placeholder portraits (DiceBear) come out pale and low-contrast; the branded initials read better in both themes.
  const real = src && !/dicebear\.com/.test(src) ? src : null;
  return real && !broken ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={real} alt="" width={size} height={size} loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} className="shrink-0 rounded-full border-2 border-cream object-cover shadow" style={{ width: size, height: size }} />
  ) : (
    <span aria-hidden className="grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-clay to-calabash font-bold text-cream shadow" style={{ width: size, height: size, fontSize: size / 2.6 }}>{initials}</span>
  );
}
