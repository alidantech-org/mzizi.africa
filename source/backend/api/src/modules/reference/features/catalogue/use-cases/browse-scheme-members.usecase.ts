import { Injectable, NotImplementedException } from '@nestjs/common';
import type { MemberCollectionDto } from '#/modules/reference/schema/dto/member-collection.dto';
import type { MemberWindowDto } from '#/modules/reference/schema/dto/member-window.dto';

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