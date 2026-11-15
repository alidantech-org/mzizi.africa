import { Injectable, NotImplementedException } from '@nestjs/common';
import type { SchemeCollectionDto } from '#/modules/reference/dto/scheme-collection.dto';
import type { SchemeEntryDto } from '#/modules/reference/dto/scheme-entry.dto';
import type { SchemeWindowDto } from '#/modules/reference/dto/scheme-window.dto';
import type { PageWindowDto } from '#/modules/shared/dto/page-window.dto';

/**
 * Page through classification schemes in code order.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class BrowseSchemesUseCase {

  async execute(input: SchemeWindowDto): Promise<SchemeCollectionDto> {
    throw new NotImplementedException('BrowseSchemes is not implemented yet');
  }
}