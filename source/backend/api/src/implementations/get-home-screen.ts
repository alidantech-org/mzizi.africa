/** Home: the countries with their names and the languages offered, in the reader's language. */
import { Injectable, Optional } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PersistenceRuntime } from "#/database/persistence/persistence.runtime";
import type { HomeRequestDto } from "#/modules/frontend/schema/dto/home-request.dto";
import { HomeScreenDto } from "#/modules/frontend/schema/dto/home-screen.dto";
import { listCountriesRepository } from "#/modules/reference/features/countries/use-cases/list-countries.repository";
import { ReferenceWindowDto } from "#/modules/reference/schema/dto/reference-window.dto";
import { call } from "./shared/call";
import { loadLanguages } from "./shared/country";
import { LanguageChain } from "./shared/localize";

@Injectable()
export class GetHomeScreenUseCase {
  /** Optional so HTTP specs can mock the service; the application registers the runtime globally. */
  constructor(@Optional() private readonly injected?: PersistenceRuntime) {}

  private get runtime(): PersistenceRuntime {
    if (!this.injected) throw new Error("PersistenceRuntime must be registered");
    return this.injected;
  }

  async execute(input: HomeRequestDto): Promise<HomeScreenDto> {
    const chain = new LanguageChain(input.lang, []);
    const [countries, languages] = await Promise.all([
      call(this.runtime, listCountriesRepository, ReferenceWindowDto, { limit: 200, offset: 0 }),
      loadLanguages(this.runtime),
    ]);
    return plainToInstance(HomeScreenDto, {
      language: chain.primary,
      countries: countries.countries.map((c) => ({ id: c.countryId, code: c.code, isoAlpha2: c.isoAlpha2, name: chain.must(c.names, c.code) })),
      languages: languages.map((l) => ({ code: l.code, tag: l.iso6391 ?? l.code, name: chain.must(l.names, l.code), direction: "ltr" })),
    });
  }
}
