"use client";
/** Reads the enclosing section aloud. Press again to stop. */
import { Square, Volume2 } from "lucide-react";
import { useState } from "react";
import { readable, speak, stopSpeaking } from "#demo/_lib/accessibility/speech";

export function ReadSection() {
  const [on, setOn] = useState(false);
  return (
    <button
      aria-label={on ? "Stop reading" : "Read this section aloud"}
      title={on ? "Stop reading" : "Read this section aloud"}
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
