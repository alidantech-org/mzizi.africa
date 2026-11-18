import { Controller, Get, Headers, HttpCode, Param, Query } from "@nestjs/common";
import { CalendarInputDto } from "#/modules/experience/schema/dto/calendar-input.dto.ts";
import { CalendarDto } from "#/modules/experience/schema/dto/calendar.dto.ts";
import { ContextDto } from "#/modules/experience/schema/dto/context.dto.ts";
import { CopyCatalogDto } from "#/modules/experience/schema/dto/copy-catalog.dto.ts";
import { CopyInputDto } from "#/modules/experience/schema/dto/copy-input.dto.ts";
import { FacilitiesInputDto } from "#/modules/experience/schema/dto/facilities-input.dto.ts";
import { FacilityDetailDto } from "#/modules/experience/schema/dto/facility-detail.dto.ts";
import { FacilityListDto } from "#/modules/experience/schema/dto/facility-list.dto.ts";
import { FactListDto } from "#/modules/experience/schema/dto/fact-list.dto.ts";
import { FactsInputDto } from "#/modules/experience/schema/dto/facts-input.dto.ts";
import { ExperienceExperienceService } from "./experience.service.ts";

@Controller()
export class ExperienceExperienceController {
  constructor(private readonly service: ExperienceExperienceService) {}

  @Get("/v1/calendar")
  @HttpCode(200)
  getCalendar(@Query() input: CalendarInputDto): Promise<CalendarDto> {
    return this.service.getCalendar(input);
  }

  @Get("/v1/context")
  @HttpCode(200)
  getContext(
    @Query("countryCode") countryCode: string,
    @Query("languageCode") languageCode: string,
    @Query("path") path: string,
    @Query("featureId") featureId: string,
    @Headers("cf-ipcountry") edgeCountry: string,
  ): Promise<ContextDto> {
    return this.service.getContext({
      countryCode,
      languageCode,
      path,
      featureId,
      edgeCountry,
    });
  }

  @Get("/v1/copy")
  @HttpCode(200)
  getCopy(@Query() input: CopyInputDto): Promise<CopyCatalogDto> {
    return this.service.getCopy(input);
  }

  @Get("/v1/facilities")
  @HttpCode(200)
  listFacilities(@Query() input: FacilitiesInputDto): Promise<FacilityListDto> {
    return this.service.listFacilities(input);
  }

  @Get("/v1/facts")
  @HttpCode(200)
  listFacts(@Query() input: FactsInputDto): Promise<FactListDto> {
    return this.service.listFacts(input);
  }

  @Get("/v1/facilities/:code")
  @HttpCode(200)
  getFacility(
    @Param("code") code: string,
    @Query("languageCode") languageCode: string,
  ): Promise<FacilityDetailDto> {
    return this.service.getFacility({ code, languageCode });
  }
}
