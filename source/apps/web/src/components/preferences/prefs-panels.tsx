"use client";
/** The two preference panels, shared by the settings popover and the preferences page: Theme and Sound. */
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { Check } from "lucide-react";
import { setA11y, useA11y } from "#/lib/preferences/prefs";
import { Switch } from "#/components/ui/controls";
import { ThemeSwitcher } from "#/components/preferences/theme-switcher";
import { VoicePanel } from "#/components/accessibility/voice-bar";

const contrasts = [
  { id: "standard", label: copy.preferences.contrast.standard, sample: ["#fcf9f2", "#1d1a16"] },
  { id: "high", label: copy.preferences.contrast.high, sample: ["#000", "#fff"] },
  { id: "high-light", label: copy.preferences.contrast.highLight, sample: ["#fff", "#000"] },
  { id: "yellow", label: copy.preferences.contrast.yellow, sample: ["#000", "#ffee00"] },
  { id: "yellow-light", label: copy.preferences.contrast.yellowLight, sample: ["#ffee00", "#000"] },
];
const sizes: [number, string][] = [
  [100, "A"],
  [115, "A+"],
  [130, "A++"],
  [150, "A+++"],
];

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">{children}</h3>
);

/** Colours, contrast, text size and display options. */
export function LookPanel() {
  const t = useCopy();
  const a = useA11y();
  return (
    <div className="space-y-5">
      <section>
        <SectionTitle>{t(copy.preferences.section.colours)}</SectionTitle>
        <ThemeSwitcher />
      </section>
      <section>
        <SectionTitle>{t(copy.preferences.section.contrast)}</SectionTitle>
        <div role="radiogroup" aria-label={t(copy.preferences.section.contrast)} className="grid grid-cols-2 gap-1.5">
          {contrasts.map((c, i) => (
            <button
              key={c.id}
              role="radio"
              aria-checked={a.contrast === c.id}
              onClick={() => setA11y({ contrast: c.id })}
              className={`flex h-9 items-center gap-2 rounded-md border px-2 text-left text-xs ${i === contrasts.length - 1 ? "col-span-2" : ""} ${a.contrast === c.id ? "border-accent bg-accent-soft" : "border-line hover:border-muted"}`}
            >
              <span
                className="grid size-5 shrink-0 place-items-center rounded border border-line text-[10px] font-bold"
                style={{ background: c.sample[0], color: c.sample[1] }}
              >
                {t(copy.preferences.contrast.sample)}
              </span>
              <span className="flex-1 truncate">{t(c.label)}</span>
              {a.contrast === c.id && <Check size={12} className="text-accent" />}
            </button>
          ))}
        </div>
      </section>
      <section>
        <SectionTitle>{t(copy.preferences.section.textSize)}</SectionTitle>
        <div
          role="radiogroup"
          aria-label={t(copy.preferences.section.textSize)}
          className="inline-flex w-full gap-0.5 rounded-md border border-line bg-paper p-0.5"
        >
          {sizes.map(([v, l]) => (
            <button
              key={v}
              role="radio"
              aria-checked={a.size === v}
              onClick={() => setA11y({ size: v })}
              className={`h-7 flex-1 rounded text-xs ${a.size === v ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </section>
      <section>
        <SectionTitle>{t(copy.preferences.section.display)}</SectionTitle>
        <div className="-mx-2">
          <Switch selected={a.links} onChange={(v) => setA11y({ links: v })}>
            {t(copy.preferences.display.links)}
          </Switch>
          <Switch selected={a.motion} onChange={(v) => setA11y({ motion: v })}>
            {t(copy.preferences.display.motion)}
          </Switch>
          <Switch selected={a.spacing} onChange={(v) => setA11y({ spacing: v })}>
            {t(copy.preferences.display.spacing)}
          </Switch>
        </div>
      </section>
    </div>
  );
}

/** Read aloud, spoken responses and speed. */
export function AudioPanel() {
  const t = useCopy();
  return (
    <div className="space-y-4">
      <section>
        <SectionTitle>{t(copy.preferences.section.voice)}</SectionTitle>
        <VoicePanel />
      </section>
      <p className="text-xs leading-relaxed text-muted">
        {t(copy.preferences.voice.note)}
      </p>
    </div>
  );
}
