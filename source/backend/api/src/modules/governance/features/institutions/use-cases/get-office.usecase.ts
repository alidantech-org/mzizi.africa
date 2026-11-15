import { Injectable, NotImplementedException } from '@nestjs/common';
import type { OfficeDetailDto } from '#/modules/governance/schema/dto/office-detail.dto';
import type { OfficeKeyDto } from '#/modules/governance/schema/dto/office-key.dto';

/**
 * One office with everyone who has held it, newest first.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class GetOfficeUseCase {

  async execute(input: OfficeKeyDto): Promise<OfficeDetailDto> {
    throw new NotImplementedException('GetOffice is not implemented yet');
  }
}