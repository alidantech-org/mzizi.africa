import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";
import { InstitutionCollectionDto } from "#/modules/governance/schema/dto/institution-collection.dto.ts";
import { InstitutionDetailDto } from "#/modules/governance/schema/dto/institution-detail.dto.ts";
import { InstitutionWindowDto } from "#/modules/governance/schema/dto/institution-window.dto.ts";
import { OfficeDetailDto } from "#/modules/governance/schema/dto/office-detail.dto.ts";
import { GovernanceInstitutionsService } from "./institutions.service.ts";

@Controller()
export class GovernanceInstitutionsController {
  constructor(private readonly service: GovernanceInstitutionsService) {}

  @Get("/v1/governance/institutions")
  @HttpCode(200)
  browseInstitutions(@Query() input: InstitutionWindowDto): Promise<InstitutionCollectionDto> {
    return this.service.browseInstitutions(input);
  }

  @Get("/v1/governance/institutions/:institutionId")
  @HttpCode(200)
  getInstitution(@Param("institutionId") institutionId: string): Promise<InstitutionDetailDto> {
    return this.service.getInstitution({ institutionId });
  }

  @Get("/v1/governance/offices/:officeId")
  @HttpCode(200)
  getOffice(@Param("officeId") officeId: string): Promise<OfficeDetailDto> {
    return this.service.getOffice({ officeId });
  }
}
