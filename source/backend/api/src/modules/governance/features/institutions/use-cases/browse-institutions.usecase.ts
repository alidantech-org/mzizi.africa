import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { GovernanceInstitutionsRepository } from "#/modules/governance/features/institutions/repositories/institutions.repository";
import type { InstitutionCollectionDto } from "#/modules/governance/schema/dto/institution-collection.dto";
import type { InstitutionWindowDto } from "#/modules/governance/schema/dto/institution-window.dto";

/**
 * Page through public institutions with their names, optionally by code prefix.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/governance.BrowseInstitutions through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class BrowseInstitutionsUseCase {
  constructor(private readonly repository: GovernanceInstitutionsRepository) {}

  async execute(input: InstitutionWindowDto): Promise<InstitutionCollectionDto> {
    const result = await this.repository.browseInstitutions(input as unknown as Row);
    return {
      institutions: result,
    } as unknown as InstitutionCollectionDto;
  }
}
