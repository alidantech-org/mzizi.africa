import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import type { GeographyGovernanceResponseDto } from '#/modules/governance/dto/geography-governance-response.dto';
import { InstitutionEntity } from '#/modules/governance/entities/institution.entity';
import { OfficeHolderEntity } from '#/modules/governance/entities/office-holder.entity';
import { OfficeEntity } from '#/modules/governance/entities/office.entity';

/**
 * Institutions with this territorial scope, their offices and current office holders.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class GetGeographyGovernanceUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async execute(input: { entityId: string }): Promise<GeographyGovernanceResponseDto> {
    const [unit] = await this.dataSource.query(`SELECT id FROM geography.units WHERE id = $1`, [input.entityId]);
    if (!unit) throw new NotFoundException('geography entity not found');
    const institutions = await this.dataSource.getRepository(InstitutionEntity).find({
      where: { geoUnitId: input.entityId, isCurrent: true },
      order: { name: 'ASC' },
    });
    const institutionIds = institutions.map((institution) => institution.id);
    const offices = institutionIds.length
      ? await this.dataSource.getRepository(OfficeEntity).find({ where: { institutionId: In(institutionIds), isCurrent: true }, order: { name: 'ASC' } })
      : [];
    const officeIds = offices.map((office) => office.id);
    const holders = officeIds.length
      ? await this.dataSource.getRepository(OfficeHolderEntity).find({ where: { officeId: In(officeIds), isCurrent: true } })
      : [];
    return { institutions, offices, holders } as unknown as GeographyGovernanceResponseDto;
  }
}
