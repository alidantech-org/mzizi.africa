import { Injectable, NotImplementedException } from '@nestjs/common';
import type { InstitutionDetailDto } from '#/modules/governance/schema/dto/institution-detail.dto';
import type { InstitutionKeyDto } from '#/modules/governance/schema/dto/institution-key.dto';

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