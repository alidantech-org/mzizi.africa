"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { locate } from "../_lib/actions";
export function WelcomeDialog({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="welcome"
      aria-labelledby="setup-title"
      onCancel={() => {
        window.location.href = "/";
      }}
    >
      {children}
    </dialog>
  );
}
export function DeviceLocation({ country, explicitLanguage }: { country?: string; explicitLanguage?: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const sequence = useRef(0);
  useEffect(() => {
    function cancel() {
      sequence.current++;
      setPending(false);
    }
    document.addEventListener("pointerdown", cancel);
    document.addEventListener("submit", cancel);
    document.addEventListener("keydown", cancel);
    return () => {
      sequence.current++;
      document.removeEventListener("pointerdown", cancel);
      document.removeEventListener("submit", cancel);
      document.removeEventListener("keydown", cancel);
    };
  }, []);
  function request() {
    if (!navigator.geolocation) {
      setMessage("Device location is unavailable. Select a place manually.");
      return;
    }
    const current = ++sequence.current;
    setPending(true);
    setMessage("Requesting device location…");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await locate(position.coords.latitude, position.coords.longitude, position.coords.accuracy, country);
          if (sequence.current !== current) return;
          setMessage(result.message);
          if (result.href) router.push(result.href, { scroll: false });
        } catch {
          if (sequence.current === current) setMessage("Location could not be resolved. Select your place manually.");
        } finally {
          if (sequence.current === current) setPending(false);
        }
      },
      () => {
        if (sequence.current === current) {
          setPending(false);
          setMessage("Location was not shared. Select a place manually.");
        }
      },
      { timeout: 10000, maximumAge: 0 },
    );
  }
  return (
    <div>
      <button type="button" disabled={pending} onClick={request}>
        Use device location
      </button>
      <p role="status">{message}</p>
    </div>
  );
}
