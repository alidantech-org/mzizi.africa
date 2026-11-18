import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { LegalBasisInputDto } from "#/modules/insights/schema/dto/legal-basis-input.dto";
import type { LegalBasisDto } from "#/modules/insights/schema/dto/legal-basis.dto";
import { legalBasisFor } from "#/modules/insights/features/insights/reads/legal.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The read lives in `reads/`. */
@Injectable()
export class GetLegalBasisUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: LegalBasisInputDto): Promise<LegalBasisDto> {
    const items = await legalBasisFor(this.db, input.subjectTable, input.subjectCode);
    return {
      subject: { table: input.subjectTable, code: input.subjectCode },
      items,
      gaps: items.length === 0 ? ["No Constitution article or Act is recorded for this yet."] : [],
    } as unknown as LegalBasisDto;
  }
}
