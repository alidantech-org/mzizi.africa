import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BidEntity } from "#/modules/procurement/entities/bid.entity.ts";
import { ContractMilestoneEntity } from "#/modules/procurement/entities/contract-milestone.entity.ts";
import { ContractVariationEntity } from "#/modules/procurement/entities/contract-variation.entity.ts";
import { ProcurementContractEntity } from "#/modules/procurement/entities/procurement-contract.entity.ts";
import { TenderEntity } from "#/modules/procurement/entities/tender.entity.ts";
import { ProcurementProcurementReadServiceImpl } from "#/modules/procurement/procurement-read/procurement-read.service.impl.ts";
import { FindBidsUseCase } from "#/modules/procurement/procurement-read/use-cases/find-bids.usecase.ts";
import { FindContractMilestonesUseCase } from "#/modules/procurement/procurement-read/use-cases/find-contract-milestones.usecase.ts";
import { FindContractVariationsUseCase } from "#/modules/procurement/procurement-read/use-cases/find-contract-variations.usecase.ts";
import { FindProcurementContractsUseCase } from "#/modules/procurement/procurement-read/use-cases/find-procurement-contracts.usecase.ts";
import { FindTendersUseCase } from "#/modules/procurement/procurement-read/use-cases/find-tenders.usecase.ts";
import { GetBidByIdUseCase } from "#/modules/procurement/procurement-read/use-cases/get-bid-by-id.usecase.ts";
import { GetContractMilestoneByIdUseCase } from "#/modules/procurement/procurement-read/use-cases/get-contract-milestone-by-id.usecase.ts";
import { GetContractVariationByIdUseCase } from "#/modules/procurement/procurement-read/use-cases/get-contract-variation-by-id.usecase.ts";
import { GetProcurementContractByIdUseCase } from "#/modules/procurement/procurement-read/use-cases/get-procurement-contract-by-id.usecase.ts";
import { GetTenderByIdUseCase } from "#/modules/procurement/procurement-read/use-cases/get-tender-by-id.usecase.ts";

import { ProcurementProcurementReadController } from "./procurement-read.controller.ts";
import { ProcurementProcurementReadService } from "./procurement-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BidEntity,
      ContractMilestoneEntity,
      ContractVariationEntity,
      ProcurementContractEntity,
      TenderEntity,
    ]),
  ],
  controllers: [ProcurementProcurementReadController],
  providers: [
    {
      provide: ProcurementProcurementReadService,
      useClass: ProcurementProcurementReadServiceImpl satisfies Type<ProcurementProcurementReadService>,
    },
    FindBidsUseCase,
    FindContractMilestonesUseCase,
    FindContractVariationsUseCase,
    FindProcurementContractsUseCase,
    FindTendersUseCase,
    GetBidByIdUseCase,
    GetContractMilestoneByIdUseCase,
    GetContractVariationByIdUseCase,
    GetProcurementContractByIdUseCase,
    GetTenderByIdUseCase,
  ],
  exports: [ProcurementProcurementReadService],
})
export class ProcurementProcurementReadModule {}