import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { CitationInputDto } from "#/modules/locality/schema/dto/citation-input.dto";
import type { EvidenceDetailDto } from "#/modules/locality/schema/dto/evidence-detail.dto";
import { evidenceDetail } from "#/modules/locality/features/places/reads/evidence.ts";

/**
 * One citation with its source, edition, quoted text and the files it points at.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class GetEvidenceUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: CitationInputDto): Promise<EvidenceDetailDto> {
    const detail = await evidenceDetail(this.db, input.citationId);
    if (detail === null) throw new NotFoundException("This citation is not known.");
    return detail;
  }
}
