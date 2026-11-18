import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Hosted Station
 */
export class HostedStationDto {
  @IsOptional()
  @ValidateIf((object) => object.ballotsCast !== null)
  @IsInt()
  @Min(0)
  ballotsCast?: NonNegativeInteger | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  electionCode!: NonEmptyString255;

  @IsInt()
  electionYear!: Integer;

  @IsOptional()
  @ValidateIf((object) => object.registeredVoters !== null)
  @IsInt()
  @Min(0)
  registeredVoters?: NonNegativeInteger | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  stationName!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  statusLabel!: Name;

  @IsOptional()
  @ValidateIf((object) => object.streamCount !== null)
  @IsInt()
  @Min(0)
  streamCount?: NonNegativeInteger | null;
}
