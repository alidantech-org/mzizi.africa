import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { CountryScopeDto } from "#/modules/reference/schema/dto/country-scope.dto.ts";
import { HierarchyCollectionDto } from "#/modules/reference/schema/dto/hierarchy-collection.dto.ts";
import { ReferenceDivisionsService } from "./divisions.service.ts";

@Controller()
export class ReferenceDivisionsController {
  constructor(private readonly service: ReferenceDivisionsService) {}

  @Get("/v1/reference/hierarchies")
  @HttpCode(200)
  listHierarchies(@Query() input: CountryScopeDto): Promise<HierarchyCollectionDto> {
    return this.service.listHierarchies(input);
  }
}
