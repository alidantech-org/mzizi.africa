import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { PartyPositionHolderPublicDto } from '#/modules/political/dto/party-position-holder-public.dto';
import type { PartyPositionHolderResponseDto } from '#/modules/political/dto/party-position-holder-response.dto';
import type { PartyPositionHolderDto } from '#/modules/political/dto/party-position-holder.dto';
import type { PartyPositionDto } from '#/modules/political/dto/party-position.dto';
import type { PartyUnitDto } from '#/modules/political/dto/party-unit.dto';
import type { PartyDto } from '#/modules/political/dto/party.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { PartyPositionHolderEntity } from '#/modules/political/entities/party-position-holder.entity';

/**
 * Get party position holders by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of PartyPositionHolderEntity); review it and add business rules here.
 */
@Injectable()
export class GetPartyPositionHolderByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PartyPositionHolderEntity);
  }

  private toReadModel(entity: PartyPositionHolderEntity): PartyPositionHolderPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isActing: entity.isActing,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    personId: entity.personId,
    positionId: entity.positionId,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as PartyPositionHolderPublicDto;
  }

  async execute(input: { holderId: string }): Promise<PartyPositionHolderResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.holderId } as never);
    if (!entity) throw new NotFoundException('PartyPositionHolder not found');
    return {
      holder: this.toReadModel(entity),
    } as unknown as PartyPositionHolderResponseDto;
  }
}