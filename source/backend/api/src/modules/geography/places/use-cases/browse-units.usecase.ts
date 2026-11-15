import { Injectable, NotImplementedException } from '@nestjs/common';
import type { UnitCollectionDto } from '#/modules/geography/dto/unit-collection.dto';
import type { UnitEntryNamesDto } from '#/modules/geography/dto/unit-entry-names.dto';
import type { UnitEntryDto } from '#/modules/geography/dto/unit-entry.dto';
import type { UnitWindowDto } from '#/modules/geography/dto/unit-window.dto';
import type { PageWindowDto } from '#/modules/shared/dto/page-window.dto';

/**
 * Browse administrative units with their names, optionally for one country or by code prefix.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class BrowseUnitsUseCase {

  async execute(input: UnitWindowDto): Promise<UnitCollectionDto> {
    throw new NotImplementedException('BrowseUnits is not implemented yet');
  }
}