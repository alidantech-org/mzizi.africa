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
  ) {}

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