import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { ReferenceCatalogueRepository } from "#/modules/reference/features/catalogue/repositories/catalogue.repository";
import type { FoundMemberDto } from "#/modules/reference/schema/dto/found-member.dto";
import type { MemberKeyDto } from "#/modules/reference/schema/dto/member-key.dto";

/**
 * Find one classification member from its code (codes are unique across every scheme).
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/reference.LookupMember through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class LookupMemberUseCase {
  constructor(private readonly repository: ReferenceCatalogueRepository) {}

  async execute(input: MemberKeyDto): Promise<FoundMemberDto> {
    const result = await this.repository.lookupMember(input as unknown as Row);
    return result as unknown as FoundMemberDto;
  }
}
