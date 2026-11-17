import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { LanguageListDto } from "#/modules/locality/schema/dto/language-list.dto";
import { languageChoices } from "#/modules/locality/features/places/reads/language.ts";

/**
 * The languages the system can serve names and labels in, for a language picker.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class ListLanguagesUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(): Promise<LanguageListDto> {
    return { languages: await languageChoices(this.db) };
  }
}
