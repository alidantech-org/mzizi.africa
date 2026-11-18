import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { getFacility } from "#/modules/experience/features/experience/reads/facilities.ts";
import type { FacilityDetailDto } from "#/modules/experience/schema/dto/facility-detail.dto";
import type { FacilityKeyDto } from "#/modules/experience/schema/dto/facility-key.dto";

/**
 * One facility with its capacity, the places it is in and the polling stations it hosts.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class GetFacilityUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: FacilityKeyDto): Promise<FacilityDetailDto> {
    const found = await getFacility(this.db, input);
    if (!found) throw new NotFoundException("No facility has that code.");
    return found as unknown as FacilityDetailDto;
  }
}
