import { IsNumber, IsOptional, ValidateIf } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Place Civic Infrastructure
 */
export class PlaceCivicInfrastructureDto {
  @IsOptional()
  @ValidateIf((object) => object.areaKm2 !== null)
  @IsNumber({})
  areaKm2?: Number | null;

  @IsNumber({})
  completed!: Number;

  @IsOptional()
  @ValidateIf((object) => object.completionRate !== null)
  @IsNumber({})
  completionRate?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.per100k !== null)
  @IsNumber({})
  per100k?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.perKm2 !== null)
  @IsNumber({})
  perKm2?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.population !== null)
  @IsNumber({})
  population?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.projectShare !== null)
  @IsNumber({})
  projectShare?: Number | null;

  @IsNumber({})
  projects!: Number;

  @IsOptional()
  @ValidateIf((object) => object.staffShare !== null)
  @IsNumber({})
  staffShare?: Number | null;
}
