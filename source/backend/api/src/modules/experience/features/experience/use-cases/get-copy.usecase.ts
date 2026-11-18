import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { copyCatalog } from "./../reads/copy.ts";
import type { CopyCatalogDto } from "#/modules/experience/schema/dto/copy-catalog.dto";
import type { CopyInputDto } from "#/modules/experience/schema/dto/copy-input.dto";

/**
 * The interface wording for one language, with the country's own wording where it differs. Screens declare copy keys; the words are delivered from here.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class GetCopyUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: CopyInputDto): Promise<CopyCatalogDto> {
    return (await copyCatalog(this.db, input.languageCode ?? "en", input.countryCode, input.prefix)) as unknown as CopyCatalogDto;
  }
}
