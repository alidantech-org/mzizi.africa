import { Injectable } from '@nestjs/common';
import type { FoundMemberDto } from '#/modules/reference/dto/found-member.dto';
import type { MemberCollectionDto } from '#/modules/reference/dto/member-collection.dto';
import type { MemberKeyDto } from '#/modules/reference/dto/member-key.dto';
import type { MemberWindowDto } from '#/modules/reference/dto/member-window.dto';
import type { SchemeCollectionDto } from '#/modules/reference/dto/scheme-collection.dto';
import type { SchemeWindowDto } from '#/modules/reference/dto/scheme-window.dto';
import { BrowseSchemeMembersUseCase } from '#/modules/reference/catalogue/use-cases/browse-scheme-members.usecase';
import { BrowseSchemesUseCase } from '#/modules/reference/catalogue/use-cases/browse-schemes.usecase';
import { LookupMemberUseCase } from '#/modules/reference/catalogue/use-cases/lookup-member.usecase';

/**
 * Catalogue: implements the generated ReferenceCatalogueService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class ReferenceCatalogueServiceImpl {
  constructor(
    private readonly browseSchemeMembersUseCase: BrowseSchemeMembersUseCase,
    private readonly browseSchemesUseCase: BrowseSchemesUseCase,
    private readonly lookupMemberUseCase: LookupMemberUseCase,
  ) {}

  /** Page through the members of one scheme, including superseded members. */
  browseSchemeMembers(input: MemberWindowDto) {
    return this.browseSchemeMembersUseCase.execute(input);
  }

  /** Page through classification schemes in code order. */
  browseSchemes(input: SchemeWindowDto) {
    return this.browseSchemesUseCase.execute(input);
  }

  /** Find one classification member from its code (codes are unique across every scheme). */
  lookupMember(input: MemberKeyDto) {
    return this.lookupMemberUseCase.execute(input);
  }
}