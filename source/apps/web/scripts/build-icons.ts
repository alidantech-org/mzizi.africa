/** Renders the app icons from the mark (needs ImageMagick `magick`). Run: bun scripts/build-icons.ts */
import { mkdirSync, writeFileSync } from "node:fs";
import { $ } from "bun";

const BG = "#1d1a16";
const FG = "#f4efe5";
const MARK = `<g fill="none" stroke="STROKE" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 23.5V7.5L16 17.5L26.5 7.5V23.5"/><path d="M16 17.5V25.5"/><path d="M16 25.5L11.8 29M16 25.5L20.2 29"/><path d="M5.5 23.5L3.2 26M26.5 23.5L28.8 26"/></g>`;
const tile = (size: number, scale: number, radius: number) => {
  const inset = (32 - 32 * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}"><rect width="32" height="32" rx="${radius}" fill="${BG}"/><g transform="translate(${inset} ${inset}) scale(${scale})">${MARK.replace("STROKE", FG)}</g></svg>`;
};

mkdirSync("public/icons", { recursive: true });
const out = async (file: string, svg: string, px: number) => { const tmp = `${file}.svg`; writeFileSync(tmp, svg); await $`magick -background none -density 600 ${tmp} -resize ${px}x${px} ${file}`; await $`rm ${tmp}`; };

await out("public/icons/icon-192.png", tile(192, 0.78, 7), 192);          // "any": rounded tile
await out("public/icons/icon-512.png", tile(512, 0.78, 7), 512);
await out("public/icons/maskable-512.png", tile(512, 0.56, 0), 512);      // full bleed, mark inside the safe zone
await out("src/app/apple-icon.png", tile(180, 0.7, 0), 180);              // iOS rounds it itself
for (const s of [16, 32, 48]) await out(`/tmp/fav-${s}.png`, tile(s, 0.86, 6), s);
await $`magick /tmp/fav-16.png /tmp/fav-32.png /tmp/fav-48.png src/app/favicon.ico`;
console.log("icons written");
