"use client";
/** Reads the enclosing section aloud. Press again to stop. */
import { Square, Volume2 } from "lucide-react";
import { useState } from "react";
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { readable, speak, stopSpeaking } from "#/lib/accessibility/speech";

export function ReadSection() {
  const t = useCopy();
  const [on, setOn] = useState(false);
  const label = on ? t(copy.preferences.voice.stopReading) : t(copy.preferences.voice.readSection);
  return (
    <button
      aria-label={label}
      title={label}
      onClick={(e) => {
        if (on) {
          stopSpeaking();
          setOn(false);
          return;
        }
        const section = e.currentTarget.closest("section");
        const title = section?.querySelector("h2")?.textContent ?? "";
        speak(`${title}. ${readable(section)}`, () => setOn(false));
        setOn(true);
      }}
      className="grid size-6 shrink-0 place-items-center rounded-md text-muted hover:bg-accent-soft hover:text-ink"
    >
      {on ? <Square size={12} /> : <Volume2 size={14} />}
    </button>
  );
}
