import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { ContextDto } from "#/modules/explorer/schema/dto/context.dto.ts";
import { CountDto } from "#/modules/explorer/schema/dto/count.dto.ts";
import { PlacesDto } from "#/modules/explorer/schema/dto/places.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Overview
 */
export class OverviewDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => PlacesDto)
  children!: PlacesDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => ContextDto)
  context!: ContextDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CountDto)
  counts!: CountDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];
}
