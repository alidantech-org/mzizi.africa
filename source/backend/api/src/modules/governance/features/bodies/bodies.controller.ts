import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { GovernanceIdentityScopeDto } from "#/modules/governance/schema/dto/governance-identity-scope.dto.ts";
import { InstitutionCollectionDto } from "#/modules/governance/schema/dto/institution-collection.dto.ts";
import { InstitutionDetailDto } from "#/modules/governance/schema/dto/institution-detail.dto.ts";
import { InstitutionWindowDto } from "#/modules/governance/schema/dto/institution-window.dto.ts";
import { PowerCollectionDto } from "#/modules/governance/schema/dto/power-collection.dto.ts";
import { RelationshipCollectionDto } from "#/modules/governance/schema/dto/relationship-collection.dto.ts";
import { GovernanceBodiesService } from "./bodies.service.ts";

@Controller()
export class GovernanceBodiesController {
  constructor(private readonly service: GovernanceBodiesService) {}

  @Get("/v1/governance/institutions")
  @HttpCode(200)
  listInstitutions(@Query() input: InstitutionWindowDto): Promise<InstitutionCollectionDto> {
    return this.service.listInstitutions(input);
  }

  @Get("/v1/governance/members")
  @HttpCode(200)
  listMembers(@Query() input: GovernanceIdentityScopeDto): Promise<RelationshipCollectionDto> {
    return this.service.listMembers(input);
  }

  @Get("/v1/governance/powers")
  @HttpCode(200)
  listPowers(@Query() input: GovernanceIdentityScopeDto): Promise<PowerCollectionDto> {
    return this.service.listPowers(input);
  }

  @Get("/v1/governance/institutions/:code")
  @HttpCode(200)
  getInstitution(@Param("code") code: string): Promise<InstitutionDetailDto> {
    return this.service.getInstitution({ code });
  }
}
