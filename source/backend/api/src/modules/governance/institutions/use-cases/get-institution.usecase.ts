import { Injectable, NotImplementedException } from '@nestjs/common';
import type { InstitutionDetailMandatesDto } from '#/modules/governance/dto/institution-detail-mandates.dto';
import type { InstitutionDetailNamesDto } from '#/modules/governance/dto/institution-detail-names.dto';
import type { InstitutionDetailOfficesDto } from '#/modules/governance/dto/institution-detail-offices.dto';
import type { InstitutionDetailDto } from '#/modules/governance/dto/institution-detail.dto';
import type { InstitutionKeyDto } from '#/modules/governance/dto/institution-key.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';

/**
 * One institution with its mandates and offices.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class GetInstitutionUseCase {

  async execute(input: InstitutionKeyDto): Promise<InstitutionDetailDto> {
    throw new NotImplementedException('GetInstitution is not implemented yet');
  }
}