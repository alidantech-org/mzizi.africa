import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { IdeologyPublicDto } from '#/modules/political/dto/ideology-public.dto';
import type { IdeologyResponseDto } from '#/modules/political/dto/ideology-response.dto';
import type { IdeologyDto } from '#/modules/political/dto/ideology.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { IdeologyEntity } from '#/modules/political/entities/ideology.entity';

/**
 * Get ideologies by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of IdeologyEntity); review it and add business rules here.
 */
@Injectable()
export class GetIdeologyByIdUseCase {
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

  async execute(input: { ideologyId: string }): Promise<IdeologyResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.ideologyId } as never);
    if (!entity) throw new NotFoundException('Ideology not found');
    return {
      ideology: this.toReadModel(entity),
    } as unknown as IdeologyResponseDto;
  }
}