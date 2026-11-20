"use client";
/** Opens the setup dialog on the first visit (no saved home) or when the address asks for it (`?setup=1`). */
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SetupDialog } from "#/components/preferences/setup-dialog";
import { readCookie } from "#/lib/preferences/pref-cookies";

export function SetupGate() {
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();
  const asked = sp.get("setup") === "1";
  const [first, setFirst] = useState(false);
  useEffect(() => {
    setFirst(path === "/" && !readCookie("mzizi-app-home") && sessionStorageFlag() !== "closed");
  }, [path]);
  const open = asked || first;
  const close = () => {
    try {
      sessionStorage.setItem("mzizi-app-setup", "closed");
    } catch {}
    setFirst(false);
    const params = new URLSearchParams(sp.toString());
    params.delete("setup");
    params.delete("find");
    router.replace(`${path}${params.size ? `?${params}` : ""}`, { scroll: false });
  };
  return <SetupDialog open={open} onClose={close} />;
}

function sessionStorageFlag() {
  try {
    return sessionStorage.getItem("mzizi-app-setup");
  } catch {
    return null;
  }
}
