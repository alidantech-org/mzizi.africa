import { Injectable } from '@nestjs/common';
import type { ProcurementContractListQueryDto } from '#/modules/procurement/dto/procurement-contract-list-query.dto';
import { FindProcurementContractsUseCase } from '#/modules/procurement/procurement-read/use-cases/find-procurement-contracts.usecase';
import { GetProcurementContractByIdUseCase } from '#/modules/procurement/procurement-read/use-cases/get-procurement-contract-by-id.usecase';
import type { BidListQueryDto } from '#/modules/procurement/dto/bid-list-query.dto';
import type { BidResponseDto } from '#/modules/procurement/dto/bid-response.dto';
import type { BidsListResponseDto } from '#/modules/procurement/dto/bids-list-response.dto';
import type { ContractMilestoneListQueryDto } from '#/modules/procurement/dto/contract-milestone-list-query.dto';
import type { ContractMilestoneResponseDto } from '#/modules/procurement/dto/contract-milestone-response.dto';
import type { ContractMilestonesListResponseDto } from '#/modules/procurement/dto/contract-milestones-list-response.dto';
import type { ContractVariationListQueryDto } from '#/modules/procurement/dto/contract-variation-list-query.dto';
import type { ContractVariationResponseDto } from '#/modules/procurement/dto/contract-variation-response.dto';
import type { ContractVariationsListResponseDto } from '#/modules/procurement/dto/contract-variations-list-response.dto';
import type { TenderListQueryDto } from '#/modules/procurement/dto/tender-list-query.dto';
import type { TenderResponseDto } from '#/modules/procurement/dto/tender-response.dto';
import type { TendersListResponseDto } from '#/modules/procurement/dto/tenders-list-response.dto';
import { FindBidsUseCase } from '#/modules/procurement/procurement-read/use-cases/find-bids.usecase';
import { FindContractMilestonesUseCase } from '#/modules/procurement/procurement-read/use-cases/find-contract-milestones.usecase';
import { FindContractVariationsUseCase } from '#/modules/procurement/procurement-read/use-cases/find-contract-variations.usecase';
import { FindTendersUseCase } from '#/modules/procurement/procurement-read/use-cases/find-tenders.usecase';
import { GetBidByIdUseCase } from '#/modules/procurement/procurement-read/use-cases/get-bid-by-id.usecase';
import { GetContractMilestoneByIdUseCase } from '#/modules/procurement/procurement-read/use-cases/get-contract-milestone-by-id.usecase';
import { GetContractVariationByIdUseCase } from '#/modules/procurement/procurement-read/use-cases/get-contract-variation-by-id.usecase';
import { GetTenderByIdUseCase } from '#/modules/procurement/procurement-read/use-cases/get-tender-by-id.usecase';

/**
 * Procurement Read: implements the generated ProcurementProcurementReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class ProcurementProcurementReadServiceImpl {
  constructor(
    private readonly findBidsUseCase: FindBidsUseCase,
    private readonly findContractMilestonesUseCase: FindContractMilestonesUseCase,
    private readonly findContractVariationsUseCase: FindContractVariationsUseCase,
    private readonly findProcurementContractsUseCase: FindProcurementContractsUseCase,
    private readonly findTendersUseCase: FindTendersUseCase,
    private readonly getBidByIdUseCase: GetBidByIdUseCase,
    private readonly getContractMilestoneByIdUseCase: GetContractMilestoneByIdUseCase,
    private readonly getContractVariationByIdUseCase: GetContractVariationByIdUseCase,
    private readonly getProcurementContractByIdUseCase: GetProcurementContractByIdUseCase,
    private readonly getTenderByIdUseCase: GetTenderByIdUseCase,
  ) {}

  /** List bids. */
  findBids(input: BidListQueryDto) {
    return this.findBidsUseCase.execute(input);
  }

  /** List contract milestones. */
  findContractMilestones(input: ContractMilestoneListQueryDto) {
    return this.findContractMilestonesUseCase.execute(input);
  }

  /** List contract variations. */
  findContractVariations(input: ContractVariationListQueryDto) {
    return this.findContractVariationsUseCase.execute(input);
  }

  /** List procurement contracts. */
  findProcurementContracts(input: ProcurementContractListQueryDto) {
    return this.findProcurementContractsUseCase.execute(input);
  }

  /** Get procurement contracts by id. */
  getProcurementContractById(input: { contractId: string }) {
    return this.getProcurementContractByIdUseCase.execute(input);
  }

  /** List tenders. */
  findTenders(input: TenderListQueryDto) {
    return this.findTendersUseCase.execute(input);
  }

  /** Get bids by id. */
  getBidById(input: { bidId: string }) {
    return this.getBidByIdUseCase.execute(input);
  }

  /** Get contract milestones by id. */
  getContractMilestoneById(input: { milestoneId: string }) {
    return this.getContractMilestoneByIdUseCase.execute(input);
  }

  /** Get contract variations by id. */
  getContractVariationById(input: { variationId: string }) {
    return this.getContractVariationByIdUseCase.execute(input);
  }

  /** Get tenders by id. */
  getTenderById(input: { tenderId: string }) {
    return this.getTenderByIdUseCase.execute(input);
  }
}