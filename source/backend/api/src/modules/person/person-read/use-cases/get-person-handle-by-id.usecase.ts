import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { PersonHandlePublicDto } from '#/modules/person/dto/person-handle-public.dto';
import type { PersonHandleResponseDto } from '#/modules/person/dto/person-handle-response.dto';
import type { PersonHandleDto } from '#/modules/person/dto/person-handle.dto';
import type { PersonDto } from '#/modules/person/dto/person.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { PersonHandleEntity } from '#/modules/person/entities/person-handle.entity';
import { PUBLIC_EXPOSURE } from '#/read/public';

/**
 * Get public person handles by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of PersonHandleEntity); review it and add business rules here.
 */
@Injectable()
export class GetPersonHandleByIdUseCase {
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

  async execute(input: { handleId: string }): Promise<PersonHandleResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.handleId, ...PUBLIC_EXPOSURE } as never);
    if (!entity) throw new NotFoundException('PersonHandle not found');
    return {
      handle: this.toReadModel(entity),
    } as unknown as PersonHandleResponseDto;
  }
}