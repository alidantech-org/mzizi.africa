import { Injectable, NotImplementedException } from '@nestjs/common';
import type { InstitutionCollectionDto } from '#/modules/governance/dto/institution-collection.dto';
import type { InstitutionEntryNamesDto } from '#/modules/governance/dto/institution-entry-names.dto';
import type { InstitutionEntryDto } from '#/modules/governance/dto/institution-entry.dto';
import type { InstitutionWindowDto } from '#/modules/governance/dto/institution-window.dto';
import type { PageWindowDto } from '#/modules/shared/dto/page-window.dto';

/**
 * Page through public institutions with their names, optionally by code prefix.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class BrowseInstitutionsUseCase {

  async execute(input: InstitutionWindowDto): Promise<InstitutionCollectionDto> {
    throw new NotImplementedException('BrowseInstitutions is not implemented yet');
  }
}