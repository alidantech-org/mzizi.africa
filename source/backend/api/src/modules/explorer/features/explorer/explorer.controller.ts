import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { BootstrapInputDto } from "#/modules/explorer/schema/dto/bootstrap-input.dto.ts";
import { BootstrapDto } from "#/modules/explorer/schema/dto/bootstrap.dto.ts";
import { ChildrenInputDto } from "#/modules/explorer/schema/dto/children-input.dto.ts";
import { ContextDto } from "#/modules/explorer/schema/dto/context.dto.ts";
import { CoordinatesInputDto } from "#/modules/explorer/schema/dto/coordinates-input.dto.ts";
import { CopyBundleDto } from "#/modules/explorer/schema/dto/copy-bundle.dto.ts";
import { CopyInputDto } from "#/modules/explorer/schema/dto/copy-input.dto.ts";
import { OverviewDto } from "#/modules/explorer/schema/dto/overview.dto.ts";
import { PlaceInputDto } from "#/modules/explorer/schema/dto/place-input.dto.ts";
import { PlacesDto } from "#/modules/explorer/schema/dto/places.dto.ts";
import { ResolutionDto } from "#/modules/explorer/schema/dto/resolution.dto.ts";
import { SearchInputDto } from "#/modules/explorer/schema/dto/search-input.dto.ts";
import { ExplorerExplorerService } from "./explorer.service.ts";

@Controller()
export class ExplorerExplorerController {
  constructor(private readonly service: ExplorerExplorerService) {}

  @Get("/v1/explorer/copy")
  @HttpCode(200)
  getCopyBundle(@Query() input: CopyInputDto): Promise<CopyBundleDto> {
    return this.service.getCopyBundle(input);
  }

  @Get("/v1/explorer/context")
  @HttpCode(200)
  getExplorerContext(@Query() input: PlaceInputDto): Promise<ContextDto> {
    return this.service.getExplorerContext(input);
  }

  @Get("/v1/explorer/overview")
  @HttpCode(200)
  getExplorerOverview(@Query() input: PlaceInputDto): Promise<OverviewDto> {
    return this.service.getExplorerOverview(input);
  }

  @Get("/v1/explorer/setup")
  @HttpCode(200)
  getSetupBootstrap(@Query() input: BootstrapInputDto): Promise<BootstrapDto> {
    return this.service.getSetupBootstrap(input);
  }

  @Get("/v1/explorer/children")
  @HttpCode(200)
  listExplorerChildren(@Query() input: ChildrenInputDto): Promise<PlacesDto> {
    return this.service.listExplorerChildren(input);
  }

  @Post("/v1/explorer/resolve")
  @HttpCode(200)
  resolveExplorerCoordinates(@Body() input: CoordinatesInputDto): Promise<ResolutionDto> {
    return this.service.resolveExplorerCoordinates(input);
  }

  @Get("/v1/explorer/search")
  @HttpCode(200)
  searchExplorerPlaces(@Query() input: SearchInputDto): Promise<PlacesDto> {
    return this.service.searchExplorerPlaces(input);
  }
}
