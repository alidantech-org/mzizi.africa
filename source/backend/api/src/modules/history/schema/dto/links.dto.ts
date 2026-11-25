import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { LinkKind } from "#/modules/history/schema/enum/link-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * How historical occurrences relate to one another. (entity)
 */
export class LinksDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  @Satisfies<LinksDto>((object) => object.fromId !== object.toId, {
    message: "History Link Is Not Self",
  })
  fromId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(LinkKind)
  kind!: LinkKind;

  @IsString()
  @IsUUID()
  toId!: Id;
}
