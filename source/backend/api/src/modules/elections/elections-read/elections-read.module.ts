import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CandidateEntity } from "#/modules/elections/entities/candidate.entity.ts";
import { ElectionResultEntity } from "#/modules/elections/entities/election-result.entity.ts";
import { ElectionEntity } from "#/modules/elections/entities/election.entity.ts";
import { ElectorateEntity } from "#/modules/elections/entities/electorate.entity.ts";
import { ManifestoCommitmentEntity } from "#/modules/elections/entities/manifesto-commitment.entity.ts";
import { ManifestoEntity } from "#/modules/elections/entities/manifesto.entity.ts";
import { ReferendumOptionEntity } from "#/modules/elections/entities/referendum-option.entity.ts";
import { ReferendumQuestionEntity } from "#/modules/elections/entities/referendum-question.entity.ts";
import { ReferendumResultEntity } from "#/modules/elections/entities/referendum-result.entity.ts";
import { SeatAllocationEntity } from "#/modules/elections/entities/seat-allocation.entity.ts";
import { SeatEntity } from "#/modules/elections/entities/seat.entity.ts";
import { ElectionsElectionsReadServiceImpl } from "#/modules/elections/elections-read/elections-read.service.impl.ts";
import { FindCandidatesUseCase } from "#/modules/elections/elections-read/use-cases/find-candidates.usecase.ts";
import { FindElectionResultsUseCase } from "#/modules/elections/elections-read/use-cases/find-election-results.usecase.ts";
import { FindElectionsUseCase } from "#/modules/elections/elections-read/use-cases/find-elections.usecase.ts";
import { FindElectoratesUseCase } from "#/modules/elections/elections-read/use-cases/find-electorates.usecase.ts";
import { FindManifestoCommitmentsUseCase } from "#/modules/elections/elections-read/use-cases/find-manifesto-commitments.usecase.ts";
import { FindManifestosUseCase } from "#/modules/elections/elections-read/use-cases/find-manifestos.usecase.ts";
import { FindReferendumOptionsUseCase } from "#/modules/elections/elections-read/use-cases/find-referendum-options.usecase.ts";
import { FindReferendumQuestionsUseCase } from "#/modules/elections/elections-read/use-cases/find-referendum-questions.usecase.ts";
import { FindReferendumResultsUseCase } from "#/modules/elections/elections-read/use-cases/find-referendum-results.usecase.ts";
import { FindSeatAllocationsUseCase } from "#/modules/elections/elections-read/use-cases/find-seat-allocations.usecase.ts";
import { FindSeatsUseCase } from "#/modules/elections/elections-read/use-cases/find-seats.usecase.ts";
import { GetCandidateByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-candidate-by-id.usecase.ts";
import { GetElectionByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-election-by-id.usecase.ts";
import { GetElectionResultByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-election-result-by-id.usecase.ts";
import { GetElectorateByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-electorate-by-id.usecase.ts";
import { GetManifestoByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-manifesto-by-id.usecase.ts";
import { GetManifestoCommitmentByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-manifesto-commitment-by-id.usecase.ts";
import { GetReferendumOptionByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-referendum-option-by-id.usecase.ts";
import { GetReferendumQuestionByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-referendum-question-by-id.usecase.ts";
import { GetReferendumResultByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-referendum-result-by-id.usecase.ts";
import { GetSeatAllocationByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-seat-allocation-by-id.usecase.ts";
import { GetSeatByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-seat-by-id.usecase.ts";

import { ElectionsElectionsReadController } from "./elections-read.controller.ts";
import { ElectionsElectionsReadService } from "./elections-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CandidateEntity,
      ElectionResultEntity,
      ElectionEntity,
      ElectorateEntity,
      ManifestoCommitmentEntity,
      ManifestoEntity,
      ReferendumOptionEntity,
      ReferendumQuestionEntity,
      ReferendumResultEntity,
      SeatAllocationEntity,
      SeatEntity,
    ]),
  ],
  controllers: [ElectionsElectionsReadController],
  providers: [
    {
      provide: ElectionsElectionsReadService,
      useClass: ElectionsElectionsReadServiceImpl satisfies Type<ElectionsElectionsReadService>,
    },
    FindCandidatesUseCase,
    FindElectionResultsUseCase,
    FindElectionsUseCase,
    FindElectoratesUseCase,
    FindManifestoCommitmentsUseCase,
    FindManifestosUseCase,
    FindReferendumOptionsUseCase,
    FindReferendumQuestionsUseCase,
    FindReferendumResultsUseCase,
    FindSeatAllocationsUseCase,
    FindSeatsUseCase,
    GetCandidateByIdUseCase,
    GetElectionByIdUseCase,
    GetElectionResultByIdUseCase,
    GetElectorateByIdUseCase,
    GetManifestoByIdUseCase,
    GetManifestoCommitmentByIdUseCase,
    GetReferendumOptionByIdUseCase,
    GetReferendumQuestionByIdUseCase,
    GetReferendumResultByIdUseCase,
    GetSeatAllocationByIdUseCase,
    GetSeatByIdUseCase,
  ],
  exports: [ElectionsElectionsReadService],
})
export class ElectionsElectionsReadModule {}