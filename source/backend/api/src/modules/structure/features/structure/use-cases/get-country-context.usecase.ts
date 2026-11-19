import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { StructureStructureRepository } from "#/modules/structure/features/structure/repositories/structure.repository";
import type { CountryContextDocumentDto } from "#/modules/structure/schema/dto/country-context-document.dto";
import type { StructureInputDto } from "#/modules/structure/schema/dto/structure-input.dto";

/**
 * Explicit country identity and recorded routing roots; no default-country inference.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/structure.GetCountryContext through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class GetCountryContextUseCase {
  constructor(private readonly repository: StructureStructureRepository) {}

  async execute(input: StructureInputDto): Promise<CountryContextDocumentDto> {
    const result = await this.repository.getCountryContext(input as unknown as Row);
    return result as unknown as CountryContextDocumentDto;
  }
}
