import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { ReferenceCatalogueRepository } from "#/modules/reference/features/catalogue/repositories/catalogue.repository";
import type { MemberCollectionDto } from "#/modules/reference/schema/dto/member-collection.dto";
import type { MemberWindowDto } from "#/modules/reference/schema/dto/member-window.dto";

/**
 * Page through the members of one scheme, including superseded members.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/reference.BrowseSchemeMembers through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class BrowseSchemeMembersUseCase {
  constructor(private readonly repository: ReferenceCatalogueRepository) {}

  async execute(input: MemberWindowDto): Promise<MemberCollectionDto> {
    const result = await this.repository.browseSchemeMembers(input as unknown as Row);
    return {
      values: result,
    } as unknown as MemberCollectionDto;
  }
}
