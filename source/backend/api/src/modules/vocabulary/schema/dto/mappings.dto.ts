import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { MappingKind } from "#/modules/vocabulary/schema/enum/mapping-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Links between terms across schemes and countries. Loops in broader and narrower links are refused by Mzizi's write code. (entity)
 */
export class MappingsDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  @Satisfies<MappingsDto>((object) => object.fromId !== object.toId, {
    message: "Mapping Is Not Itself",
  })
  fromId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(MappingKind)
  kind!: MappingKind;

  @IsString()
  @IsUUID()
  toId!: Id;
}
