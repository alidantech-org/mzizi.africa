import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { GovernanceInstitutionsRepository } from "#/modules/governance/features/institutions/repositories/institutions.repository";
import type { InstitutionDetailDto } from "#/modules/governance/schema/dto/institution-detail.dto";
import type { InstitutionKeyDto } from "#/modules/governance/schema/dto/institution-key.dto";

/**
 * One institution with its mandates and offices.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/governance.GetInstitution through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class GetInstitutionUseCase {
  constructor(private readonly repository: GovernanceInstitutionsRepository) {}

  async execute(input: InstitutionKeyDto): Promise<InstitutionDetailDto> {
    const result = await this.repository.getInstitution(input as unknown as Row);
    return result as unknown as InstitutionDetailDto;
  }
}
