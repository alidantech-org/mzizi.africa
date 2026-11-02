import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CandidateEntity } from "#/modules/elections/entities/candidate.entity.ts";
import { ElectionResultEntity } from "#/modules/elections/entities/election-result.entity.ts";
import { ElectionEntity } from "#/modules/elections/entities/election.entity.ts";
import { ManifestoCommitmentEntity } from "#/modules/elections/entities/manifesto-commitment.entity.ts";
import { ManifestoEntity } from "#/modules/elections/entities/manifesto.entity.ts";
import { SeatEntity } from "#/modules/elections/entities/seat.entity.ts";
import { ElectionsElectionsReadServiceImpl } from "#/modules/elections/elections-read/elections-read.service.impl.ts";
import { FindCandidatesUseCase } from "#/modules/elections/elections-read/use-cases/find-candidates.usecase.ts";
import { FindElectionResultsUseCase } from "#/modules/elections/elections-read/use-cases/find-election-results.usecase.ts";
import { FindElectionsUseCase } from "#/modules/elections/elections-read/use-cases/find-elections.usecase.ts";
import { FindManifestoCommitmentsUseCase } from "#/modules/elections/elections-read/use-cases/find-manifesto-commitments.usecase.ts";
import { FindManifestosUseCase } from "#/modules/elections/elections-read/use-cases/find-manifestos.usecase.ts";
import { FindSeatsUseCase } from "#/modules/elections/elections-read/use-cases/find-seats.usecase.ts";
import { GetCandidateByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-candidate-by-id.usecase.ts";
import { GetElectionByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-election-by-id.usecase.ts";
import { GetElectionResultByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-election-result-by-id.usecase.ts";
import { GetManifestoByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-manifesto-by-id.usecase.ts";
import { GetManifestoCommitmentByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-manifesto-commitment-by-id.usecase.ts";
import { GetSeatByIdUseCase } from "#/modules/elections/elections-read/use-cases/get-seat-by-id.usecase.ts";

import { ElectionsElectionsReadController } from "./elections-read.controller.ts";
import { ElectionsElectionsReadService } from "./elections-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CandidateEntity,
      ElectionResultEntity,
      ElectionEntity,
      ManifestoCommitmentEntity,
      ManifestoEntity,
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
    FindManifestoCommitmentsUseCase,
    FindManifestosUseCase,
    FindSeatsUseCase,
    GetCandidateByIdUseCase,
    GetElectionByIdUseCase,
    GetElectionResultByIdUseCase,
    GetManifestoByIdUseCase,
    GetManifestoCommitmentByIdUseCase,
    GetSeatByIdUseCase,
  ],
  exports: [ElectionsElectionsReadService],
})
export class ElectionsElectionsReadModule {}