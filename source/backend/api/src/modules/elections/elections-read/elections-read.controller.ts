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
import { CandidateListQueryDto } from "#/modules/elections/dto/candidate-list-query.dto.ts";
import { CandidateResponseDto } from "#/modules/elections/dto/candidate-response.dto.ts";
import { CandidatesListResponseDto } from "#/modules/elections/dto/candidates-list-response.dto.ts";
import { ElectionListQueryDto } from "#/modules/elections/dto/election-list-query.dto.ts";
import { ElectionResponseDto } from "#/modules/elections/dto/election-response.dto.ts";
import { ElectionResultListQueryDto } from "#/modules/elections/dto/election-result-list-query.dto.ts";
import { ElectionResultResponseDto } from "#/modules/elections/dto/election-result-response.dto.ts";
import { ElectionResultsListResponseDto } from "#/modules/elections/dto/election-results-list-response.dto.ts";
import { ElectionsListResponseDto } from "#/modules/elections/dto/elections-list-response.dto.ts";
import { ManifestoCommitmentListQueryDto } from "#/modules/elections/dto/manifesto-commitment-list-query.dto.ts";
import { ManifestoCommitmentResponseDto } from "#/modules/elections/dto/manifesto-commitment-response.dto.ts";
import { ManifestoCommitmentsListResponseDto } from "#/modules/elections/dto/manifesto-commitments-list-response.dto.ts";
import { ManifestoListQueryDto } from "#/modules/elections/dto/manifesto-list-query.dto.ts";
import { ManifestoResponseDto } from "#/modules/elections/dto/manifesto-response.dto.ts";
import { ManifestosListResponseDto } from "#/modules/elections/dto/manifestos-list-response.dto.ts";
import { SeatListQueryDto } from "#/modules/elections/dto/seat-list-query.dto.ts";
import { SeatResponseDto } from "#/modules/elections/dto/seat-response.dto.ts";
import { SeatsListResponseDto } from "#/modules/elections/dto/seats-list-response.dto.ts";
import { ElectionsElectionsReadService } from "./elections-read.service.ts";

@Controller()
export class ElectionsElectionsReadController {
  constructor(private readonly service: ElectionsElectionsReadService) {}


  @Get("/v1/elections/candidates")
  @HttpCode(200)
  findCandidates(
    @Query() input: CandidateListQueryDto,
  ): Promise<CandidatesListResponseDto> {
    return this.service.findCandidates(input);
  }


  @Get("/v1/elections/results")
  @HttpCode(200)
  findElectionResults(
    @Query() input: ElectionResultListQueryDto,
  ): Promise<ElectionResultsListResponseDto> {
    return this.service.findElectionResults(input);
  }


  @Get("/v1/elections/elections")
  @HttpCode(200)
  findElections(
    @Query() input: ElectionListQueryDto,
  ): Promise<ElectionsListResponseDto> {
    return this.service.findElections(input);
  }


  @Get("/v1/elections/manifesto-commitments")
  @HttpCode(200)
  findManifestoCommitments(
    @Query() input: ManifestoCommitmentListQueryDto,
  ): Promise<ManifestoCommitmentsListResponseDto> {
    return this.service.findManifestoCommitments(input);
  }


  @Get("/v1/elections/manifestos")
  @HttpCode(200)
  findManifestos(
    @Query() input: ManifestoListQueryDto,
  ): Promise<ManifestosListResponseDto> {
    return this.service.findManifestos(input);
  }


  @Get("/v1/elections/seats")
  @HttpCode(200)
  findSeats(
    @Query() input: SeatListQueryDto,
  ): Promise<SeatsListResponseDto> {
    return this.service.findSeats(input);
  }


  @Get("/v1/elections/candidates/:candidateId")
  @HttpCode(200)
  getCandidateById(
    @Param("candidateId") candidateId: string,
  ): Promise<CandidateResponseDto> {
    return this.service.getCandidateById({ candidateId });
  }


  @Get("/v1/elections/elections/:electionId")
  @HttpCode(200)
  getElectionById(
    @Param("electionId") electionId: string,
  ): Promise<ElectionResponseDto> {
    return this.service.getElectionById({ electionId });
  }


  @Get("/v1/elections/results/:resultId")
  @HttpCode(200)
  getElectionResultById(
    @Param("resultId") resultId: string,
  ): Promise<ElectionResultResponseDto> {
    return this.service.getElectionResultById({ resultId });
  }


  @Get("/v1/elections/manifestos/:manifestoId")
  @HttpCode(200)
  getManifestoById(
    @Param("manifestoId") manifestoId: string,
  ): Promise<ManifestoResponseDto> {
    return this.service.getManifestoById({ manifestoId });
  }


  @Get("/v1/elections/manifesto-commitments/:commitmentId")
  @HttpCode(200)
  getManifestoCommitmentById(
    @Param("commitmentId") commitmentId: string,
  ): Promise<ManifestoCommitmentResponseDto> {
    return this.service.getManifestoCommitmentById({ commitmentId });
  }


  @Get("/v1/elections/seats/:seatId")
  @HttpCode(200)
  getSeatById(
    @Param("seatId") seatId: string,
  ): Promise<SeatResponseDto> {
    return this.service.getSeatById({ seatId });
  }
}