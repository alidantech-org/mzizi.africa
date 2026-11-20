/** Server side: reads the preference cookies so the first HTML already matches what the reader chose. */
import { cookies } from "next/headers";
import {
  COOKIES,
  decodeA11y,
  decodeGroups,
  decodePlace,
  decodeSide,
  decodeTheme,
  type PrefsInit,
} from "#demo/_lib/preferences/pref-cookies";

export async function readPrefs(): Promise<PrefsInit> {
  const jar = await cookies();
  const v = (name: string) => {
    const raw = jar.get(name)?.value;
    try {
      return raw === undefined ? undefined : decodeURIComponent(raw);
    } catch {
      return raw;
    }
  };
  const place = decodePlace(v(COOKIES.place));
  const { theme } = decodeTheme(v(COOKIES.theme));
  return {
    theme: { ...theme, country: place?.country ?? "" },
    a11y: decodeA11y(v(COOKIES.a11y)),
    side: decodeSide(v(COOKIES.side)),
    groups: decodeGroups(v(COOKIES.groups)),
    place,
  };
}
