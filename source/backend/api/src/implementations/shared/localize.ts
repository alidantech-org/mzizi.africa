/**
 * Choosing the text to show (FOUNDATION_REDESIGN section 7.3): the requested language, then the country's locales in
 * order, then `mul`, then `en`, then any. Every frontend screen uses this; no screen writes its own fallback.
 */
import { plainToInstance } from "class-transformer";
import type { TrustedContext } from "#/database/persistence/persistence.types";
import { LocalizedTextDto } from "#/modules/shared/schema/dto/localized-text.dto";

/** The two fixed steps at the end of every chain, as `reference.languages.code` values (`.docs/rules/codes.md`). */
export const SHARED_LANGUAGE = "ref.lng.mul";
export const LAST_RESORT_LANGUAGE = "ref.lng.en";

/** Requests carry no principal yet; reads need no policy. */
export const PUBLIC_CONTEXT: TrustedContext = { principal: null, policies: new Map() };

/** The shape every generated name or label row shares. */
export interface NameRow {
  readonly text: string;
  readonly languageCode: string | null;
  readonly languageIso?: string | null;
  readonly isDefault?: boolean | null;
  readonly toYear?: number | null;
}

export class LanguageChain {
  readonly order: readonly string[];
  constructor(
    readonly requested: string | undefined,
    locales: readonly string[],
    private readonly rtl: ReadonlySet<string> = new Set(),
  ) {
    const all = [requested, ...locales, SHARED_LANGUAGE, LAST_RESORT_LANGUAGE].filter((code): code is string => !!code);
    this.order = [...new Set(all)];
  }

  /** The reader's language: the requested one, else the country's first locale. */
  get primary(): string {
    return this.order[0] ?? LAST_RESORT_LANGUAGE;
  }

  pick(rows: readonly NameRow[] | null | undefined): LocalizedTextDto | undefined {
    const current = (rows ?? []).filter((row) => row.toYear === null || row.toYear === undefined);
    const pool = current.length > 0 ? current : (rows ?? []);
    if (pool.length === 0) return undefined;
    let chosen: NameRow | undefined;
    for (const code of this.order) {
      const matches = pool.filter((row) => row.languageCode === code);
      chosen = matches.find((row) => row.isDefault) ?? matches[0];
      if (chosen) break;
    }
    chosen ??= pool.find((row) => row.isDefault) ?? pool[0];
    if (!chosen) return undefined;
    const language = chosen.languageCode ?? LAST_RESORT_LANGUAGE;
    return plainToInstance(LocalizedTextDto, {
      text: chosen.text,
      language: chosen.languageIso ?? language,
      isFallback: language !== this.primary && language !== SHARED_LANGUAGE,
      direction: this.rtl.has(language) ? "rtl" : "ltr",
    });
  }

  /** Like `pick`, for texts that must exist: an untitled row shows its code. */
  must(rows: readonly NameRow[] | null | undefined, code: string): LocalizedTextDto {
    return (
      this.pick(rows) ??
      plainToInstance(LocalizedTextDto, { text: code, language: "und", isFallback: true, direction: "ltr" })
    );
  }
}
