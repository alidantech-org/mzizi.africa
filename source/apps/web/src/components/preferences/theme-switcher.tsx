"use client";
/** Palette and colour mode. Palette swatches are circles; the mode control is small and squared with the app's own corner radius. State lives in the preferences store. */
import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Radio, RadioGroup, ToggleButton, ToggleButtonGroup } from "react-aria-components";
import { FLAG_COLORS } from "#demo/_data/flag-colors";
import { chromaticColors } from "#/lib/charts/flag-palette";
import { customActive, flagActive, flagPrimaryOf, setTheme, useTheme, type Mode } from "#/lib/preferences/prefs";
import { Flag } from "#/components/brand/flag";

export const PALETTES = [
  { id: "savanna", label: "Savanna", swatch: ["#b8431f", "#d49a2a", "#1f6b52"] },
  { id: "lagoon", label: "Lagoon", swatch: ["#0b7285", "#e0603a", "#6558c9"] },
  { id: "baobab", label: "Baobab", swatch: ["#a1295f", "#dd9a26", "#2f7568"] },
];
const modes = [
  { id: "system", label: "System", icon: Monitor },
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
] as const;

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-xs text-muted">{label}</span>
    {children}
  </div>
);

const conic = (colors: string[]) =>
  `conic-gradient(${colors.map((c, i) => `${c} ${Math.round((i / colors.length) * 100)}% ${Math.round(((i + 1) / colors.length) * 100)}%`).join(", ")})`;
const circle =
  "block size-6 rounded-full border border-line ring-offset-2 ring-offset-surface transition group-hover:scale-110 group-data-[selected]:ring-2 group-data-[selected]:ring-ink";
const radio =
  "group cursor-pointer rounded-full outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-accent data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-offset-surface";

export function ThemeSwitcher({ flagOpen = false }: { flagOpen?: boolean }) {
  const t = useTheme();
  const [open, setOpen] = useState(flagOpen); // the flag colours section is closed until opened
  const flag = FLAG_COLORS[t.country]; // offered only where the current country has a flag
  const following = flagActive(t);
  const custom = customActive(t);
  const primary = following ? flagPrimaryOf(t) : null;
  return (
    <div className="space-y-3">
      <Row label="Palette">
        <RadioGroup
          aria-label="Colour palette"
          orientation="horizontal"
          value={following || custom ? null : t.palette === "flag" || t.palette === "custom" ? t.base : t.palette}
          onChange={(v) => setTheme({ palette: v, base: v })}
          className="flex gap-2"
        >
          {PALETTES.map((p) => (
            <Radio key={p.id} value={p.id} aria-label={p.label} className={radio}>
              <span title={p.label} className={circle} style={{ background: conic(p.swatch) }} />
            </Radio>
          ))}
          <label
            title="Your own colour"
            className="group relative cursor-pointer rounded-full has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-surface"
          >
            <span
              className={`${circle} ${custom ? "ring-2 ring-ink" : ""}`}
              style={{ background: custom ? t.custom! : "conic-gradient(#e03c31, #ffb81c, #1eb53a, #00a3dd, #6558c9, #e03c31)" }}
            />
            <input
              type="color"
              aria-label="Choose your own colour"
              value={t.custom ?? "#b8431f"}
              onChange={(e) => setTheme({ palette: "custom", custom: e.target.value })}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
          </label>
        </RadioGroup>
      </Row>
      {flag && (
        <div className={`rounded-md border ${following ? "border-accent" : "border-line"}`}>
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="flag-colours-body"
            className="flex w-full items-center gap-2 rounded-md p-2.5 text-left text-xs hover:bg-accent-soft/50"
          >
            <Flag code={t.country} size={16} />
            <span className="font-medium">Flag colours</span>
            <span className="min-w-0 truncate text-muted">· {flag.name}</span>
            {following && (
              <span className="ml-auto shrink-0 rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                Following
              </span>
            )}
            <ChevronDown
              size={14}
              className={`shrink-0 text-muted transition-transform ${following ? "" : "ml-auto"} ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && (
            <div id="flag-colours-body" className="border-t border-line px-2.5 pb-2.5 pt-2">
              <p className="text-[11px] leading-snug text-muted">
                Follows the flag of the country you are in. Pick its main colour; each country starts at its own.
              </p>
              <RadioGroup
                aria-label={`Main colour from the ${flag.name} flag`}
                orientation="horizontal"
                value={primary}
                onChange={(hex) => setTheme({ palette: "flag", flagPrimary: hex })}
                className="mt-2 flex gap-2"
              >
                {chromaticColors(flag.colors.map((c) => c.hex)).map((hex) => {
                  const name = flag.colors.find((c) => c.hex === hex)?.name ?? hex;
                  return (
                    <Radio
                      key={hex}
                      value={hex}
                      aria-label={`${name}${hex === flag.dominant ? " (starting colour)" : ""}`}
                      className={radio}
                    >
                      <span
                        title={`${name}${hex === flag.dominant ? " · starting colour" : ""}`}
                        className={circle}
                        style={{ background: hex }}
                      />
                    </Radio>
                  );
                })}
              </RadioGroup>
            </div>
          )}
        </div>
      )}
      <Row label="Mode">
        <ToggleButtonGroup
          aria-label="Colour mode"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[t.mode]}
          onSelectionChange={(k) => setTheme({ mode: [...k][0] as Mode })}
          className="inline-flex gap-0.5 rounded-md border border-line bg-paper p-0.5"
        >
          {modes.map(({ id, label, icon: Icon }) => (
            <ToggleButton
              key={id}
              id={id}
              aria-label={label}
              className="grid size-6 cursor-pointer place-items-center rounded text-muted outline-none transition data-[selected]:bg-ink data-[selected]:text-paper data-[focus-visible]:ring-2 data-[focus-visible]:ring-accent"
            >
              <Icon size={13} />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Row>
    </div>
  );
}
