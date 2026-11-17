import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { LocalityMatchesDto } from "#/modules/locality/schema/dto/locality-matches.dto";
import type { SearchInputDto } from "#/modules/locality/schema/dto/search-input.dto";
import { servedLanguage } from "#/modules/locality/features/places/reads/language.ts";
import { searchPlaces } from "#/modules/locality/features/places/reads/places.ts";

/**
 * Places whose name matches the text, in any language, narrowest units first.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class SearchLocalitiesUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: SearchInputDto): Promise<LocalityMatchesDto> {
    const lang = await servedLanguage(this.db, input.languageCode);
    return { places: await searchPlaces(this.db, input.query, lang, input.limit ?? 20) };
  }
}
