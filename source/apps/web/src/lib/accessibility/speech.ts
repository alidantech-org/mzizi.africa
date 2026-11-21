/** Browser speech: read text aloud, listen for a spoken query, and share voice settings across components. */
export type VoiceMode = "off" | "speak" | "handsfree";
export type VoiceSettings = {
  mode: VoiceMode;
  rate: number;
  pitch: number;
  volume: number;
  /** Speak the text under the pointer (or focus) while on. */
  hover: boolean;
  /** Chosen voice per interface language, by the browser's voice URI. */
  voices: Record<string, string>;
};

type Result = { isFinal: boolean; 0: { transcript: string } };
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<Result> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
}
type RecognitionCtor = new () => Recognition;
const ctor = (): RecognitionCtor | undefined => {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;
export const canListen = () => typeof window !== "undefined" && !!ctor();

let current: VoiceSettings = { mode: "off", rate: 1, pitch: 1, volume: 1, hover: false, voices: {} };
const listeners = new Set<() => void>();
export const getVoice = () => current;
export const subscribeVoice = (fn: () => void) => (listeners.add(fn), () => listeners.delete(fn));
export function setVoice(next: Partial<VoiceSettings>) {
  current = { ...current, ...next };
  try {
    localStorage.setItem("mzizi-app-voice", JSON.stringify(current));
  } catch {}
  listeners.forEach((l) => l());
}
export function loadVoice() {
  try {
    const raw = localStorage.getItem("mzizi-app-voice");
    if (raw) {
      current = { ...current, ...JSON.parse(raw) };
      listeners.forEach((l) => l());
    }
  } catch {}
}

const languageOf = () => (document.documentElement.lang || "en").toLowerCase().slice(0, 2);

/** Voices the browser offers for a language, local ones first. Empty when it has none. */
export function voicesFor(lang: string): SpeechSynthesisVoice[] {
  if (!canSpeak()) return [];
  return speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()))
    .sort((a, b) => Number(b.localService) - Number(a.localService) || a.name.localeCompare(b.name));
}

/** The voice to speak with: the reader's choice for the language when still offered, else the best one for it, else none. */
export function pickVoice(lang = languageOf()): SpeechSynthesisVoice | null {
  const list = voicesFor(lang);
  return list.find((v) => v.voiceURI === current.voices[lang]) ?? list[0] ?? null;
}

/** Calls back when the browser's voice list is ready or changes (it loads late in some browsers). */
export function onVoicesChanged(fn: () => void): () => void {
  if (!canSpeak()) return () => {};
  speechSynthesis.addEventListener("voiceschanged", fn);
  return () => speechSynthesis.removeEventListener("voiceschanged", fn);
}

export function stopSpeaking() {
  if (canSpeak()) speechSynthesis.cancel();
}

/** Speaks text in sentence-sized pieces so long sections do not cut off. */
export function speak(text: string, onEnd?: () => void) {
  if (!canSpeak()) return;
  speechSynthesis.cancel();
  const parts =
    text
      .replace(/\s+/g, " ")
      .match(/[^.!?]+[.!?]*/g)
      ?.map((p) => p.trim())
      .filter(Boolean) ?? [];
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p);
    const lang = languageOf();
    const voice = pickVoice(lang);
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? lang;
    u.rate = current.rate;
    u.pitch = current.pitch;
    u.volume = current.volume;
    if (i === parts.length - 1 && onEnd) u.onend = onEnd;
    speechSynthesis.speak(u);
  });
}

export function listen(onText: (text: string, final: boolean) => void, onEnd: () => void): (() => void) | null {
  const R = ctor();
  if (!R) return null;
  const rec = new R();
  rec.lang = document.documentElement.lang || "en";
  rec.interimResults = true;
  rec.continuous = false;
  rec.onresult = (e) => {
    const r = e.results[e.results.length - 1];
    onText(r[0].transcript, r.isFinal);
  };
  rec.onend = onEnd;
  rec.onerror = onEnd;
  rec.start();
  return () => rec.stop();
}

/** Text of a section for reading aloud, without hidden or decorative parts. */
export function readable(el: Element | null, limit = 7000): string {
  if (!el) return "";
  const clone = el.cloneNode(true) as Element;
  clone.querySelectorAll("svg, script, style, button, [aria-hidden=true], nav").forEach((n) => n.remove());
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, limit);
}
