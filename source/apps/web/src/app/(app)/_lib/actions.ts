"use server";
import { setupLink } from "./navigation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSetupBootstrap, getExplorerContext, resolveExplorerCoordinates } from "@mzizi/api-client/actions/explorer.actions.ts";

function text(data: FormData, key: string) {
  const entry = data.get(key);
  return typeof entry === "string" ? entry : "";
}
export async function completeSetup(data: FormData) {
  const language = text(data, "language") || "en";
  const catalogue = await getSetupBootstrap({ query: { languageCode: language } });
  if (!catalogue.success || !catalogue.body?.languages.some((item) => item.code === language))
    throw new Error("Choose a registered language.");
  const result = await getExplorerContext({
    query: { countryCode: text(data, "country").toUpperCase(), featureId: text(data, "place"), languageCode: language },
  });
  if (!result.success || !result.body) throw new Error(result.message || "This place could not be confirmed.");
  const theme = text(data, "theme");
  if (!["system", "light", "dark"].includes(theme)) throw new Error("Choose a supported appearance.");
  const jar = await cookies();
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 31536000,
  };
  jar.set("mzizi-language", language, options);
  jar.set("mzizi-theme", theme, options);
  jar.set("mzizi-place", result.body.place.canonicalPath, options);
  jar.set("mzizi-setup", "complete", options);
  redirect(
    result.body.place.canonicalPath + (text(data, "explicitLanguage") === "yes" ? `?lang=${encodeURIComponent(language)}` : ""),
  );
}
export async function locate(latitude: number, longitude: number, accuracyMeters: number, countryCode?: string) {
  if (![latitude, longitude, accuracyMeters].every(Number.isFinite))
    return { href: null, message: "The device did not return a valid position." };
  const response = await resolveExplorerCoordinates({
    body: { latitude, longitude, accuracyMeters, countryCode: countryCode?.toUpperCase() },
  });
  if (!response.success || !response.body)
    return { href: null, message: response.message || "Location could not be resolved. Select your place manually." };
  if (response.body.status !== "matched" || response.body.candidates.length !== 1)
    return { href: null, message: "The recorded boundaries do not identify one place. Select your place manually." };
  const place = response.body.candidates[0]!;
  return {
    href: setupLink({ "filters.country": place.countryCode, "view.entity": "place", "view.id": place.featureId }),
    message: "Confirm the suggested place before saving.",
  };
}

export async function persistLanguage(language: string) {
  const result = await getSetupBootstrap({ query: { languageCode: language } });
  if (!result.success || !result.body?.languages.some((item) => item.code === language))
    throw new Error("This language is not available.");
  (await cookies()).set("mzizi-language", language, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 31536000,
  });
}
