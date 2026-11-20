import { DataSource } from "typeorm";
import { copyBundle } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import { Injectable } from "@nestjs/common";
import type { CopyBundleDto } from "#/modules/explorer/schema/dto/copy-bundle.dto";
import type { CopyInputDto } from "#/modules/explorer/schema/dto/copy-input.dto";

/**
 * Every recorded wording for one language, optionally one area and country wording, with a content hash for long-lived caching. Words are never taken from another language.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Delegates composition to the project-owned typed reader.
 */
@Injectable()
export class GetCopyBundleUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: CopyInputDto): Promise<CopyBundleDto> {
    return copyBundle(this.db, input);
  }
}
