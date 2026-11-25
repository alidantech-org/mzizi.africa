import { IsString, IsUUID, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Identity Detail Identifiers
 */
export class IdentityDetailIdentifiersDto {
  @ValidateIf((object) => object.namespace !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  namespace!: NonEmptyString255 | null;

  @IsString()
  @IsUUID()
  schemeTerm!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  value!: NonEmptyString500;
}
