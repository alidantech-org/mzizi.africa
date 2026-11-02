import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { PartyPositionPublicDto } from '#/modules/political/dto/party-position-public.dto';
import type { PartyPositionResponseDto } from '#/modules/political/dto/party-position-response.dto';
import type { PartyPositionDto } from '#/modules/political/dto/party-position.dto';
import type { PartyUnitDto } from '#/modules/political/dto/party-unit.dto';
import type { PartyDto } from '#/modules/political/dto/party.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { PartyPositionEntity } from '#/modules/political/entities/party-position.entity';

/**
 * Get party positions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of PartyPositionEntity); review it and add business rules here.
 */
@Injectable()
export class GetPartyPositionByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PartyPositionEntity);
  }

  private toReadModel(entity: PartyPositionEntity): PartyPositionPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    title: entity.title,
    toolOrModel: entity.toolOrModel,
    unitId: entity.unitId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as PartyPositionPublicDto;
  }

  async execute(input: { positionId: string }): Promise<PartyPositionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.positionId } as never);
    if (!entity) throw new NotFoundException('PartyPosition not found');
    return {
      position: this.toReadModel(entity),
    } as unknown as PartyPositionResponseDto;
  }
}