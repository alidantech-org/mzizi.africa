import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { CodeInputDto } from "#/modules/insights/schema/dto/code-input.dto";
import type { InstitutionDetailDto } from "#/modules/insights/schema/dto/institution-detail.dto";
import { getInstitution } from "#/modules/insights/features/insights/reads/institutions.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The read lives in `reads/`. */
@Injectable()
export class GetInstitutionUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: CodeInputDto): Promise<InstitutionDetailDto> {
    const found = await getInstitution(this.db, input.code);
    if (found === null) throw new NotFoundException("No such body.");
    return found as unknown as InstitutionDetailDto;
  }
}
