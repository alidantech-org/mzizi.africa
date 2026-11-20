/** Browser speech: read text aloud, listen for a spoken query, and share voice settings across components. */
export type VoiceMode = "off" | "speak" | "handsfree";
export type VoiceSettings = { mode: VoiceMode; rate: number };

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

let current: VoiceSettings = { mode: "off", rate: 1 };
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
    u.rate = current.rate;
    u.lang = "en-KE";
    if (i === parts.length - 1 && onEnd) u.onend = onEnd;
    speechSynthesis.speak(u);
  });
}

export function listen(onText: (text: string, final: boolean) => void, onEnd: () => void): (() => void) | null {
  const R = ctor();
  if (!R) return null;
  const rec = new R();
  rec.lang = "en-KE";
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
