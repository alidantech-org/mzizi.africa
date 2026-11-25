import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { ChildOutlineCollectionDto } from "#/modules/geography/schema/dto/child-outline-collection.dto.ts";
import { ChildWindowDto } from "#/modules/geography/schema/dto/child-window.dto.ts";
import { OutlineCollectionDto } from "#/modules/geography/schema/dto/outline-collection.dto.ts";
import { OutlineWindowDto } from "#/modules/geography/schema/dto/outline-window.dto.ts";
import { GeographyMapsService } from "./maps.service.ts";

@Controller()
export class GeographyMapsController {
  constructor(private readonly service: GeographyMapsService) {}

  @Get("/v1/geography/outlines")
  @HttpCode(200)
  getOutline(@Query() input: OutlineWindowDto): Promise<OutlineCollectionDto> {
    return this.service.getOutline(input);
  }

  @Get("/v1/geography/child-outlines")
  @HttpCode(200)
  listChildOutlines(@Query() input: ChildWindowDto): Promise<ChildOutlineCollectionDto> {
    return this.service.listChildOutlines(input);
  }
}
