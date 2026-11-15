import { Injectable, NotImplementedException } from '@nestjs/common';
import type { OfficeDetailHoldersNamesDto } from '#/modules/governance/dto/office-detail-holders-names.dto';
import type { OfficeDetailHoldersDto } from '#/modules/governance/dto/office-detail-holders.dto';
import type { OfficeDetailDto } from '#/modules/governance/dto/office-detail.dto';
import type { OfficeKeyDto } from '#/modules/governance/dto/office-key.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';

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