"use client";
/** Voice controls: read the page or a selection aloud, set the spoken-response mode, and speak after navigation. */
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { Square, Volume2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useLanguage } from "#/lib/copy/copy";
import { Select, Slider, Switch } from "#/components/ui/controls";
import {
  canListen,
  canSpeak,
  getVoice,
  loadVoice,
  onVoicesChanged,
  pickVoice,
  voicesFor,
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

/** The nearest readable block under an element. */
const BLOCK = "h1,h2,h3,h4,h5,h6,p,li,td,th,dt,dd,label,button,a,summary,[role=button],[role=tab],[role=menuitem],[data-speak]";
const spoken = (el: Element) =>
  (el.getAttribute("aria-label") ?? "").trim() || (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 400);

/** Headless: while hover speech is on, text under the pointer or focus is read after a short pause. */
export function HoverSpeech() {
  const on = useVoice().hover;
  useEffect(() => {
    if (!on) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let last: Element | null = null;
    const aim = (target: EventTarget | null) => {
      const el = target instanceof Element ? target.closest(BLOCK) : null;
      if (!el || el === last) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const text = spoken(el);
        if (!text) return;
        last = el;
        speak(text);
      }, 350);
    };
    const over = (e: Event) => aim(e.target);
    const out = () => {
      clearTimeout(timer);
      last = null;
    };
    document.addEventListener("mouseover", over);
    document.addEventListener("focusin", over);
    document.addEventListener("mouseleave", out);
    return () => {
      clearTimeout(timer);
      stopSpeaking();
      document.removeEventListener("mouseover", over);
      document.removeEventListener("focusin", over);
      document.removeEventListener("mouseleave", out);
    };
  }, [on]);
  return null;
}

/** Voice section of the settings menu: read aloud, response mode and speed. */
export function VoicePanel() {
  const t = useCopy();
  const v = useVoice();
  const [reading, setReading] = useState(false);
  const [ok, setOk] = useState(false);
  const lang = useLanguage();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    setOk(canSpeak());
    return onVoicesChanged(() => setTick((n) => n + 1));
  }, []);
  void tick;
  const list = ok ? voicesFor(lang) : [];
  const chosen = ok ? pickVoice(lang) : null;
  const languageName = new Intl.DisplayNames([lang], { type: "language" }).of(lang) ?? lang;
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
      <Switch selected={v.hover} onChange={(on) => setVoice({ hover: on })}>
        {t(copy.preferences.voice.hover)}
      </Switch>
      <p className="px-2 text-xs text-muted">{t(copy.preferences.voice.hoverHint)}</p>
      {list.length ? (
        <div>
          <div className="mb-1 text-xs text-muted">{t(copy.preferences.voice.voiceChoice)}</div>
          <Select
            label={t(copy.preferences.voice.voiceChoice)}
            value={chosen?.voiceURI ?? ""}
            onChange={(id) => setVoice({ voices: { ...v.voices, [lang]: id } })}
            options={list.map((x) => ({ id: x.voiceURI, label: x.name }))}
          />
        </div>
      ) : (
        <p className="text-xs text-muted">{t(copy.preferences.voice.noVoice, { language: languageName })}</p>
      )}
      <Slider
        label={t(copy.preferences.voice.pitch)}
        value={v.pitch}
        onChange={(r) => setVoice({ pitch: r })}
        min={0.5}
        max={1.5}
        step={0.1}
        format={(r) => r.toFixed(1)}
      />
      <Slider
        label={t(copy.preferences.voice.volume)}
        value={v.volume}
        onChange={(r) => setVoice({ volume: r })}
        min={0.1}
        max={1}
        step={0.1}
        format={(r) => `${Math.round(r * 100)}%`}
      />
      <button
        onClick={() => speak(t(copy.preferences.voice.sample))}
        className="flex w-full items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-sm hover:bg-accent-soft"
      >
        <Volume2 size={15} />
        {t(copy.preferences.voice.test)}
      </button>
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
