"use client";
/** Appearance choices: spacing, corners, borders, card style and map drawing. Each applies at once and is kept in a cookie. */
import { copy } from "@mzizi/copy";
import { Check } from "lucide-react";
import { useCopy } from "#/lib/copy/copy";
import { setLook, useLook, type Look, type LookKey } from "#/lib/preferences/appearance";
import { SectionTitle } from "#/components/preferences/prefs-panels";

const L = copy.preferences.look;
type Choice<K extends LookKey> = { id: Look[K]; label: unknown; swatch?: readonly string[] };
type Group<K extends LookKey> = { key: K; title: unknown; choices: readonly Choice<K>[] };
const group = <K extends LookKey>(g: Group<K>) => g;

/** Swatches for the map grades; "palette" follows the accent of the colours chosen above. */
const ramp = (hue: string) => [12, 32, 55, 78, 100].map((p) => `color-mix(in oklab, ${hue} ${p}%, var(--surface))`);

const groups = {
  layout: [
    group({ key: "density", title: L.density, choices: [{ id: "compact", label: L.compact }, { id: "normal", label: L.normal }, { id: "roomy", label: L.roomy }] }),
    group({ key: "radius", title: L.radius, choices: [{ id: "sharp", label: L.sharp }, { id: "soft", label: L.soft }, { id: "round", label: L.round }, { id: "pill", label: L.pill }] }),
  ],
  cards: [
    group({ key: "border", title: L.border, choices: [{ id: "none", label: L.borderNone }, { id: "faint", label: L.borderFaint }, { id: "normal", label: L.normal }, { id: "strong", label: L.borderStrong }] }),
    group({ key: "card", title: L.card, choices: [{ id: "outline", label: L.outline }, { id: "flat", label: L.flat }, { id: "raised", label: L.raised }, { id: "tinted", label: L.tinted }] }),
  ],
  maps: [
    group({
      key: "grade",
      title: L.grade,
      choices: [
        { id: "palette", label: L.gradePalette, swatch: ramp("var(--accent)") },
        { id: "cool", label: L.cool, swatch: ramp("#2a7ba6") },
        { id: "green", label: L.green, swatch: ramp("#2e8b57") },
        { id: "violet", label: L.violet, swatch: ramp("#7a4fb3") },
        { id: "mono", label: L.mono, swatch: ramp("var(--ink)") },
        { id: "heat", label: L.heat, swatch: ["#fff1c9", "#fdbe5a", "#f47b20", "#c43a1a", "#6b1410"] },
        { id: "viridis", label: L.viridis, swatch: ["#440154", "#3b528b", "#21918c", "#5ec962", "#fde725"] },
      ],
    }),
    group({ key: "mstroke", title: L.mstroke, choices: [{ id: "thin", label: L.thin }, { id: "normal", label: L.normal }, { id: "thick", label: L.thick }] }),
    group({ key: "mheight", title: L.mheight, choices: [{ id: "short", label: L.short }, { id: "normal", label: L.normal }, { id: "tall", label: L.tall }] }),
    group({ key: "mlabels", title: L.mlabels, choices: [{ id: "hover", label: L.hover }, { id: "off", label: L.off }] }),
  ],
} as const;

const sections = [
  { id: "layout", title: L.layout },
  { id: "cards", title: L.cards },
  { id: "maps", title: L.maps },
] as const;

function Choices<K extends LookKey>({ g }: { g: Group<K> }) {
  const t = useCopy();
  const look = useLook();
  const title = t(g.title as typeof L.density);
  return (
    <div>
      <div className="mb-1 text-xs text-muted">{title}</div>
      <div role="radiogroup" aria-label={title} className="flex flex-wrap gap-1.5">
        {g.choices.map((c) => {
          const on = look[g.key] === c.id;
          return (
            <button
              key={c.id}
              role="radio"
              aria-checked={on}
              onClick={() => setLook(g.key, c.id)}
              className={`flex min-h-8 items-center gap-2 rounded-md border px-2.5 text-xs ${on ? "border-accent bg-accent-soft" : "border-line hover:border-muted"}`}
            >
              {c.swatch && (
                <span aria-hidden className="flex h-3 w-10 overflow-hidden rounded-sm">
                  {c.swatch.map((s) => (
                    <span key={s} className="flex-1" style={{ background: s }} />
                  ))}
                </span>
              )}
              <span>{t(c.label as typeof L.density)}</span>
              {on && <Check size={12} className="text-accent" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AppearancePanel() {
  const t = useCopy();
  return (
    <div className="space-y-5">
      {sections.map((s) => (
        <section key={s.id}>
          <SectionTitle>{t(s.title)}</SectionTitle>
          <div className="space-y-3">
            {groups[s.id].map((g) => (
              <Choices key={g.key} g={g as unknown as Group<LookKey>} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
