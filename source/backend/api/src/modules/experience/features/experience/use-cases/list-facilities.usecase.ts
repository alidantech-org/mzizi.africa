import { Injectable, } from "@nestjs/common";
import { DataSource } from "typeorm";
import { listFacilities } from "#/modules/experience/features/experience/reads/facilities.ts";
import type { FacilitiesInputDto } from "#/modules/experience/schema/dto/facilities-input.dto";
import type { FacilityListDto } from "#/modules/experience/schema/dto/facility-list.dto";

/**
 * Civic infrastructure and offices by class and place: schools, hospitals, police stations, county and constituency offices, polling stations, with capacity and coordinates.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class ListFacilitiesUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: FacilitiesInputDto): Promise<FacilityListDto> {
    return (await listFacilities(this.db, input)) as unknown as FacilityListDto;
  }
}
