"use client";

/** The visitor's country for client components: its name and currency come from the API context, never from the code. */
import { createContext, useContext, type ReactNode } from "react";

export interface CountryInfo { readonly name: string; readonly currencyCode: string | null }

const CountryContext = createContext<CountryInfo>({ name: "", currencyCode: null });

export function CountryProvider({ country, children }: { country: CountryInfo; children: ReactNode }) {
  return <CountryContext.Provider value={country}>{children}</CountryContext.Provider>;
}

export const useCountry = (): CountryInfo => useContext(CountryContext);

/** Formats an amount in a currency compactly: `KSh 1.2M` for the Kenya shilling, whatever the country's currency is. */
export function formatMoney(value: number | null | undefined, currencyCode: string | null): string {
  if (value === null || value === undefined) return "—";
  const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
  if (!currencyCode) return compact;
  try {
    const symbol = new Intl.NumberFormat("en", { style: "currency", currency: currencyCode.split(".").pop()!.toUpperCase(), currencyDisplay: "narrowSymbol" })
      .formatToParts(0).find((part) => part.type === "currency")?.value;
    return `${symbol ?? currencyCode} ${compact}`;
  } catch {
    return compact;
  }
}

/** An amount of money in the visitor's country's currency. */
export function Money({ value }: { value: number | null | undefined }) {
  return <>{formatMoney(value, useCountry().currencyCode)}</>;
}
