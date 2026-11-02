import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PersonHandleListQueryDto } from '#/modules/person/dto/person-handle-list-query.dto';
import type { PersonHandlePublicDto } from '#/modules/person/dto/person-handle-public.dto';
import type { PersonHandleDto } from '#/modules/person/dto/person-handle.dto';
import type { PersonHandlesListResponseDto } from '#/modules/person/dto/person-handles-list-response.dto';
import type { PersonDto } from '#/modules/person/dto/person.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { PersonHandleEntity } from '#/modules/person/entities/person-handle.entity';
import { listPage } from '#/read/list-page';
import { PUBLIC_EXPOSURE } from '#/read/public';

/**
 * List public person handles.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PersonHandleEntity); review it and add business rules here.
 */
@Injectable()
export class FindPersonHandlesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PersonHandleEntity);
  }

  private toReadModel(entity: PersonHandleEntity): PersonHandlePublicDto {
    return {
    createdAt: entity.createdAt,
    exposure: entity.exposure,
    handle: entity.handle,
    id: entity.id,
    isCurrent: entity.isCurrent,
    isVerified: entity.isVerified,
    personId: entity.personId,
    platformId: entity.platformId,
    updatedAt: entity.updatedAt,
    url: entity.url,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as PersonHandlePublicDto;
  }

  async execute(input: PersonHandleListQueryDto): Promise<PersonHandlesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input, PUBLIC_EXPOSURE);
    return { handles: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as PersonHandlesListResponseDto;
  }
}
