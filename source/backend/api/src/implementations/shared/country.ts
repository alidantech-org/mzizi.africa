/** Loads a country with its language chain, the step every country screen starts with. */
import { NotFoundException } from "@nestjs/common";
import type { PersistenceRuntime } from "#/database/persistence/persistence.runtime";
import { getCountryRepository } from "#/modules/reference/features/countries/use-cases/get-country.repository";
import { listLanguagesRepository } from "#/modules/reference/features/languages/use-cases/list-languages.repository";
import { CountryKeyDto } from "#/modules/reference/schema/dto/country-key.dto";
import type { CountryDetailDto } from "#/modules/reference/schema/dto/country-detail.dto";
import type { LanguageEntryDto } from "#/modules/reference/schema/dto/language-entry.dto";
import { ReferenceWindowDto } from "#/modules/reference/schema/dto/reference-window.dto";
import { call } from "./call";
import { LanguageChain } from "./localize";

export interface CountryContext {
  readonly country: CountryDetailDto;
  readonly chain: LanguageChain;
  readonly languages: readonly LanguageEntryDto[];
}

export async function loadLanguages(runtime: PersistenceRuntime): Promise<LanguageEntryDto[]> {
  const result = await call(runtime, listLanguagesRepository, ReferenceWindowDto, { limit: 200, offset: 0 });
  return result.languages;
}

export async function loadCountry(runtime: PersistenceRuntime, code: string, lang: string | undefined): Promise<CountryContext> {
  let country: CountryDetailDto;
  try {
    country = await call(runtime, getCountryRepository, CountryKeyDto, { code });
  } catch {
    throw new NotFoundException(`country ${code} not found`);
  }
  const locales = [...country.locales].sort((a, b) => a.position - b.position).map((l) => l.languageCode);
  return { country, chain: new LanguageChain(lang, locales), languages: await loadLanguages(runtime) };
}
