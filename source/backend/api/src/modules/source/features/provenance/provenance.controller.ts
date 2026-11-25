import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { EvidenceCollectionDto } from "#/modules/source/schema/dto/evidence-collection.dto.ts";
import { RowEvidenceDto } from "#/modules/source/schema/dto/row-evidence.dto.ts";
import { SourceCollectionDto } from "#/modules/source/schema/dto/source-collection.dto.ts";
import { SourceWindowDto } from "#/modules/source/schema/dto/source-window.dto.ts";
import { SourceProvenanceService } from "./provenance.service.ts";

@Controller()
export class SourceProvenanceController {
  constructor(private readonly service: SourceProvenanceService) {}

  @Get("/v1/source/evidence")
  @HttpCode(200)
  listEvidence(@Query() input: RowEvidenceDto): Promise<EvidenceCollectionDto> {
    return this.service.listEvidence(input);
  }

  @Get("/v1/source/sources")
  @HttpCode(200)
  listSources(@Query() input: SourceWindowDto): Promise<SourceCollectionDto> {
    return this.service.listSources(input);
  }
}
