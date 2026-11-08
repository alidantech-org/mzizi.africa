import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { IdeologiesListResponseDto } from '#/modules/political/dto/ideologies-list-response.dto';
import type { IdeologyListQueryDto } from '#/modules/political/dto/ideology-list-query.dto';
import type { IdeologyPublicDto } from '#/modules/political/dto/ideology-public.dto';
import type { IdeologyDto } from '#/modules/political/dto/ideology.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { IdeologyEntity } from '#/modules/political/entities/ideology.entity';
import { listPage } from '#/read/list-page';

/**
 * List ideologies.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of IdeologyEntity); review it and add business rules here.
 */
@Injectable()
export class FindIdeologiesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(IdeologyEntity);
  }

  private toReadModel(entity: IdeologyEntity): IdeologyPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    label: entity.label,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as IdeologyPublicDto;
  }

  async execute(input: IdeologyListQueryDto): Promise<IdeologiesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { ideologies: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as IdeologiesListResponseDto;
  }
}
