"use client";
/** Voice controls: read the page or a selection aloud, set the spoken-response mode, and speak after navigation. */
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { Square, Volume2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Select, Slider } from "#/components/ui/controls";
import {
  canListen,
  canSpeak,
  getVoice,
  loadVoice,
  readable,
  setVoice,
  speak,
  stopSpeaking,
  subscribeVoice,
  type VoiceMode,
} from "#/lib/accessibility/speech";

const modes = [
  { id: "off", label: copy.preferences.voice.off, hint: copy.preferences.voice.offHint },
  { id: "speak", label: copy.preferences.voice.speak, hint: copy.preferences.voice.speakHint },
  { id: "handsfree", label: copy.preferences.voice.handsfree, hint: copy.preferences.voice.handsfreeHint },
] as const satisfies readonly { id: VoiceMode; label: unknown; hint: unknown }[];

export const useVoice = () => useSyncExternalStore(subscribeVoice, getVoice, getVoice);

/** Reads the current selection, or the main content when nothing is selected. */
export function readMain() {
  const sel = window.getSelection()?.toString().trim();
  speak(sel || readable(document.querySelector("main")));
}

/** Headless: in hands-free mode, reads the heading and first paragraph after each navigation. */
export function VoiceEffects() {
  const v = useVoice();
  const path = usePathname();
  useEffect(() => {
    loadVoice();
  }, []);
  useEffect(() => {
    stopSpeaking();
    if (v.mode !== "handsfree") return;
    const t = setTimeout(() => {
      const h1 = document.querySelector("h1")?.textContent ?? "";
      const p = document.querySelector("main p")?.textContent ?? "";
      speak(`${h1}. ${p}`);
    }, 700);
    return () => clearTimeout(t);
  }, [path, v.mode]);
  return null;
}

/** Voice section of the settings menu: read aloud, response mode and speed. */
export function VoicePanel() {
  const t = useCopy();
  const v = useVoice();
  const [reading, setReading] = useState(false);
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(canSpeak()), []);
  if (!ok) return <p className="text-xs text-muted">{t(copy.preferences.voice.unsupported)}</p>;
  return (
    <div className="space-y-2">
      <button
        onClick={() => (reading ? (stopSpeaking(), setReading(false)) : (readMain(), setReading(true)))}
        className="flex w-full items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-sm hover:bg-accent-soft"
      >
        {reading ? <Square size={14} /> : <Volume2 size={15} />}
        {reading ? t(copy.preferences.voice.stopReading) : t(copy.preferences.voice.readPage)}
      </button>
      <div>
        <div className="mb-1 text-xs text-muted">{t(copy.preferences.voice.responses)}</div>
        <Select
          label={t(copy.preferences.voice.responses)}
          value={v.mode}
          onChange={(id) => {
            setVoice({ mode: id as VoiceMode });
            stopSpeaking();
          }}
          options={modes.map((m) => ({ id: m.id, label: t(m.label), hint: t(m.hint) }))}
        />
      </div>
      <Slider
        label={t(copy.preferences.voice.speed)}
        value={v.rate}
        onChange={(r) => setVoice({ rate: r })}
        min={0.6}
        max={1.6}
        step={0.1}
        format={(r) => `${r.toFixed(1)}×`}
      />
    </div>
  );
}
