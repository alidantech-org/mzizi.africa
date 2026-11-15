import {
  Controller,
  Get,
  HttpCode,
  Query,
} from "@nestjs/common";
import { FoundMemberDto } from "#/modules/reference/schema/dto/found-member.dto.ts";
import { MemberCollectionDto } from "#/modules/reference/schema/dto/member-collection.dto.ts";
import { MemberKeyDto } from "#/modules/reference/schema/dto/member-key.dto.ts";
import { MemberWindowDto } from "#/modules/reference/schema/dto/member-window.dto.ts";
import { SchemeCollectionDto } from "#/modules/reference/schema/dto/scheme-collection.dto.ts";
import { SchemeWindowDto } from "#/modules/reference/schema/dto/scheme-window.dto.ts";
import { ReferenceCatalogueService } from "./catalogue.service.ts";

@Controller()
export class ReferenceCatalogueController {
  constructor(private readonly service: ReferenceCatalogueService) {}


  @Get("/v1/reference/values")
  @HttpCode(200)
  browseSchemeMembers(
    @Query() input: MemberWindowDto,
  ): Promise<MemberCollectionDto> {
    return this.service.browseSchemeMembers(input);
  }


  @Get("/v1/reference/schemes")
  @HttpCode(200)
  browseSchemes(
    @Query() input: SchemeWindowDto,
  ): Promise<SchemeCollectionDto> {
    return this.service.browseSchemes(input);
  }


  @Get("/v1/reference/lookup")
  @HttpCode(200)
  lookupMember(
    @Query() input: MemberKeyDto,
  ): Promise<FoundMemberDto> {
    return this.service.lookupMember(input);
  }
}