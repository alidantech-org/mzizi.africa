import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { DimensionMemberPublicDto } from '#/modules/statistics/dto/dimension-member-public.dto';
import type { DimensionMemberResponseDto } from '#/modules/statistics/dto/dimension-member-response.dto';
import type { DimensionMemberDto } from '#/modules/statistics/dto/dimension-member.dto';
import type { DimensionDto } from '#/modules/statistics/dto/dimension.dto';
import { DimensionMemberEntity } from '#/modules/statistics/entities/dimension-member.entity';

/**
 * Get dimension members by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of DimensionMemberEntity); review it and add business rules here.
 */
@Injectable()
export class GetDimensionMemberByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(DimensionMemberEntity);
  }

  private toReadModel(entity: DimensionMemberEntity): DimensionMemberPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    dimensionId: entity.dimensionId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    label: entity.label,
    parentId: entity.parentId,
    referenceCode: entity.referenceCode,
    sortOrder: entity.sortOrder,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as DimensionMemberPublicDto;
  }

  async execute(input: { memberId: string }): Promise<DimensionMemberResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.memberId } as never);
    if (!entity) throw new NotFoundException('DimensionMember not found');
    return {
      member: this.toReadModel(entity),
    } as unknown as DimensionMemberResponseDto;
  }
}