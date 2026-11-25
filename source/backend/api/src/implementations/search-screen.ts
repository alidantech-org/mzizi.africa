/** Name search: named things whose names start with the text, each shown once in the reader's language. */
import { Injectable, Optional } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PersistenceRuntime } from "#/database/persistence/persistence.runtime";
import type { SearchRequestDto } from "#/modules/frontend/schema/dto/search-request.dto";
import { SearchResultsDto } from "#/modules/frontend/schema/dto/search-results.dto";
import { searchNamesRepository } from "#/modules/identity/features/things/use-cases/search-names.repository";
import { NameSearchDto } from "#/modules/identity/schema/dto/name-search.dto";
import { call } from "./shared/call";
import { loadCountry } from "./shared/country";
import { LanguageChain } from "./shared/localize";

@Injectable()
export class SearchScreenUseCase {
  /** Optional so HTTP specs can mock the service; the application registers the runtime globally. */
  constructor(@Optional() private readonly injected?: PersistenceRuntime) {}

  private get runtime(): PersistenceRuntime {
    if (!this.injected) throw new Error("PersistenceRuntime must be registered");
    return this.injected;
  }

  async execute(input: SearchRequestDto): Promise<SearchResultsDto> {
    const chain = input.country ? (await loadCountry(this.runtime, input.country, input.lang)).chain : new LanguageChain(input.lang, []);
    const result = await call(this.runtime, searchNamesRepository, NameSearchDto, { text: input.text, limit: 100, offset: 0 });
    const byIdentity = new Map<string, typeof result.matches>();
    for (const match of result.matches) byIdentity.set(match.identityId, [...(byIdentity.get(match.identityId) ?? []), match]);
    const hits = [...byIdentity.values()].slice(0, 20).map((rows) => {
      const first = rows[0];
      return { code: first?.code ?? "", kind: first?.kind ?? "", name: chain.must(rows, first?.code ?? "") };
    });
    return plainToInstance(SearchResultsDto, { language: chain.primary, hits });
  }
}
