import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { EffectCollectionDto } from "#/modules/legal/schema/dto/effect-collection.dto.ts";
import { IdentityEffectsDto } from "#/modules/legal/schema/dto/identity-effects.dto.ts";
import { InstrumentCollectionDto } from "#/modules/legal/schema/dto/instrument-collection.dto.ts";
import { InstrumentDetailDto } from "#/modules/legal/schema/dto/instrument-detail.dto.ts";
import { InstrumentWindowDto } from "#/modules/legal/schema/dto/instrument-window.dto.ts";
import { ProvisionCollectionDto } from "#/modules/legal/schema/dto/provision-collection.dto.ts";
import { ProvisionScopeDto } from "#/modules/legal/schema/dto/provision-scope.dto.ts";
import { LegalLawService } from "./law.service.ts";

@Controller()
export class LegalLawController {
  constructor(private readonly service: LegalLawService) {}

  @Get("/v1/legal/effects")
  @HttpCode(200)
  listEffects(@Query() input: IdentityEffectsDto): Promise<EffectCollectionDto> {
    return this.service.listEffects(input);
  }

  @Get("/v1/legal/instruments")
  @HttpCode(200)
  listInstruments(@Query() input: InstrumentWindowDto): Promise<InstrumentCollectionDto> {
    return this.service.listInstruments(input);
  }

  @Get("/v1/legal/provisions")
  @HttpCode(200)
  listProvisions(@Query() input: ProvisionScopeDto): Promise<ProvisionCollectionDto> {
    return this.service.listProvisions(input);
  }

  @Get("/v1/legal/instruments/:code")
  @HttpCode(200)
  getInstrument(@Param("code") code: string): Promise<InstrumentDetailDto> {
    return this.service.getInstrument({ code });
  }
}
