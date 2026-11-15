import { Injectable, NotImplementedException } from '@nestjs/common';
import type { UnitDetailDto } from '#/modules/geography/schema/dto/unit-detail.dto';
import type { UnitKeyDto } from '#/modules/geography/schema/dto/unit-key.dto';

/**
 * One administrative unit with its names.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class GetUnitUseCase {

  async execute(input: UnitKeyDto): Promise<UnitDetailDto> {
    throw new NotImplementedException('GetUnit is not implemented yet');
  }
}