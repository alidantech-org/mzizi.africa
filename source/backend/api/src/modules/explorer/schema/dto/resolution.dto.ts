import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { PlaceDto } from "#/modules/explorer/schema/dto/place.dto.ts";
import { ResolutionStatus } from "#/modules/explorer/schema/enum/resolution-status.enum.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Resolution
 */
export class ResolutionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceDto)
  candidates!: PlaceDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsEnum(ResolutionStatus)
  status!: ResolutionStatus;
}
