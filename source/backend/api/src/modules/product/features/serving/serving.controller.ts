import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { ReleaseCollectionDto } from "#/modules/product/schema/dto/release-collection.dto.ts";
import { ReleaseWindowDto } from "#/modules/product/schema/dto/release-window.dto.ts";
import { SiteDetailDto } from "#/modules/product/schema/dto/site-detail.dto.ts";
import { SiteKeyDto } from "#/modules/product/schema/dto/site-key.dto.ts";
import { ProductServingService } from "./serving.service.ts";

@Controller()
export class ProductServingController {
  constructor(private readonly service: ProductServingService) {}

  @Get("/v1/product/site")
  @HttpCode(200)
  getSite(@Query() input: SiteKeyDto): Promise<SiteDetailDto> {
    return this.service.getSite(input);
  }

  @Get("/v1/product/releases")
  @HttpCode(200)
  listReleases(@Query() input: ReleaseWindowDto): Promise<ReleaseCollectionDto> {
    return this.service.listReleases(input);
  }
}
