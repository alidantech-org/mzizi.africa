import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { StructureStructureRepository } from "#/modules/structure/features/structure/repositories/structure.repository";
import type { StructureDocumentDto } from "#/modules/structure/schema/dto/structure-document.dto";
import type { StructureInputDto } from "#/modules/structure/schema/dto/structure-input.dto";

/**
 * Country governance structure with typed positions, offices, powers, procedures and responsibilities. Scope is explicitly national; missing records do not establish absence.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/structure.GetStructureScreen through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class GetStructureScreenUseCase {
  constructor(private readonly repository: StructureStructureRepository) {}

  async execute(input: StructureInputDto): Promise<StructureDocumentDto> {
    const result = await this.repository.getStructureScreen(input as unknown as Row);
    return result as unknown as StructureDocumentDto;
  }
}
