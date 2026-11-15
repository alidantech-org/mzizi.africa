import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { GovernanceInstitutionsRepository } from "#/modules/governance/features/institutions/repositories/institutions.repository";
import type { OfficeDetailDto } from "#/modules/governance/schema/dto/office-detail.dto";
import type { OfficeKeyDto } from "#/modules/governance/schema/dto/office-key.dto";

/**
 * One office with everyone who has held it, newest first.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/governance.GetOffice through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class GetOfficeUseCase {
  constructor(private readonly repository: GovernanceInstitutionsRepository) {}

  async execute(input: OfficeKeyDto): Promise<OfficeDetailDto> {
    const result = await this.repository.getOffice(input as unknown as Row);
    return result as unknown as OfficeDetailDto;
  }
}
