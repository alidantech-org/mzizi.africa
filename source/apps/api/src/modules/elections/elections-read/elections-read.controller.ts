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
import { ElectorateListQueryDto } from "#/modules/elections/dto/electorate-list-query.dto.ts";
import { ElectorateResponseDto } from "#/modules/elections/dto/electorate-response.dto.ts";
import { ElectoratesListResponseDto } from "#/modules/elections/dto/electorates-list-response.dto.ts";
import { ManifestoCommitmentListQueryDto } from "#/modules/elections/dto/manifesto-commitment-list-query.dto.ts";
import { ManifestoCommitmentResponseDto } from "#/modules/elections/dto/manifesto-commitment-response.dto.ts";
import { ManifestoCommitmentsListResponseDto } from "#/modules/elections/dto/manifesto-commitments-list-response.dto.ts";
import { ManifestoListQueryDto } from "#/modules/elections/dto/manifesto-list-query.dto.ts";
import { ManifestoResponseDto } from "#/modules/elections/dto/manifesto-response.dto.ts";
import { ManifestosListResponseDto } from "#/modules/elections/dto/manifestos-list-response.dto.ts";
import { ReferendumOptionListQueryDto } from "#/modules/elections/dto/referendum-option-list-query.dto.ts";
import { ReferendumOptionResponseDto } from "#/modules/elections/dto/referendum-option-response.dto.ts";
import { ReferendumOptionsListResponseDto } from "#/modules/elections/dto/referendum-options-list-response.dto.ts";
import { ReferendumQuestionListQueryDto } from "#/modules/elections/dto/referendum-question-list-query.dto.ts";
import { ReferendumQuestionResponseDto } from "#/modules/elections/dto/referendum-question-response.dto.ts";
import { ReferendumQuestionsListResponseDto } from "#/modules/elections/dto/referendum-questions-list-response.dto.ts";
import { ReferendumResultListQueryDto } from "#/modules/elections/dto/referendum-result-list-query.dto.ts";
import { ReferendumResultResponseDto } from "#/modules/elections/dto/referendum-result-response.dto.ts";
import { ReferendumResultsListResponseDto } from "#/modules/elections/dto/referendum-results-list-response.dto.ts";
import { SeatAllocationListQueryDto } from "#/modules/elections/dto/seat-allocation-list-query.dto.ts";
import { SeatAllocationResponseDto } from "#/modules/elections/dto/seat-allocation-response.dto.ts";
import { SeatAllocationsListResponseDto } from "#/modules/elections/dto/seat-allocations-list-response.dto.ts";
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


  @Get("/v1/elections/electorates")
  @HttpCode(200)
  findElectorates(
    @Query() input: ElectorateListQueryDto,
  ): Promise<ElectoratesListResponseDto> {
    return this.service.findElectorates(input);
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


  @Get("/v1/elections/referendum-options")
  @HttpCode(200)
  findReferendumOptions(
    @Query() input: ReferendumOptionListQueryDto,
  ): Promise<ReferendumOptionsListResponseDto> {
    return this.service.findReferendumOptions(input);
  }


  @Get("/v1/elections/referendum-questions")
  @HttpCode(200)
  findReferendumQuestions(
    @Query() input: ReferendumQuestionListQueryDto,
  ): Promise<ReferendumQuestionsListResponseDto> {
    return this.service.findReferendumQuestions(input);
  }


  @Get("/v1/elections/referendum-results")
  @HttpCode(200)
  findReferendumResults(
    @Query() input: ReferendumResultListQueryDto,
  ): Promise<ReferendumResultsListResponseDto> {
    return this.service.findReferendumResults(input);
  }


  @Get("/v1/elections/seat-allocations")
  @HttpCode(200)
  findSeatAllocations(
    @Query() input: SeatAllocationListQueryDto,
  ): Promise<SeatAllocationsListResponseDto> {
    return this.service.findSeatAllocations(input);
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


  @Get("/v1/elections/electorates/:electorateId")
  @HttpCode(200)
  getElectorateById(
    @Param("electorateId") electorateId: string,
  ): Promise<ElectorateResponseDto> {
    return this.service.getElectorateById({ electorateId });
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


  @Get("/v1/elections/referendum-options/:optionId")
  @HttpCode(200)
  getReferendumOptionById(
    @Param("optionId") optionId: string,
  ): Promise<ReferendumOptionResponseDto> {
    return this.service.getReferendumOptionById({ optionId });
  }


  @Get("/v1/elections/referendum-questions/:questionId")
  @HttpCode(200)
  getReferendumQuestionById(
    @Param("questionId") questionId: string,
  ): Promise<ReferendumQuestionResponseDto> {
    return this.service.getReferendumQuestionById({ questionId });
  }


  @Get("/v1/elections/referendum-results/:referendumResultId")
  @HttpCode(200)
  getReferendumResultById(
    @Param("referendumResultId") referendumResultId: string,
  ): Promise<ReferendumResultResponseDto> {
    return this.service.getReferendumResultById({ referendumResultId });
  }


  @Get("/v1/elections/seat-allocations/:allocationId")
  @HttpCode(200)
  getSeatAllocationById(
    @Param("allocationId") allocationId: string,
  ): Promise<SeatAllocationResponseDto> {
    return this.service.getSeatAllocationById({ allocationId });
  }


  @Get("/v1/elections/seats/:seatId")
  @HttpCode(200)
  getSeatById(
    @Param("seatId") seatId: string,
  ): Promise<SeatResponseDto> {
    return this.service.getSeatById({ seatId });
  }
}