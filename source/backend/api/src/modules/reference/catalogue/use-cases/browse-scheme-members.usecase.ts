import { Injectable, NotImplementedException } from '@nestjs/common';
import type { MemberCollectionDto } from '#/modules/reference/dto/member-collection.dto';
import type { MemberEntryDto } from '#/modules/reference/dto/member-entry.dto';
import type { MemberWindowDto } from '#/modules/reference/dto/member-window.dto';
import type { PageWindowDto } from '#/modules/shared/dto/page-window.dto';

/**
 * Page through the members of one scheme, including superseded members.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class BrowseSchemeMembersUseCase {

  async execute(input: MemberWindowDto): Promise<MemberCollectionDto> {
    throw new NotImplementedException('BrowseSchemeMembers is not implemented yet');
  }
}