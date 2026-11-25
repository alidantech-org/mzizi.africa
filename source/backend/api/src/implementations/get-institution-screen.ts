/** An institution page: its name, arm and offices with their current holders. */
import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PersistenceRuntime } from "#/database/persistence/persistence.runtime";
import type { InstitutionRequestDto } from "#/modules/frontend/schema/dto/institution-request.dto";
import { InstitutionScreenDto } from "#/modules/frontend/schema/dto/institution-screen.dto";
import { getInstitutionRepository } from "#/modules/governance/features/bodies/use-cases/get-institution.repository";
import type { InstitutionDetailDto } from "#/modules/governance/schema/dto/institution-detail.dto";
import { InstitutionKeyDto } from "#/modules/governance/schema/dto/institution-key.dto";
import { call } from "./shared/call";
import { loadCountry } from "./shared/country";

@Injectable()
export class GetInstitutionScreenUseCase {
  /** Optional so HTTP specs can mock the service; the application registers the runtime globally. */
  constructor(@Optional() private readonly injected?: PersistenceRuntime) {}

  private get runtime(): PersistenceRuntime {
    if (!this.injected) throw new Error("PersistenceRuntime must be registered");
    return this.injected;
  }

  async execute(input: InstitutionRequestDto): Promise<InstitutionScreenDto> {
    const { chain } = await loadCountry(this.runtime, input.country, input.lang);
    let detail: InstitutionDetailDto;
    try {
      detail = await call(this.runtime, getInstitutionRepository, InstitutionKeyDto, { code: input.institution });
    } catch {
      throw new NotFoundException(`institution ${input.institution} not found`);
    }
    const offices = [...detail.offices].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return plainToInstance(InstitutionScreenDto, {
      language: chain.primary,
      code: detail.code,
      name: chain.must(detail.names, detail.code),
      offices: offices.map((o) => {
        const current = o.holders.find((h) => h.toYear === null);
        return {
          office: o.code,
          name: chain.must(o.names, o.code),
          holder: current ? chain.pick(current.names) : undefined,
          holderCode: current?.individualCode ?? null,
          fromYear: current?.fromYear ?? null,
        };
      }),
    });
  }
}
