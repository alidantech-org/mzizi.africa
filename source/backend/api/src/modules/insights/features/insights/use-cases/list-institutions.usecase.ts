import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { InstitutionsInputDto } from "#/modules/insights/schema/dto/institutions-input.dto";
import type { InstitutionListDto } from "#/modules/insights/schema/dto/institution-list.dto";
import { listInstitutions } from "#/modules/insights/features/insights/reads/institutions.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The read lives in `reads/`. */
@Injectable()
export class ListInstitutionsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: InstitutionsInputDto): Promise<InstitutionListDto> {
    return (await listInstitutions(this.db, input)) as unknown as InstitutionListDto;
  }
}
