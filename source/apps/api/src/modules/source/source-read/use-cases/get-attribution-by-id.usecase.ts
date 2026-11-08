import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { AttributionPublicDto } from '#/modules/source/dto/attribution-public.dto';
import type { AttributionResponseDto } from '#/modules/source/dto/attribution-response.dto';
import type { AttributionDto } from '#/modules/source/dto/attribution.dto';
import type { DocumentDto } from '#/modules/source/dto/document.dto';
import type { PublisherDto } from '#/modules/source/dto/publisher.dto';
import { AttributionEntity } from '#/modules/source/entities/attribution.entity';

/**
 * Get attributions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of AttributionEntity); review it and add business rules here.
 */
@Injectable()
export class GetAttributionByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(AttributionEntity);
  }

  private toReadModel(entity: AttributionEntity): AttributionPublicDto {
    return {
    attributedBy: entity.attributedBy,
    captureId: entity.captureId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    documentId: entity.documentId,
    id: entity.id,
    locator: entity.locator,
    methodId: entity.methodId,
    relation: entity.relation,
    targetField: entity.targetField,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as AttributionPublicDto;
  }

  async execute(input: { attributionId: string }): Promise<AttributionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.attributionId } as never);
    if (!entity) throw new NotFoundException('Attribution not found');
    return {
      attribution: this.toReadModel(entity),
    } as unknown as AttributionResponseDto;
  }
}