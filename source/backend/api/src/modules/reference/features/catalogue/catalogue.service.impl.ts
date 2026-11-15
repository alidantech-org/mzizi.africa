import { Injectable } from '@nestjs/common';
import type { MemberKeyDto } from '#/modules/reference/schema/dto/member-key.dto';
import type { MemberWindowDto } from '#/modules/reference/schema/dto/member-window.dto';
import type { SchemeWindowDto } from '#/modules/reference/schema/dto/scheme-window.dto';
import { BrowseSchemeMembersUseCase } from '#/modules/reference/features/catalogue/use-cases/browse-scheme-members.usecase';
import { BrowseSchemesUseCase } from '#/modules/reference/features/catalogue/use-cases/browse-schemes.usecase';
import { LookupMemberUseCase } from '#/modules/reference/features/catalogue/use-cases/lookup-member.usecase';

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