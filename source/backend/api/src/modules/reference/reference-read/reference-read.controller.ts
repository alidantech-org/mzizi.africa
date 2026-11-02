import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";

import { Cookie } from "#/modules/common/server/http/cookie.decorator.ts";
import { ClassificationRecordListQueryDto } from "#/modules/reference/dto/classification-record-list-query.dto.ts";
import { ClassificationRecordResponseDto } from "#/modules/reference/dto/classification-record-response.dto.ts";
import { ClassificationRecordsListResponseDto } from "#/modules/reference/dto/classification-records-list-response.dto.ts";
import { JurisdictionListQueryDto } from "#/modules/reference/dto/jurisdiction-list-query.dto.ts";
import { JurisdictionResponseDto } from "#/modules/reference/dto/jurisdiction-response.dto.ts";
import { JurisdictionsListResponseDto } from "#/modules/reference/dto/jurisdictions-list-response.dto.ts";
import { ReferenceReferenceReadService } from "./reference-read.service.ts";

@Controller()
export class ReferenceReferenceReadController {
  constructor(private readonly service: ReferenceReferenceReadService) {}


  @Get("/v1/reference/classification-records")
  @HttpCode(200)
  findClassificationRecords(
    @Query() input: ClassificationRecordListQueryDto,
  ): Promise<ClassificationRecordsListResponseDto> {
    return this.service.findClassificationRecords(input);
  }


  @Get("/v1/reference/jurisdictions")
  @HttpCode(200)
  findJurisdictions(
    @Query() input: JurisdictionListQueryDto,
  ): Promise<JurisdictionsListResponseDto> {
    return this.service.findJurisdictions(input);
  }


  @Get("/v1/reference/classification-records/:recordId")
  @HttpCode(200)
  getClassificationRecordById(
    @Param("recordId") recordId: string,
  ): Promise<ClassificationRecordResponseDto> {
    return this.service.getClassificationRecordById({ recordId });
  }


  @Get("/v1/reference/jurisdictions/:jurisdictionId")
  @HttpCode(200)
  getJurisdictionById(
    @Param("jurisdictionId") jurisdictionId: string,
  ): Promise<JurisdictionResponseDto> {
    return this.service.getJurisdictionById({ jurisdictionId });
  }
}