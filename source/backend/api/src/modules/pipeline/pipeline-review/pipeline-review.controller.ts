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
import { CandidateDetailResponseDto } from "#/modules/pipeline/dto/candidate-detail-response.dto.ts";
import { CandidateListQueryDto } from "#/modules/pipeline/dto/candidate-list-query.dto.ts";
import { CandidateListResponseDto } from "#/modules/pipeline/dto/candidate-list-response.dto.ts";
import { JobListResponseDto } from "#/modules/pipeline/dto/job-list-response.dto.ts";
import { PageQueryDto } from "#/modules/pipeline/dto/page-query.dto.ts";
import { PromoteResponseDto } from "#/modules/pipeline/dto/promote-response.dto.ts";
import { RunListResponseDto } from "#/modules/pipeline/dto/run-list-response.dto.ts";
import { SiteListResponseDto } from "#/modules/pipeline/dto/site-list-response.dto.ts";
import { PipelinePipelineReviewService } from "./pipeline-review.service.ts";

@Controller()
export class PipelinePipelineReviewController {
  constructor(private readonly service: PipelinePipelineReviewService) {}


  @Get("/v1/pipeline/candidates")
  @HttpCode(200)
  findCandidates(
    @Query() input: CandidateListQueryDto,
  ): Promise<CandidateListResponseDto> {
    return this.service.findCandidates(input);
  }


  @Get("/v1/pipeline/jobs")
  @HttpCode(200)
  findJobs(
    @Query() input: PageQueryDto,
  ): Promise<JobListResponseDto> {
    return this.service.findJobs(input);
  }


  @Get("/v1/pipeline/runs")
  @HttpCode(200)
  findRuns(
    @Query() input: PageQueryDto,
  ): Promise<RunListResponseDto> {
    return this.service.findRuns(input);
  }


  @Get("/v1/pipeline/sites")
  @HttpCode(200)
  findSites(
    @Query() input: PageQueryDto,
  ): Promise<SiteListResponseDto> {
    return this.service.findSites(input);
  }


  @Get("/v1/pipeline/candidates/:candidateId")
  @HttpCode(200)
  getCandidateDetail(
    @Param("candidateId") candidateId: string,
  ): Promise<CandidateDetailResponseDto> {
    return this.service.getCandidateDetail({ candidateId });
  }


  @Post("/v1/pipeline/candidates/:candidateId/promote")
  @HttpCode(200)
  promoteCandidate(
    @Param("candidateId") candidateId: string,
  ): Promise<PromoteResponseDto> {
    return this.service.promoteCandidate({ candidateId });
  }
}