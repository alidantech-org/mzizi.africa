import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { ReferenceCatalogueRepository } from "#/modules/reference/features/catalogue/repositories/catalogue.repository";
import type { SchemeCollectionDto } from "#/modules/reference/schema/dto/scheme-collection.dto";
import type { SchemeWindowDto } from "#/modules/reference/schema/dto/scheme-window.dto";

/**
 * Page through classification schemes in code order.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/reference.BrowseSchemes through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class BrowseSchemesUseCase {
  constructor(private readonly repository: ReferenceCatalogueRepository) {}

  async execute(input: SchemeWindowDto): Promise<SchemeCollectionDto> {
    const result = await this.repository.browseSchemes(input as unknown as Row);
    return {
      schemes: result,
    } as unknown as SchemeCollectionDto;
  }
}
