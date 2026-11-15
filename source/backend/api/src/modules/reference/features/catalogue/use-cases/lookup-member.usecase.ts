import { Injectable, NotImplementedException } from '@nestjs/common';
import type { FoundMemberDto } from '#/modules/reference/schema/dto/found-member.dto';
import type { MemberKeyDto } from '#/modules/reference/schema/dto/member-key.dto';

/**
 * Find one classification member from its code (codes are unique across every scheme).
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class LookupMemberUseCase {

  async execute(input: MemberKeyDto): Promise<FoundMemberDto> {
    throw new NotImplementedException('LookupMember is not implemented yet');
  }
}