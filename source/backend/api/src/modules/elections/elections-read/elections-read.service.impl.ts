import { Injectable } from '@nestjs/common';
import type { CandidateListQueryDto } from '#/modules/elections/dto/candidate-list-query.dto';
import type { CandidateResponseDto } from '#/modules/elections/dto/candidate-response.dto';
import type { CandidatesListResponseDto } from '#/modules/elections/dto/candidates-list-response.dto';
import type { ElectionListQueryDto } from '#/modules/elections/dto/election-list-query.dto';
import type { ElectionResponseDto } from '#/modules/elections/dto/election-response.dto';
import type { ElectionResultListQueryDto } from '#/modules/elections/dto/election-result-list-query.dto';
import type { ElectionResultResponseDto } from '#/modules/elections/dto/election-result-response.dto';
import type { ElectionResultsListResponseDto } from '#/modules/elections/dto/election-results-list-response.dto';
import type { ElectionsListResponseDto } from '#/modules/elections/dto/elections-list-response.dto';
import type { ManifestoCommitmentListQueryDto } from '#/modules/elections/dto/manifesto-commitment-list-query.dto';
import type { ManifestoCommitmentResponseDto } from '#/modules/elections/dto/manifesto-commitment-response.dto';
import type { ManifestoCommitmentsListResponseDto } from '#/modules/elections/dto/manifesto-commitments-list-response.dto';
import type { ManifestoListQueryDto } from '#/modules/elections/dto/manifesto-list-query.dto';
import type { ManifestoResponseDto } from '#/modules/elections/dto/manifesto-response.dto';
import type { ManifestosListResponseDto } from '#/modules/elections/dto/manifestos-list-response.dto';
import type { SeatListQueryDto } from '#/modules/elections/dto/seat-list-query.dto';
import type { SeatResponseDto } from '#/modules/elections/dto/seat-response.dto';
import type { SeatsListResponseDto } from '#/modules/elections/dto/seats-list-response.dto';
import { FindCandidatesUseCase } from '#/modules/elections/elections-read/use-cases/find-candidates.usecase';
import { FindElectionResultsUseCase } from '#/modules/elections/elections-read/use-cases/find-election-results.usecase';
import { FindElectionsUseCase } from '#/modules/elections/elections-read/use-cases/find-elections.usecase';
import { FindManifestoCommitmentsUseCase } from '#/modules/elections/elections-read/use-cases/find-manifesto-commitments.usecase';
import { FindManifestosUseCase } from '#/modules/elections/elections-read/use-cases/find-manifestos.usecase';
import { FindSeatsUseCase } from '#/modules/elections/elections-read/use-cases/find-seats.usecase';
import { GetCandidateByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-candidate-by-id.usecase';
import { GetElectionByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-election-by-id.usecase';
import { GetElectionResultByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-election-result-by-id.usecase';
import { GetManifestoByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-manifesto-by-id.usecase';
import { GetManifestoCommitmentByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-manifesto-commitment-by-id.usecase';
import { GetSeatByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-seat-by-id.usecase';
import type { ElectorateListQueryDto } from '#/modules/elections/dto/electorate-list-query.dto';
import { FindElectoratesUseCase } from '#/modules/elections/elections-read/use-cases/find-electorates.usecase';
import type { ReferendumOptionListQueryDto } from '#/modules/elections/dto/referendum-option-list-query.dto';
import { FindReferendumOptionsUseCase } from '#/modules/elections/elections-read/use-cases/find-referendum-options.usecase';
import type { ReferendumQuestionListQueryDto } from '#/modules/elections/dto/referendum-question-list-query.dto';
import { FindReferendumQuestionsUseCase } from '#/modules/elections/elections-read/use-cases/find-referendum-questions.usecase';
import type { ReferendumResultListQueryDto } from '#/modules/elections/dto/referendum-result-list-query.dto';
import { FindReferendumResultsUseCase } from '#/modules/elections/elections-read/use-cases/find-referendum-results.usecase';
import type { SeatAllocationListQueryDto } from '#/modules/elections/dto/seat-allocation-list-query.dto';
import { FindSeatAllocationsUseCase } from '#/modules/elections/elections-read/use-cases/find-seat-allocations.usecase';
import { GetElectorateByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-electorate-by-id.usecase';
import { GetReferendumOptionByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-referendum-option-by-id.usecase';
import { GetReferendumQuestionByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-referendum-question-by-id.usecase';
import { GetReferendumResultByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-referendum-result-by-id.usecase';
import { GetSeatAllocationByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-seat-allocation-by-id.usecase';

/**
 * Elections Read: implements the generated ElectionsElectionsReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class ElectionsElectionsReadServiceImpl {
  constructor(
    private readonly findCandidatesUseCase: FindCandidatesUseCase,
    private readonly findElectionResultsUseCase: FindElectionResultsUseCase,
    private readonly findElectionsUseCase: FindElectionsUseCase,
    private readonly findManifestoCommitmentsUseCase: FindManifestoCommitmentsUseCase,
    private readonly findManifestosUseCase: FindManifestosUseCase,
    private readonly findSeatsUseCase: FindSeatsUseCase,
    private readonly getCandidateByIdUseCase: GetCandidateByIdUseCase,
    private readonly getElectionByIdUseCase: GetElectionByIdUseCase,
    private readonly getElectionResultByIdUseCase: GetElectionResultByIdUseCase,
    private readonly getManifestoByIdUseCase: GetManifestoByIdUseCase,
    private readonly getManifestoCommitmentByIdUseCase: GetManifestoCommitmentByIdUseCase,
    private readonly getSeatByIdUseCase: GetSeatByIdUseCase,
    private readonly findElectoratesUseCase: FindElectoratesUseCase,
    private readonly findReferendumOptionsUseCase: FindReferendumOptionsUseCase,
    private readonly findReferendumQuestionsUseCase: FindReferendumQuestionsUseCase,
    private readonly findReferendumResultsUseCase: FindReferendumResultsUseCase,
    private readonly findSeatAllocationsUseCase: FindSeatAllocationsUseCase,
    private readonly getElectorateByIdUseCase: GetElectorateByIdUseCase,
    private readonly getReferendumOptionByIdUseCase: GetReferendumOptionByIdUseCase,
    private readonly getReferendumQuestionByIdUseCase: GetReferendumQuestionByIdUseCase,
    private readonly getReferendumResultByIdUseCase: GetReferendumResultByIdUseCase,
    private readonly getSeatAllocationByIdUseCase: GetSeatAllocationByIdUseCase,
  ) {}

  findElectorates(input: ElectorateListQueryDto) {
    return this.findElectoratesUseCase.execute(input);
  }

  findReferendumOptions(input: ReferendumOptionListQueryDto) {
    return this.findReferendumOptionsUseCase.execute(input);
  }

  findReferendumQuestions(input: ReferendumQuestionListQueryDto) {
    return this.findReferendumQuestionsUseCase.execute(input);
  }

  findReferendumResults(input: ReferendumResultListQueryDto) {
    return this.findReferendumResultsUseCase.execute(input);
  }

  findSeatAllocations(input: SeatAllocationListQueryDto) {
    return this.findSeatAllocationsUseCase.execute(input);
  }

  getElectorateById(input: { electorateId: string }) {
    return this.getElectorateByIdUseCase.execute(input);
  }

  getReferendumOptionById(input: { optionId: string }) {
    return this.getReferendumOptionByIdUseCase.execute(input);
  }

  getReferendumQuestionById(input: { questionId: string }) {
    return this.getReferendumQuestionByIdUseCase.execute(input);
  }

  getReferendumResultById(input: { referendumResultId: string }) {
    return this.getReferendumResultByIdUseCase.execute(input);
  }

  getSeatAllocationById(input: { allocationId: string }) {
    return this.getSeatAllocationByIdUseCase.execute(input);
  }

  /** List candidates. */
  findCandidates(input: CandidateListQueryDto) {
    return this.findCandidatesUseCase.execute(input);
  }

  /** List election results. */
  findElectionResults(input: ElectionResultListQueryDto) {
    return this.findElectionResultsUseCase.execute(input);
  }

  /** List elections. */
  findElections(input: ElectionListQueryDto) {
    return this.findElectionsUseCase.execute(input);
  }

  /** List manifesto commitments. */
  findManifestoCommitments(input: ManifestoCommitmentListQueryDto) {
    return this.findManifestoCommitmentsUseCase.execute(input);
  }

  /** List manifestos. */
  findManifestos(input: ManifestoListQueryDto) {
    return this.findManifestosUseCase.execute(input);
  }

  /** List seats. */
  findSeats(input: SeatListQueryDto) {
    return this.findSeatsUseCase.execute(input);
  }

  /** Get candidates by id. */
  getCandidateById(input: { candidateId: string }) {
    return this.getCandidateByIdUseCase.execute(input);
  }

  /** Get elections by id. */
  getElectionById(input: { electionId: string }) {
    return this.getElectionByIdUseCase.execute(input);
  }

  /** Get election results by id. */
  getElectionResultById(input: { resultId: string }) {
    return this.getElectionResultByIdUseCase.execute(input);
  }

  /** Get manifestos by id. */
  getManifestoById(input: { manifestoId: string }) {
    return this.getManifestoByIdUseCase.execute(input);
  }

  /** Get manifesto commitments by id. */
  getManifestoCommitmentById(input: { commitmentId: string }) {
    return this.getManifestoCommitmentByIdUseCase.execute(input);
  }

  /** Get seats by id. */
  getSeatById(input: { seatId: string }) {
    return this.getSeatByIdUseCase.execute(input);
  }
}